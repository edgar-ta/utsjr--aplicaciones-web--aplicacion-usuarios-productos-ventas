import { getApiEndpointsForEntity, type SupportedApiEntity, type SupportedAppEntity, getAppEndpointsForEntity } from "@/urls";
import HeadingElement from "@/components/typography/heading-element";
import TextElement from "@/components/typography/text-element";
import LinkElement from "@/components/link-element";
import AddButton from "./add-button";
import axios from "axios";
import DeleteButton from "./delete-button";
import EditButton from "./edit-button";

function TableRow <InternalData extends { id: string }, ExternalData extends { name: string }> (
    props: {
        record: InternalData,
        apiEntityName: SupportedApiEntity,
        appEntityName: SupportedAppEntity,
        formatter: (internalData: InternalData) => ExternalData,
    }
) {
    const showMoreUrl = getAppEndpointsForEntity(props.appEntityName).show(props.record.id);
    const formattedRecord = props.formatter(props.record);

    return (
        <tr key={props.record.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 break-words dark:text-white">
                <LinkElement href={showMoreUrl}>
                    {formattedRecord.name}
                </LinkElement>
            </th>
            {
                Object.entries(formattedRecord).filter(([ key, _ ]) => key != "name").map(([ _, value ]) => (
                    <td className="px-6 py-4 break-words">
                        <TextElement>
                            {value}
                        </TextElement>
                    </td>
                ))
            }
            <td className="px-6 py-4">
                <div className="flex space-x-4 w-full">
                    <DeleteButton 
                        apiEntityName={props.apiEntityName} 
                        appEntityName={props.appEntityName} 
                        id={props.record.id} 
                        className="grow"
                        />
                    <EditButton 
                        id={props.record.id}
                        appEntityName={props.appEntityName}
                        className="grow"
                        />
                </div>
            </td>
        </tr>
    );
}

function TableItself <InternalData extends { id: string }, ExternalData extends { name: string }> (props: {
    records: InternalData[],
    apiEntityName: SupportedApiEntity,
    appEntityName: SupportedAppEntity,
    formatter: (internalData: InternalData) => ExternalData,
    columnNames: string[],
}) {
    return (
        <table className="w-full text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="uppercase text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {
                        props.columnNames.map(name => (
                            <th scope="col" className="px-6 py-3 text-center">
                                <TextElement>
                                    { name }
                                </TextElement>
                            </th>
                        ))
                    }
                    <th scope="col" className="px-6 py-3 text-center">
                        <TextElement>
                            Acciones
                        </TextElement>
                    </th>
                </tr>
            </thead>
            <tbody>
                { 
                    props.records.map(record => (
                        <TableRow 
                            record={record}
                            apiEntityName={props.apiEntityName}
                            appEntityName={props.appEntityName}
                            formatter={props.formatter}
                            />
                    )) 
                }
            </tbody>
        </table>
    );
}

export default async function <InternalData extends { id: string }, ExternalData extends { name: string }> (props: {
    apiEntityName: SupportedApiEntity,
    appEntityName: SupportedAppEntity,
    heading: string,
    legend: string,
    formatter: (internalData: InternalData) => ExternalData,
    columnNames: string[],
}) {
    const endpoint = getApiEndpointsForEntity(props.apiEntityName).getAll;
    const records: InternalData[] = await axios.get(endpoint).then(response => response.data.details);

    return (
        <section className="
        flex
        flex-col
        space-y-8
        ">
            <header className=" flex flex-col space-y-2">
                <HeadingElement>
                    { props.heading }
                </HeadingElement>
                <TextElement>
                    { props.legend }
                </TextElement>
                <AddButton appEntityName={props.appEntityName} />
            </header>
            <main>
                <TableItself
                    records={records}
                    apiEntityName={props.apiEntityName}
                    appEntityName={props.appEntityName}
                    formatter={props.formatter}
                    columnNames={props.columnNames}
                    />
            </main>
        </section>
    );
}
