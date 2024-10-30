"use client"

import FormElement from "@/components/form-page/form-element";
import TextInputElement from "@/components/form/text-input-element";
import { useState } from "react";
import { ApiProductData } from "../page";
import { NumberInput, QuantityInput } from "@/components/form/number-input-element";

export type ProductInputData = {
    name: string,
    price: number,
    stock: number
};

function buildOnChangeCallback(setCallback: React.Dispatch<React.SetStateAction<string>>) {
    return (element: React.ChangeEvent<HTMLInputElement>) => setCallback(element.target.value);
}

export default function(props: { 
    children?: React.ReactNode, 
    className?: string,
    product?: ApiProductData
}) {
    const [ name, setName ] = useState(props.product?.name || "");
    const [ stock, setStock ] = useState(props.product?.stock || 1);
    const [ price, setPrice ] = useState(props.product?.price || 0);

    return (
        <FormElement<ProductInputData>
            recordId={props.product?.id}
            apiEntityName="product"
            appEntityName="productos"
            editionHeading="Editar producto"
            insertionHeading="Insertar nuevo producto"
            getPayload={() => ({ name, stock, price })}
            >
            <TextInputElement 
                value={name} 
                minLength={8} 
                maxLength={32} 
                label="Nombre del Producto" 
                required 
                placeholder="Algún Producto" 
                className="col-start-1" 
                onChange={buildOnChangeCallback(setName)}
                />
            <QuantityInput 
                label="Stock"
                required
                placeholder="10"
                value={stock}
                onChange={(value: number) => setStock(value)}
                minValue={1}
                />
            <NumberInput
                label="Precio"
                required
                placeholder="500"
                value={price}
                onChange={(value) => setPrice(value)}
                />
        </FormElement>
    );
}
