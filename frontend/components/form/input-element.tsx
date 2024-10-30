import { v4 as uuidv4 } from "uuid";
import LabelElement from "../typography/label-element";
import React, { LegacyRef } from "react";

export default React.forwardRef((props: { 
    id?: string,
    type?: string
    className?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    placeholder?: string,
    value?: string | number,
    minValue?: number,
    maxValue?: number,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}, ref: LegacyRef<HTMLInputElement>) => {
    return (
        <input 
        className={`
        bg-gray-50 
        border 
        border-gray-300 
        text-gray-900 
        rounded-sm
        focus:ring-gray-100
        focus:border-gray-200
        block 
        w-full 
        p-2.5 
        font-text
        ${props.className}
        `}

        type={props.type} 
        id={props.id} 
        value={props.value}
        minLength={props.minLength}
        maxLength={props.maxLength}
        placeholder={props.placeholder} 
        required={props.required} 
        ref={ref}
        onChange={props.onChange}
        min={props.minValue}
        max={props.maxValue}
        />
    );
});