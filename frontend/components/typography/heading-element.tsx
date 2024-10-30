export default function(
    props: { 
        children?: React.ReactNode,
        size?: "large" | "regular" | "small",
        className?: string
    }
) {
    return (
        <h1 className={`
        font-heading

        [&[data-size='regular']]:xl:text-7xl
        [&[data-size='regular']]:lg:text-5xl
        [&[data-size='regular']]:md:text-5xl
        [&[data-size='regular']]:sm:text-5xl
        [&[data-size='regular']]:text-2xl
        [&[data-size='regular']]:font-bold

        [&[data-size='small']]:xl:text-4xl
        [&[data-size='small']]:lg:text-3xl
        [&[data-size='small']]:md:text-3xl
        [&[data-size='small']]:sm:text-2xl
        [&[data-size='small']]:text-lg
        [&[data-size='small']]:font-bold

        ${props.className}
        `}
        data-size={props.size || "regular"}
        >
            {props.children}
        </h1>
    );
}

