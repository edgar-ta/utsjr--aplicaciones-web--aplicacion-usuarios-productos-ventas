import { v4 as uuidv4 } from "uuid";
import LabelElement from "../typography/label-element";
import React, { LegacyRef, useState } from "react";
import InputElement from "./input-element";

export default React.forwardRef((props: { 
    label: string,
    className?: string,
    placeholder?: string,
    id?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    isVisible?: boolean,
    onButtonClicked?: React.MouseEventHandler<HTMLButtonElement>,
    value?: string,
    onChange?: React.ChangeEventHandler<HTMLInputElement>
}, ref: LegacyRef<HTMLInputElement>) => {
    const id = props.id || uuidv4();

    const placeholder = props.isVisible? props.label: "********";
    const type = props.isVisible? "text": "password";

    return (
        <div className={`flex flex-col ${props.className}`}>
            <LabelElement htmlFor={id}>
                {props.label}
            </LabelElement>
            <div className="flex">
                <button 
                    onClick={props.onButtonClicked}
                    type="button"
                    className="
                    flex-grow 
                    aspect-square 
                    h-full
                    flex
                    flex-col
                    border
                    border-gray-300
                    justify-center
                    bg-gray-400
                    hover:border-gray-500
                    hover:bg-gray-600
                    active:bg-gray-800
                    transition-colors
                    rounded-sm
                    ">
                    { 
                        props.isVisible? 
                        (
                            <i className="fa-regular fa-eye text-slate-900"></i>
                        )
                        : 
                        (
                            <i className="fa-regular fa-eye-slash text-slate-900"></i>
                        )
                    }
                </button>
                <InputElement 
                    id={id}
                    type={type}
                    className={`flex-grow ${props.className}`}
                    required={props.required}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    placeholder={placeholder}
                    value={props.value}
                    ref={ref}
                    onChange={props.onChange}
                    />
            </div>
        </div>
    );
});