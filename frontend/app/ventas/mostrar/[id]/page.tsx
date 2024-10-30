import { getAppEndpointsForEntity, saleApiEndpoints } from "@/urls";
import axios from "axios";
import { ApiSaleData, SaleState } from "../../page";
import HeadingElement from "@/components/typography/heading-element";
import TextElement from "@/components/typography/text-element";
import Link from "next/link";

function EntityLink(props: {
    name: string,
    href: string,
    id: string
}) {
    return (
        <Link className="
        border
        border-gray-200
        p-4
        rounded
        flex
        flex-col
        w-full
        cursor-pointer
        bg-white
        hover:bg-slate-300
        transition-colors
        "
        href={props.href}
        >
            <HeadingElement size="small" className="text-gray-700">
                { props.name }
            </HeadingElement>
            <TextElement className="text-slate-400">
                { props.id }
            </TextElement>
        </Link>
    );
}

function SaleTable(props: {
    sale: ApiSaleData
}) {
    const formatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
    });
    const { sale } = props;
    const productPrice = sale.amountOfSale / sale.amountOfProduct;

    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        <TextElement>
                            Fecha de Compra
                        </TextElement>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <TextElement>
                            Precio Por Producto
                        </TextElement>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <TextElement>
                            Productos Vendidos
                        </TextElement>
                    </th>
                    <th scope="col" className="px-6 py-3">
                        <TextElement>
                            Total de la Venta
                        </TextElement>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <TextElement>
                            { new Date(Date.parse(sale.purchaseTime.formalDate.utcRepresentation)).toLocaleDateString() }
                        </TextElement>
                    </th>
                    <td className="px-6 py-4">
                        <TextElement>
                            { formatter.format(productPrice) }
                        </TextElement>
                    </td>
                    <td className="px-6 py-4">
                        <TextElement>
                            { sale.amountOfProduct }
                        </TextElement>
                    </td>
                    <td className="px-6 py-4">
                        <TextElement>
                            { formatter.format(sale.amountOfSale) }
                        </TextElement>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

function SaleStateBadge(props: {
    state: SaleState
}) {
    const text = (() => {
        switch (props.state) {
            case "active": return "Venta Activa";
            case "canceled": return "Venta Cancelada";
            case "pending": return "Venta Pendiente";
        }
    })();

    const styling = (() => {
        switch (props.state) {
            case "active": return "bg-green-100 text-green-800";
            case "canceled": return "bg-red-100 text-red-800";
            case "pending": return "bg-yellow-100 text-yellow-800";
        }
    })();

    return (
        <span className={`
            w-fit 
            bg-red-100 
            text-red-800 
            font-medium 
            px-2.5 
            py-0.5 
            rounded-full 
            dark:bg-red-900 
            dark:text-red-300
            ${styling}
            `}>
            <TextElement>
                {
                    text
                }
            </TextElement>
        </span>
    );
}

export default async function(props: { children?: React.ReactNode, className?: string, params: { id: string } }) {
    const sale: ApiSaleData = await axios.get(saleApiEndpoints.find(props.params.id)).then(response => response.data.details);
    const showUserEndpoint = getAppEndpointsForEntity("usuarios").show(sale.user.id);
    const showProductEndpoint = getAppEndpointsForEntity("productos").show(sale.product.id);

    return (
        <section className="grid grid-cols-[1fr_5fr] gap-6">
            <main className="col-span-1 col-start-2 row-start-1 flex flex-col space-y-4">
                <HeadingElement className="text-gray-700">
                    {sale.id}
                </HeadingElement>
                <SaleStateBadge state={sale.state} />
                <SaleTable sale={sale} />
            </main>
            <aside className="
            flex
            flex-col
            space-y-6
            ">
                <EntityLink 
                    id={sale.user.id}
                    name={sale.user.name}
                    href={showUserEndpoint}
                    />
                <EntityLink 
                    id={sale.product.id}
                    name={sale.product.name}
                    href={showProductEndpoint}
                    />
            </aside>
        </section>
    );
}