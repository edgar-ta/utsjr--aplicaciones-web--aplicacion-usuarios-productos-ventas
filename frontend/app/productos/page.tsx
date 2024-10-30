import DisplayPage from "@/components/display-page/display-page";

export type ApiProductData = { 
    id: string, 
    name: string, 
    price: number, 
    stock: number, 
    totalValue: number 
};

export type ExternalProductData = { 
    name: string, 
    price: number,
    stock: number, 
    totalValue: number 
};

export default async function () {
    return (
        <DisplayPage<ApiProductData, ExternalProductData>
            apiEntityName="product"
            appEntityName="productos"
            heading="Productos"
            legend="Verifica que los insumos adquiridos sean correctos"
            formatter={({ id, ...rest }) => (rest)}
            columnNames={[ "Nombre", "Precio", "Stock", "Valor total" ]}
            />
    );
}
