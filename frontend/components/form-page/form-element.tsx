import axios from "axios";
import { useState } from "react";
import HeadingElement from "../typography/heading-element";
import { ButtonWrapper } from "../action-button";
import { SupportedApiEntity, SupportedAppEntity, getApiEndpointsForEntity, getAppEndpointsForEntity } from "@/urls";

export default function <PayloadType extends { [key: string]: any }> (props: { 
    children?: React.ReactNode, 
    className?: string,
    recordId?: string,
    apiEntityName: SupportedApiEntity,
    appEntityName: SupportedAppEntity,
    editionHeading: string,
    insertionHeading: string,
    getPayload: () => PayloadType,
    validationCallback?:  () => Error | null
}) {
    const isInsertion = props.recordId === undefined;
    const [ error, setError ] = useState<Error | null>(null);
    const endpoint = isInsertion? 
        getApiEndpointsForEntity(props.apiEntityName).new: 
        getApiEndpointsForEntity(props.apiEntityName).edit(props.recordId || "")
    ;

    return (
        <form className="w-full flex flex-col" onSubmit={async (event) => {
            event.preventDefault();
            const payload = props.getPayload();

            const validationResult = props.validationCallback? props.validationCallback(): null;
            if (validationResult !== null) {
                setError(validationResult);
                return;
            }
        
            await axios.post(endpoint, new URLSearchParams(payload))
                .then((response) => response.data)
                .then((data) => {
                    console.log(data);
                    if (data.type == "Success") {
                        return data.details;
                    } 
                    throw new Error(data.details);
                })
                .then((info) => console.log(info))
                .then(() => window.location.href = getAppEndpointsForEntity(props.appEntityName).showAll)
                .catch((error) => {
                    console.log(error);
                    setError(error);
                })
            ;
        }}>
            {
                error !== null && (
                    <span>
                        { error.message }
                    </span>
                )
            }
            <section className="flex flex-col space-y-8">
                <header className="">
                    <HeadingElement>
                        {
                            isInsertion? props.insertionHeading: props.editionHeading
                        }
                    </HeadingElement>
                </header>
                <main className="grid grid-cols-2 gap-4">
                    {props.children}
                </main>
                <footer>
                    <ButtonWrapper type="submit" className="w-full row-start-4 col-span-2" colorScheme="blue">
                        Enviar
                    </ButtonWrapper>
                </footer>
            </section>
        </form>
    );
}
