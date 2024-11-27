// old frontend

"use client"

import { FormEventHandler, useState } from "react";

import axios from "axios";
import { loginEndpoint } from "@/urls";

export default function(props: { children?: React.ReactNode, className?: string }) {
    const [ username, setUsername ] = useState("");
    const [ password, setPassword ] = useState("");

    return (
        <div>
            <form className="" onSubmit={async (event) => {
                event.preventDefault();
                const payload = {
                    userName: username,
                    userPassword: password
                };
                const user = await axios.post(loginEndpoint, new URLSearchParams(payload));
                console.log(user.data);
            }}>
                <div className="">
                    <h1>Login</h1>
                </div>
                <div className="">
                    <input onChange={(e) => setUsername(e.target.value)} value={username} placeholder="Usuario" type="text" id="usuario" autoFocus/>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Password" type="text" id="password"/>
                </div>
                <div className="">
                    <button type="submit" className="">Iniciar sesión</button>
                </div>
            </form>
        </div>
    );
}
