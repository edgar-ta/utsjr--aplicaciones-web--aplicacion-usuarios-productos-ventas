import DisplayPage from "@/components/display-page/display-page";

export type ApiUserData = { 
    id: string, 
    name: string, 
    encryptedPassword: string, 
    salt: string, 
    username: string 
};

export type ExternalUserData = { 
    name: string, 
    username: string 
};

export default async function () {
    return (
        <DisplayPage<ApiUserData, ExternalUserData>
            apiEntityName="user"
            appEntityName="usuarios"
            heading="Usuarios"
            legend="Visualiza a aquellos que se han registrado hasta el momento"
            formatter={({ name, username }) => ({ name, username })}
            columnNames={[ "Nombre Completo", "Nombre de Usuario" ]}
            />
    );
}
