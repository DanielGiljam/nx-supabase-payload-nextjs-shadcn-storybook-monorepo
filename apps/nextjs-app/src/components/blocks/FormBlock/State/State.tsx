import {Label} from "@my-project/react-components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@my-project/react-components/ui/select";
import type {StateField} from "@payloadcms/plugin-form-builder/types";
import type React from "react";
import type {Control, FieldErrorsImpl} from "react-hook-form";
import {Controller} from "react-hook-form";

import {Error} from "../Error";
import {Width} from "../Width";

import {stateOptions} from "./options";

export const State: React.FC<
    StateField & {
        control: Control;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- [bulk suppress]
        errors: Partial<FieldErrorsImpl<Record<string, any>>>;
    }
> = ({name, control, errors, label, required, width}) => (
    <Width width={width}>
        <Label htmlFor={name}>{label}</Label>
        <Controller
            control={control}
            defaultValue={""}
            name={name}
            render={({field: {onChange, value}}) => {
                const controlledValue = stateOptions.find(
                    (t) => t.value === value,
                );

                return (
                    <Select
                        value={controlledValue?.value}
                        onValueChange={(value_) => {
                            onChange(value_);
                        }}
                    >
                        <SelectTrigger className={"w-full"} id={name}>
                            <SelectValue placeholder={label} />
                        </SelectTrigger>
                        <SelectContent>
                            {stateOptions.map(({label, value}) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }}
            rules={{required}}
        />
        {/* eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- [bulk suppress] */}
        {required && errors[name] && <Error />}
    </Width>
);
