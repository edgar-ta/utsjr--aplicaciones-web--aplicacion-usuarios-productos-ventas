import { productApiEndpoints } from "@/urls";
import axios from "axios";
import { ApiProductData } from "../../page";
import HeadingElement from "@/components/typography/heading-element";
import TextElement from "@/components/typography/text-element";
import LabelElement from "@/components/typography/label-element";

function LabeledContent(props: {
    isCurrency?: boolean,
    value: number,
    label: string
}) {
    const formatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    });
    return (
        <div className="flex flex-col -space-y-2 p-4">
            <LabelElement className="text-center">
                {props.label}
            </LabelElement>
            <TextElement size="large" className="text-center">
                { props.isCurrency? formatter.format(props.value): props.value }
            </TextElement>
        </div>
    );
}

export default async function(props: { 
    children?: React.ReactNode, 
    className?: string,
    params: {
        id: string
    }
}) {
    const product: ApiProductData = await axios.get(productApiEndpoints.find(props.params.id)).then(response => response.data.details);
    return (
        <section className="flex flex-col space-y-8">
            <header>
                <HeadingElement>
                    { product.name }
                </HeadingElement>
                <TextElement className="text-slate-500" size="large">
                    { product.id }
                </TextElement>
            </header>
            <main>
                <div className="divide-x grid grid-cols-3 divide-slate-950">
                    <LabeledContent 
                        isCurrency
                        value={product.price}
                        label="Precio"
                        />
                    <LabeledContent 
                        value={product.stock}
                        label="Stock"
                        />
                    <LabeledContent 
                        isCurrency
                        value={product.totalValue}
                        label="Valor Total"
                        />
                </div>
            </main>
        </section>
    );
}

