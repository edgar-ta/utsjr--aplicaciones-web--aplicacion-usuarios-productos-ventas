import Link from "next/link";
import { MouseEventHandler } from "react";

type ColorScheme = "blue" | "red" | "green";

export function ButtonWrapper(props: { 
    children?: React.ReactNode, 
    className?: string, 
    colorScheme?: ColorScheme,
    type?: "button" | "reset" | "submit"
}) {
    return (
        <button
            className={`
            inline-block
            px-4
            py-2
            rounded-sm
            transition-all
            text-center

            [&[data-color-scheme='blue']]:bg-blue-500
            [&[data-color-scheme='blue']]:hover:bg-blue-600
            [&[data-color-scheme='blue']]:text-white

            [&[data-color-scheme='red']]:bg-red-500
            [&[data-color-scheme='red']]:hover:bg-red-600
            [&[data-color-scheme='red']]:text-white

            [&[data-color-scheme='green']]:bg-emerald-600
            [&[data-color-scheme='green']]:hover:bg-emerald-700
            [&[data-color-scheme='green']]:text-white

            ${props.className}
            `}
            data-color-scheme={props.colorScheme || "blue"}
            type={props.type}
        >
            {props.children}
        </button>
    );
}

export default function(props: { 
    children?: React.ReactNode, 
    className?: string, 
    href?: string,
    onClick?: MouseEventHandler<HTMLAnchorElement>,
    colorScheme?: ColorScheme
}) {
    return (
        <ButtonWrapper className={props.className} colorScheme={props.colorScheme}>
            <Link 
                href={props.href || ""} 
                onClick={props.onClick} 
            >
                { props.children }
            </Link>
        </ButtonWrapper>
    );
}

