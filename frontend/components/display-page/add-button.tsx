import ActionButton from "@/components/action-button";
import TextElement from "@/components/typography/text-element";
import { SupportedAppEntity, getAppEndpointsForEntity } from "@/urls";

export default function(props: { 
    children?: React.ReactNode, 
    className?: string,
    appEntityName: SupportedAppEntity
}) {
    return (
        <ActionButton colorScheme="green" href={getAppEndpointsForEntity(props.appEntityName).new} className={`w-fit ${props.className}`}>
            <TextElement >
                Añadir Nuevo
            </TextElement>
        </ActionButton>
    );
}