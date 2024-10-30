export default function HorizontalWrapper(props: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`
        xl:px-[15%]
        lg:px-[10%]
        md:px-[10%]
        sm:px-[5%]
        px-2

        ${props.className}
        `}
        >
            {props.children}
        </div>
    );
}

