import axios from "axios";
import { userApiEndpoints } from "@/urls"
import NewUser from "../../nuevo/page";

export default async function (props: {
    params: {
        id: string
    }
}) {
    const endpoint = userApiEndpoints.find(props.params.id);
    return axios
        .get(endpoint)
        .then(response => response.data.details)
        .then(user => <NewUser user={user} />)
    ;
}
