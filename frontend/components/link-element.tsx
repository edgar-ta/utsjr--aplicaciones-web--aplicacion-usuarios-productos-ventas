import Link from "next/link";
import TextElement from "./typography/text-element";
import { MouseEventHandler } from "react";

type ColorStyle = "dark" | "light";

export function LinkAnimation(props: { 
    children?: React.ReactNode, 
    className?: string, 
    href?: string, 
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    lineColorScheme?: ColorStyle
}) {
    return (
        <Link href={props.href || ""} className={`
        group/linkelement
        ${props.className}
        `}>
            <div className={`
            relative
            w-fit

            before:absolute
            [&[data-line-color-scheme='dark']]:before:bg-black
            [&[data-line-color-scheme='light']]:before:bg-white
            before:w-0
            before:top-[calc(100%_+_1px)]
            before:left-0
            before:h-[1px]
            before:transition-all
            group-hover/linkelement:before:w-full
            `}
            data-line-color-scheme={props.lineColorScheme || "dark"}
            >
                {props.children}
            </div>
        </Link>
    );
}

export default function(props: { 
    children?: React.ReactNode, 
    className?: string, 
    href?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    lineColorScheme?: ColorStyle
}) {
    return (
        <LinkAnimation href={props.href} className={props.className} lineColorScheme={props.lineColorScheme}>
            <TextElement>
                { props.children }
            </TextElement>
        </LinkAnimation>
    );
}
