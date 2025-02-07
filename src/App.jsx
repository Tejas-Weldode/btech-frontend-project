import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/authContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

function App() {
    const { accessToken } = useAuthContext();

    return (
        <>
            <h1>YouTube comments analyzer</h1>

            <Routes>
                <Route
                    path="/home"
                    element={accessToken ? <Home /> : <Navigate to="/" />}
                />
                <Route
                    path="/"
                    element={accessToken ? <Navigate to="/home" /> : <Login />}
                />
            </Routes>
        </>
    );
}

export default App;
