import React from "react";
import { useEffect } from "react";
import { redirect } from "react-router-dom";

import useGoogleOAuth from "../hooks/useGoogleOAuth.js";
import { useAuthContext } from "../context/authContext.jsx";

function Login() {
    const { login } = useGoogleOAuth();
    const { accessToken } = useAuthContext();

    useEffect(() => {
        if (accessToken) return redirect("/home");
    }, []);

    return (
        <>
            {accessToken ? (
                ""
            ) : (
                <div>
                    <h1>Login</h1>
                    <button onClick={login}>Login with Google</button>
                </div>
            )}
        </>
    );
}

export default Login;
