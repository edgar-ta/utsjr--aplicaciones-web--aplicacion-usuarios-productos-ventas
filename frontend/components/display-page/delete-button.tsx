"use client"

import { SupportedApiEntity, SupportedAppEntity, baseUrl, getApiEndpointsForEntity, getAppEndpointsForEntity, userApiEndpoints } from "@/urls";
import axios from "axios";
import ActionButton from "@/components/action-button";
import TextElement from "@/components/typography/text-element";


type PropsType = {
    apiEntityName: SupportedApiEntity,
    appEntityName: SupportedAppEntity,
    id: string,
    className?: string
};

export default function (props: PropsType) {
    const deleteEndpoint = getApiEndpointsForEntity(props.apiEntityName).delete(props.id);
    const showAllEndpoint = getAppEndpointsForEntity(props.appEntityName).showAll;

    return (
        <ActionButton className={`${props.className}`} colorScheme="red" onClick={async (event) => {
            return await axios
                .delete(deleteEndpoint)
                .then(response => response.data)
                .then(data => {
                    if (data.type == "Success") {
                        location.replace(showAllEndpoint);
                    } else {
                        throw new Error(data.details);
                    }
                })
                .catch((e) => console.log(e))
            ;
        }} href={""}>
            <TextElement>
                Borrar
            </TextElement>
        </ActionButton>
    );
};

// INuCRFIaoWsQXq9G5P0s
// T6zZkXzkbInSwGE2Yg77
