import type { Metadata } from "next";
import logo from "./logo.png"
import "./globals.css";
import Navbar from "@/components/navbar";
import Script from "next/script";
import { Cormorant, Inter, Poppins } from "next/font/google";
import ImageElement from "next/image";
import utsjrLogo from "@/app/images/utsjr-logo.png";

const cormorant = Cormorant({
  subsets: [ "latin" ],
  display: "swap",
  variable: "--font-family--cormorant"
});

const inter = Inter({
  subsets: [ "latin" ],
  display: "swap",
  variable: "--font-family--inter"
});

const poppins = Poppins({
  weight: [ "200", "400", "800" ],
  subsets: [ "latin" ],
  display: "swap",
  variable: "--font-family--poppins"
});

import { navbarHeight } from "@/components/navbar";
import HorizontalWrapper from "@/components/horizontal-wrapper";
import Link from "next/link";
import TextElement from "@/components/typography/text-element";

export const metadata: Metadata = {
  title: "Sistema de Ventas",
  description: "Proyecto universitario de Edgar Trejo Avila para la UTSJR",
  icons: logo.src,
};


function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900">
        <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
            <div className="md:flex md:justify-between">
              <div className="mb-6 md:mb-0">
                <Link href="https://www.utsjr.edu.mx/" className="flex items-center">
                      <ImageElement 
                        src={utsjrLogo}
                        alt="Logo de la UTSJR"
                        className="me-3"
                        />
                </Link>
              </div>
              <div className="flex justify-end">
                  <div className="w-full">
                      <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                        <TextElement>
                          Esta Página fue creada con
                        </TextElement>
                      </h2>
                      <ul className="text-gray-500 dark:text-gray-400 font-medium">
                          <li className="mb-4">
                              <Link href="https://flowbite.com/" className="hover:underline">
                                <TextElement>
                                  Flowbite
                                </TextElement>
                              </Link>
                          </li>
                          <li>
                              <Link href="https://tailwindcss.com/" className="hover:underline">
                                <TextElement>
                                  Tailwind CSS
                                </TextElement>
                              </Link>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="sm:flex sm:items-center sm:justify-between">
              <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 Edgar Trejo Avila.
              </span>
              <div className="flex mt-4 sm:justify-center sm:mt-0">
                  <Link href="https://www.facebook.com/edgar.trejo.526875" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                            <path fill-rule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clip-rule="evenodd"/>
                        </svg>
                      <span className="sr-only">Facebook page</span>
                  </Link>
                  <Link href="https://github.com/edgar-ta" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                      <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
                      </svg>
                      <span className="sr-only">GitHub account</span>
                  </Link>
              </div>
          </div>
        </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
        antialiased
        ${cormorant.variable}
        ${inter.variable}
        ${poppins.variable}
        `}
      >
        <HorizontalWrapper className="py-12">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />

          <div className={`${navbarHeight} block`}></div>
          <Navbar />
          {children}
          
        </HorizontalWrapper>
        <Footer />
      </body>
    </html>
  );
}
