export const apiUrl = "http://localhost:3000";
export const baseUrl = "http://localhost:3001";

export type ApiEndpointsObject = {
    new:        string,
    getAll:     string,
    delete:     (id: string) => string,
    find:       (id: string) => string,
    edit:       (id: string) => string
};

export type AppEndpointsObject = {
    new:        string,
    showAll:     string,
    show:       (id: string) => string,
    edit:       (id: string) => string
};

export type SupportedApiEntity = "user" | "product" | "sale";
export type SupportedAppEntity = "usuarios" | "productos" | "ventas";

export function getApiEndpointsForEntity(entityName: SupportedApiEntity): ApiEndpointsObject {
    const localBaseUrl = `${apiUrl}/${entityName}`;
    return {
        new: `${localBaseUrl}/new`,
        getAll: `${localBaseUrl}/all`,
        delete: (id: string) => `${localBaseUrl}/delete/${id}`,
        find:   (id: string) => `${localBaseUrl}/find/${id}`,
        edit:   (id: string) => `${localBaseUrl}/edit/${id}`,
    };
}

export function getAppEndpointsForEntity(entityName: SupportedAppEntity): AppEndpointsObject {
    const localBaseUrl = `${baseUrl}/${entityName}`;
    return {
        new: `${localBaseUrl}/nuevo`,
        showAll: `${localBaseUrl}`,
        show: (id: string) => `${localBaseUrl}/mostrar/${id}`,
        edit: (id: string) => `${localBaseUrl}/editar/${id}`,
    };
}

export const userApiEndpoints = getApiEndpointsForEntity("user");
export const productApiEndpoints = getApiEndpointsForEntity("product");
export const saleApiEndpoints = getApiEndpointsForEntity("sale");
