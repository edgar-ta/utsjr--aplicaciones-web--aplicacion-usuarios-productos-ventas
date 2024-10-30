export default function(props: { 
    children?: React.ReactNode, 
    className?: string,
    htmlFor?: string
}) {
    return (
        <label htmlFor={props.htmlFor} className={`block mb-2 text-sm font-medium text-gray-900 dark:text-white font-label ${props.className}`}>
            {props.children}
        </label>
    );
}