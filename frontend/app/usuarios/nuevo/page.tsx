"use client";

import FormElement from "@/components/form-page/form-element";
import PasswordInputElement from "@/components/form/password-input-element";
import TextInputElement from "@/components/form/text-input-element";
import { useState } from "react";
import { ApiUserData } from "../page";


export type UserInputData = {
    name: string,
    username: string,
    password?: string,
    passwordConfirmation?: string,
};

function buildOnChangeCallback(setCallback: React.Dispatch<React.SetStateAction<string>>) {
    return (element: React.ChangeEvent<HTMLInputElement>) => setCallback(element.target.value);
}

export default function(
    props: {
        user?: ApiUserData
    }
) {
    const [ isPasswordVisible, setPasswordVisibility ] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordVisibility((state) => !state);
    };

    const [ name, setName ] = useState(props.user?.name || "");
    const [ username, setUsername ] = useState(props.user?.username || "");
    const [ password, setPassword ] = useState("");
    const [ passwordConfirmation, setPasswordConfirmation ] = useState("");

    return (
        <FormElement<UserInputData>
            recordId={props.user?.id}
            apiEntityName="user"
            appEntityName="usuarios"
            editionHeading="Editando Usuario"
            insertionHeading="Insertando nuevo usuario"
            getPayload={() => {
                if (password.trim() == passwordConfirmation.trim() && password.trim().length == 0) {
                    return { name, username };
                } 
                return { name, username, password, passwordConfirmation };
            }}
            validationCallback={() => {
                if (password != passwordConfirmation) return new Error("La contraseña debe coincidir con el campo de confirmación de contraseña");
                return null;
            }}
            >
            <TextInputElement 
                value={name} 
                minLength={8} 
                maxLength={32} 
                label="Nombre Completo" 
                required 
                placeholder="Juan Pérez" 
                className="col-start-1" 
                onChange={buildOnChangeCallback(setName)}
                />
            <TextInputElement 
                value={username} 
                label="Nombre de Usuario" 
                required 
                placeholder="juan_perez" 
                className="col-start-2" 
                onChange={buildOnChangeCallback(setUsername)}
                minLength={8}
                maxLength={32}
                />
            <PasswordInputElement 
                label="Contraseña" 
                className="row-start-2" 
                isVisible={isPasswordVisible}
                onButtonClicked={togglePasswordVisibility}
                maxLength={16}
                minLength={8}
                value={password}
                onChange={buildOnChangeCallback(setPassword)}
                />
            <PasswordInputElement 
                label="Confirmar Contraseña" 
                className="row-start-3"
                isVisible={isPasswordVisible}
                onButtonClicked={togglePasswordVisibility}
                maxLength={16}
                minLength={8}
                value={passwordConfirmation}
                onChange={buildOnChangeCallback(setPasswordConfirmation)}
                />
        </FormElement>
    );
}

