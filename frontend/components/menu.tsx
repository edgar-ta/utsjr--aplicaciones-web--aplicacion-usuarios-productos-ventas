import Link from "next/link";

export default function Menu() {
    return (
        <div>
            <Link href={"/chat"}>
                Chat
            </Link>
            <Link href={"/universidades"}>
                Universidades
            </Link>
        </div>
    );
}
