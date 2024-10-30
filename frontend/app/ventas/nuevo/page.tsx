"use client"

import FormElement from "@/components/form-page/form-element";
import TextInputElement from "@/components/form/text-input-element";
import { useState } from "react";
import { ApiSaleData } from "../page";
import { NumberInput } from "@/components/form/number-input-element";

export type SaleInputData = {
    user: string,
    product: string,
    amountOfProduct: number
};

function buildOnChangeCallback(setCallback: React.Dispatch<React.SetStateAction<string>>) {
    return (element: React.ChangeEvent<HTMLInputElement>) => setCallback(element.target.value);
}

export default function(props: { 
    children?: React.ReactNode, 
    className?: string,
    sale?: ApiSaleData
}) {
    const [ user, setUser ] = useState(props.sale?.user.id || "");
    const [ product, setProduct ] = useState(props.sale?.product.id || "");
    const [ amountOfProduct, setAmountOfProduct ] = useState(props.sale?.amountOfProduct || 0);

    return (
        <FormElement<SaleInputData>
            recordId={props.sale?.id}
            apiEntityName="sale"
            appEntityName="ventas"
            editionHeading="Editar venta"
            insertionHeading="Insertar venta nueva"
            getPayload={() => ({ user, product, amountOfProduct })}
            >
            <TextInputElement 
                value={user} 
                label="Id del Usuario" 
                required 
                placeholder="Algún Usuario" 
                onChange={buildOnChangeCallback(setUser)}
                />
            <TextInputElement 
                value={product} 
                label="Id del Producto" 
                required 
                placeholder="Algún Producto" 
                onChange={buildOnChangeCallback(setProduct)}
                />
            <NumberInput
                label="Cantidad de Producto"
                required
                placeholder="1"
                value={amountOfProduct}
                onChange={(value) => setAmountOfProduct(value)}
                />
        </FormElement>
    );
}
