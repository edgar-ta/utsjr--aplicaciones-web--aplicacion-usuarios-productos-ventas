import HeadingElement from "@/components/typography/heading-element";
import TextElement from "@/components/typography/text-element";
import Image from "next/image";

export default function Home() {
  return (
    <section>
      <header>
        <HeadingElement>
          Inicio
        </HeadingElement>
      </header>
      <main>
        <TextElement>
          Ésta es la página de inicio del proyecto
        </TextElement>
      </main>
    </section>
  );
}
