"use client";
import {Button} from "@my-project/react-components";
import {getClientSideUrl} from "@my-project/utils";
import type {Form as FormType} from "@payloadcms/plugin-form-builder/types";
import {useRouter} from "next/navigation";
import type React from "react";
import {useCallback, useState} from "react";
import {FormProvider, useForm} from "react-hook-form";

import {buildInitialFormState} from "./buildInitialFormState";
import {fields} from "./fields";

import {RichText} from "~/components/utils/RichText";

export type Value = unknown;

export type Property = Record<string, Value>;

export type Data = Record<string, Property | Property[]>;

export interface FormBlockType {
    blockName?: string;
    blockType?: "formBlock";
    enableIntro: boolean;
    form: FormType;
    introContent?: Array<Record<string, unknown>>;
}

export const FormBlock: React.FC<
    {
        id?: string;
    } & FormBlockType
> = (props) => {
    const {
        enableIntro,
        form: formFromProps,
        form: {
            id: formID,
            confirmationMessage,
            confirmationType,
            redirect,
            submitButtonLabel,
        } = {},
        introContent,
    } = props;

    const formMethods = useForm({
        defaultValues: buildInitialFormState(formFromProps.fields),
    });
    const {
        control,
        formState: {errors},
        handleSubmit,
        register,
    } = formMethods;

    const [isLoading, setIsLoading] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState<boolean>();
    const [error, setError] = useState<
        {message: string; status?: string} | undefined
    >();
    const router = useRouter();

    const onSubmit = useCallback(
        (data: Data) => {
            let loadingTimerID: ReturnType<typeof setTimeout>;
            const submitForm = async () => {
                setError(undefined);

                const dataToSend = Object.entries(data).map(
                    ([name, value]) => ({
                        field: name,
                        value,
                    }),
                );

                // delay loading indicator by 1s
                loadingTimerID = setTimeout(() => {
                    setIsLoading(true);
                }, 1000);

                try {
                    const request = await fetch(
                        `${getClientSideUrl()}/api/form-submissions`,
                        {
                            body: JSON.stringify({
                                form: formID,
                                submissionData: dataToSend,
                            }),
                            headers: {
                                "Content-Type": "application/json",
                            },
                            method: "POST",
                        },
                    );

                    const res = await request.json();

                    clearTimeout(loadingTimerID);

                    if (request.status >= 400) {
                        setIsLoading(false);

                        setError({
                            message:
                                res.errors?.[0]?.message ||
                                "Internal Server Error",
                            status: res.status,
                        });

                        return;
                    }

                    setIsLoading(false);
                    setHasSubmitted(true);

                    if (confirmationType === "redirect" && redirect) {
                        const {url} = redirect;

                        const redirectUrl = url;

                        if (redirectUrl) router.push(redirectUrl);
                    }
                } catch (error_) {
                    console.warn(error_);
                    setIsLoading(false);
                    setError({
                        message: "Something went wrong.",
                    });
                }
            };

            void submitForm();
        },
        [router, formID, redirect, confirmationType],
    );

    return (
        <div className={"container lg:max-w-[48rem]"}>
            {enableIntro && introContent && !hasSubmitted && (
                <RichText
                    className={"mb-8 lg:mb-12"}
                    content={introContent}
                    enableGutter={false}
                />
            )}
            <div className={"rounded-[0.8rem] border border-border p-4 lg:p-6"}>
                <FormProvider {...formMethods}>
                    {!isLoading &&
                        hasSubmitted &&
                        confirmationType === "message" && (
                            <RichText content={confirmationMessage} />
                        )}
                    {isLoading && !hasSubmitted && (
                        <p>Loading, please wait...</p>
                    )}
                    {error && (
                        <div>{`${error.status || "500"}: ${error.message || ""}`}</div>
                    )}
                    {!hasSubmitted && (
                        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                            <div className={"mb-4 last:mb-0"}>
                                {formFromProps &&
                                    formFromProps.fields &&
                                    formFromProps.fields?.map(
                                        (field, index) => {
                                            const Field: React.FC<any> =
                                                fields?.[field.blockType];
                                            if (Field) {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={
                                                            "mb-6 last:mb-0"
                                                        }
                                                    >
                                                        <Field
                                                            form={formFromProps}
                                                            {...field}
                                                            {...formMethods}
                                                            control={control}
                                                            errors={errors}
                                                            register={register}
                                                        />
                                                    </div>
                                                );
                                            }
                                            return null;
                                        },
                                    )}
                            </div>

                            <Button
                                form={formID}
                                type={"submit"}
                                variant={"default"}
                            >
                                {submitButtonLabel}
                            </Button>
                        </form>
                    )}
                </FormProvider>
            </div>
        </div>
    );
};
