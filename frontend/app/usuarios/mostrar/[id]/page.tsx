import HeadingElement from "@/components/typography/heading-element";
import TextElement from "@/components/typography/text-element";
import { userApiEndpoints } from "@/urls";
import axios from "axios";
import { ApiUserData } from "../../page";

type PropsType = {
    params: {
        id: string
    }
};


export default async function UserDetails(props: PropsType) {
    const endpoint = userApiEndpoints.find(props.params.id);

    return await axios
        .get(endpoint)
        .then(response => response.data)    
        .then(data => {
            if (data.type != "Success") throw new Error(data.details)
            const userObject: ApiUserData = data.details;

            return (
                <section className="flex flex-col space-y-4">
                    <header>
                        <HeadingElement>
                            { userObject.name }
                        </HeadingElement>
                        <TextElement size="large" className="text-slate-500 inline-flex space-x-4">
                            <span>
                                { `@${userObject.username}` }
                            </span>
                            <span>
                                &bull;
                            </span>
                            <span>
                                { userObject.id }
                            </span>
                        </TextElement>
                    </header>
                    <main className="flex flex-col w-full">


                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        <TextElement>
                                            Contraseña Encriptada
                                        </TextElement>
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <TextElement>
                                            Salt
                                        </TextElement>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                    <td className="px-6 py-4">
                                        <TextElement className="font-mono break-all">
                                            { userObject.encryptedPassword }
                                        </TextElement>
                                    </td>
                                    <td className="px-6 py-4">
                                        <TextElement className="font-mono break-all">
                                            { userObject.salt }
                                        </TextElement>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </main>
                </section>
            );
        })
        .catch(error => console.log(error))
    ;

}



// INuCRFIaoWsQXq9G5P0s
// v5mpgdJiWmurcYzUTtN8
