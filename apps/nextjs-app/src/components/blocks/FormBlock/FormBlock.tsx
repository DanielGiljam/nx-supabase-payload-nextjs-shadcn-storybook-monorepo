"use client";
import {Button} from "@my-project/react-components/ui/button";
import {getClientSideUrl} from "@my-project/utils";
import type {Form as FormType} from "@payloadcms/plugin-form-builder/types";
import {useRouter} from "next/navigation";
import React from "react";
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

    const [isLoading, setIsLoading] = React.useState(false);
    const [hasSubmitted, setHasSubmitted] = React.useState<boolean>();
    const [error, setError] = React.useState<
        {message: string; status?: string} | undefined
    >();
    const router = useRouter();

    const onSubmit = React.useCallback(
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

                    const response = (await request.json()) as {
                        errors?: Array<{message?: string}>;
                        status?: string;
                    };

                    clearTimeout(loadingTimerID);

                    if (request.status >= 400) {
                        setIsLoading(false);

                        setError({
                            message:
                                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
                                response.errors?.[0]?.message ||
                                "Internal Server Error",
                            status: response.status,
                        });

                        return;
                    }

                    setIsLoading(false);
                    setHasSubmitted(true);

                    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                    if (confirmationType === "redirect" && redirect) {
                        const {url} = redirect;

                        const redirectUrl = url;

                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
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
            {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
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
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                        hasSubmitted &&
                        confirmationType === "message" && (
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- [bulk suppress]
                            <RichText content={confirmationMessage} />
                        )}
                    {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                    {isLoading && !hasSubmitted && (
                        <p>Loading, please wait...</p>
                    )}
                    {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                    {error && (
                        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/prefer-nullish-coalescing -- [bulk suppress]
                        <div>{`${error.status || "500"}: ${error.message || ""}`}</div>
                    )}
                    {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
                    {!hasSubmitted && (
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises -- [bulk suppress]
                        <form id={formID} onSubmit={handleSubmit(onSubmit)}>
                            <div className={"mb-4 last:mb-0"}>
                                {/* eslint-disable-next-line @typescript-eslint/prefer-optional-chain, @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition -- [bulk suppress] */}
                                {formFromProps &&
                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
                                    formFromProps.fields &&
                                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                                    formFromProps.fields?.map(
                                        (field, index) => {
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- [bulk suppress]
                                            const Field: React.FC<any> =
                                                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- [bulk suppress]
                                                fields?.[
                                                    field.blockType as never
                                                ];
                                            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/strict-boolean-expressions -- [bulk suppress]
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
