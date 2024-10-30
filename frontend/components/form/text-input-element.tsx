import { v4 as uuidv4 } from "uuid";
import LabelElement from "../typography/label-element";
import React, { LegacyRef } from "react";
import InputElement from "./input-element";

export default React.forwardRef((props: { 
    label: string,
    className?: string,
    placeholder?: string,
    id?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    value?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}, ref: LegacyRef<HTMLInputElement>) => {
    const id = props.id || uuidv4();
    const placeholder = props.placeholder || props.label;
    return (
        <div className={`flex flex-col ${props.className}`}>
            <LabelElement htmlFor={id}>
                {props.label}
            </LabelElement>
            <InputElement 
                id={id}
                type="text"
                className={props.className}
                required={props.required}
                minLength={props.minLength}
                maxLength={props.maxLength}
                placeholder={placeholder}
                value={props.value}
                ref={ref}
                onChange={props.onChange}
                />
        </div>
    );
});