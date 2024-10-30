export default function(
    props: { 
        children?: React.ReactNode, 
        className?: string,
        size?: "large" | "regular" | "small"
    }
) {
    return (
        <p className={`
        font-text
        ${props.className}

        [&[data-size='large']]:xl:text-3xl
        [&[data-size='large']]:lg:text-2xl
        [&[data-size='large']]:md:text-xl
        [&[data-size='large']]:sm:text-xl
        [&[data-size='large']]:text-md
        `}
        data-size={props.size}
        >
            {props.children}
        </p>
    );
}

