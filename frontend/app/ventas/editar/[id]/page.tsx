import axios from "axios";
import { saleApiEndpoints } from "@/urls"
import NewSale from "../../nuevo/page";

export default async function (props: {
    params: {
        id: string
    }
}) {
    const endpoint = saleApiEndpoints.find(props.params.id);
    return axios
        .get(endpoint)
        .then(response => response.data.details)
        .then(sale => <NewSale sale={sale} />)
    ;
}
