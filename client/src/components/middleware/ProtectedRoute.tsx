import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRouteComponent: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        setToken(sessionStorage.getItem("access"));
    }, []);

    if (token === null || token === undefined) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/auth/sign-in/" replace />;
    }

    //console.log(token)
    return <>{children}</>;
};

export default ProtectedRouteComponent;