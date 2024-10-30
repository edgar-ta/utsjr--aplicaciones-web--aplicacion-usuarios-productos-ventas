import LinkElement from "./link-element";

export default function(props: { children?: React.ReactNode, href?: string, className?: string }) {
    return (
        <li className={`
        h-full
        ${props.className}
        hover:text-white
        `}>
            <LinkElement
            href={props.href} 
            className="
            flex
            flex-col
            justify-center
            items-center
            h-full
            p-4
            transition-all
            hover:bg-gray-500
            min-w-32
            "
            lineColorScheme="light"
            >
                {props.children}
            </LinkElement>
        </li>
    );
}