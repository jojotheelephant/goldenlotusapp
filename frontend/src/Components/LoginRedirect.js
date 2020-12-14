import { useSelector } from "react-redux";
import { useEffect } from "react";

// redirects to login -> cart if user is not logged in
const LoginRedirect = (location, history) => {
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const redirect = location.search
        ? location.search.split("=")[1]
        : "/login?redirect=cart";

    useEffect(() => {
        if (!userInfo) {
            history.push(redirect);
        }
    }, [history, userInfo, redirect]);
};

export default LoginRedirect;
