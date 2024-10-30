import DisplayPage from "@/components/display-page/display-page";

export type SaleState = "active" | "canceled" | "pending";
export type ApiSaleData = { 
    id: string,
    amountOfProduct: number,
    amountOfSale: number,
    purchaseTime: {
        date: {
            day: number,
            month: number,
            year: number,
            dayOfWeek: number,
            representation: string
        },
        time: {
            hour: number,
            minute: number,
            second: number,
            millisecond: number,
            representation: string
        },
        formalDate: {
            isoRepresentation: string,
            utcRepresentation: string
        }
    },
    state: SaleState,
    user: {
        id: string,
        name: string
    },
    product: {
        id: string,
        name: string
    }
};

export type ExternalSaleData = { 
    name: string, 
    product: string,
    user: string, 
    state: "Activa" | "Cancelada" | "Pendiente",
    amountOfProduct: number,
    amountOfSale: number 
};

export default async function () {
    return (
        <DisplayPage<ApiSaleData, ExternalSaleData>
            apiEntityName="sale"
            appEntityName="ventas"
            heading="Ventas"
            legend="Analiza los últimos movimientos en las adquisiciones de los usuarios"
            formatter={({ 
                purchaseTime: { 
                    date: { 
                        representation 
                    } 
                },
                product,
                user,
                state,
                amountOfProduct,
                amountOfSale
            }) => ({
                name: representation,
                user: user.name,
                product: product.name,
                state: (() => {
                    switch (state) {
                        case "active": return "Activa";
                        case "canceled": return "Cancelada";
                        case "pending": return "Pendiente";
                    }
                })(),
                amountOfProduct,
                amountOfSale
            })}
            columnNames={[ "Fecha", "Usuario", "Producto", "Estado", "Cantidad de Producto", "Total de Venta" ]}
            />
    );
}
