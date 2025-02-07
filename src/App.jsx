import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/authContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Compare from "./pages/Compare.jsx";
import Playlist from "./pages/Playlist.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
    const { accessToken } = useAuthContext();

    return (
        <>
            <Navbar />

            <Routes>
                <Route
                    path="/home"
                    element={accessToken ? <Home /> : <Navigate to="/" />}
                />
                <Route
                    path="/compare"
                    element={accessToken ? <Compare /> : <Navigate to="/" />}
                />
                <Route
                    path="/playlist"
                    element={accessToken ? <Playlist /> : <Navigate to="/" />}
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
