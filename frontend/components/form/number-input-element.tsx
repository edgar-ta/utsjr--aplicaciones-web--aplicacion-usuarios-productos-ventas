import { v4 as uuidv4 } from "uuid";
import LabelElement from "../typography/label-element";
import React, { LegacyRef } from "react";
import InputElement from "./input-element";

export const QuantityInput = React.forwardRef((props: { 
    label: string,
    className?: string,
    placeholder?: string,
    id?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    value?: number,
    onChange?: (value: number) => void,
    minValue?: number,
    maxValue?: number,
}, ref: LegacyRef<HTMLInputElement>) => {
    const id = props.id || uuidv4();
    const placeholder = props.placeholder || props.label;
    const onChange = props.onChange || ((value: number) => {});

    return (
        <div className={`flex flex-col ${props.className}`}>
            <LabelElement htmlFor={id}>
                {props.label}
            </LabelElement>
            <div className="relative flex items-center w-full">
                <button type="button" id="decrement-button" data-input-counter-decrement="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-sm p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    onClick={(event) => onChange((props.value || 0) - 1)}
                    >
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                    </svg>
                </button>
                    <InputElement 
                    id={id}
                    type="number"
                    className={`bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${props.className}`}
                    required={props.required}
                    minLength={props.minLength}
                    maxLength={props.maxLength}
                    minValue={props.minValue}
                    maxValue={props.maxValue}
                    placeholder={placeholder}
                    value={props.value}
                    ref={ref}
                    onChange={(event) => {
                        if (props.onChange !== undefined) {
                            const input = event.target.value;
                            if (input == "") {
                                props.onChange(0);
                                return;
                            }
    
                            const number = Number.parseFloat(input);
                            if (!Number.isNaN(number)) {
                                props.onChange(number)
                            }
                        }
                    }}
                    />
                <button type="button" id="increment-button" data-input-counter-increment="quantity-input" className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-sm p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                    onClick={(event) => onChange((props.value || 0) + 1)}
                    >
                    <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                    </svg>
                </button>
            </div>
        </div>
    );
});


export const NumberInput = React.forwardRef((props: { 
    label: string,
    className?: string,
    placeholder?: string,
    id?: string,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    minValue?: number,
    maxValue?: number,
    value?: number,
    onChange?: (value: number) => void
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
                type="number"
                className={props.className}
                required={props.required}
                minLength={props.minLength}
                maxLength={props.maxLength}
                minValue={props.minValue}
                maxValue={props.maxValue}
                placeholder={placeholder}
                value={props.value}
                ref={ref}
                onChange={(event) => {
                    if (props.onChange !== undefined) {
                        const input = event.target.value;
                        if (input == "") {
                            props.onChange(0);
                            return;
                        }

                        const number = Number.parseFloat(input);
                        if (!Number.isNaN(number)) {
                            props.onChange(number)
                        }
                    }
                }}
                />
        </div>
    );
});
