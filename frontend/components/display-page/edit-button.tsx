import ActionButton from "@/components/action-button";
import TextElement from "@/components/typography/text-element";
import { SupportedAppEntity, getAppEndpointsForEntity } from "@/urls";

export default function(props: { 
    id: string,
    appEntityName: SupportedAppEntity,
    className?: string,

}) {
    const endpoint = getAppEndpointsForEntity(props.appEntityName).edit(props.id);

    return (
        <ActionButton colorScheme="blue" className={`${props.className}`} href={endpoint}>
            <TextElement>
                Editar
            </TextElement>
        </ActionButton>
    );
}
