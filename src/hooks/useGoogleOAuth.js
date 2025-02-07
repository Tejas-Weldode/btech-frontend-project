const useGoogleOAuth = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI;
    const scope = "https://www.googleapis.com/auth/youtube.force-ssl";
    const responseType = "token";

    const login = () => {
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=${responseType}`;
        window.location.replace(url);
    };

    const handleRedirect = () => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const token = params.get("access_token");

        if (token) {
            localStorage.setItem("accessToken", token);
            console.log(localStorage.getItem("accessToken"));
            window.location.replace("/home");
        } else {
            console.error("Access token not found!!!");
        }
    };
    window.onload = handleRedirect;

    return { login };
};

export default useGoogleOAuth;
