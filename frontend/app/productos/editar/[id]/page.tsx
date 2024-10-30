import axios from "axios";
import { productApiEndpoints } from "@/urls"
import NewProduct from "../../nuevo/page";

export default async function (props: {
    params: {
        id: string
    }
}) {
    const endpoint = productApiEndpoints.find(props.params.id);
    return axios
        .get(endpoint)
        .then(response => response.data.details)
        .then(product => <NewProduct product={product} />)
    ;
}
