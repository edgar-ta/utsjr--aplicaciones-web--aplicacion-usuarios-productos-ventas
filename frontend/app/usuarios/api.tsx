import axios from "axios";

export type ApiResponseType<K> = {
    type: string,
    details: K
};

export type UserApiPayload = {
    id: string,
    name: string,
    encryptedPassword: string,
    salt: string,
    username: string,
    systemId: string
};

export type UserExternalData = {
    id: string,
    name: string,
    username: string
};

export function payloadToData(payload: UserApiPayload): UserExternalData {
    return {
        id: payload.id,
        name: payload.name,
        username: payload.username
    };
}

export async function getUsers(): Promise<UserExternalData[]> {
    const endPoint = `${process.env.API_URL}/user/all`;
    return axios
        .get(endPoint)
        .then(response => response.data)
        .then((data: ApiResponseType<UserApiPayload[]>) => data.details)
        .then(data => data.map(payloadToData))
    ;
}

