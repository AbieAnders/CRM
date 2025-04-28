import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Logger } from "../../lib/utils";
import { ClipLoader } from "react-spinners";

const isTokenExpired = (token: string | null) => {
    if (!token) {
        Logger.warn("Token was inaccessible during expiration check");
        return true;
    }
    try {
        const decoded: any = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
        const expiry = decoded.exp * 1000; // Convert expiry time to ms
        const isExpired = Date.now() >= expiry;
        if (isExpired) {
            Logger.info("Token has expired");
        }
        return isExpired;
    } catch (error) {
        Logger.info("Token was expired or invalid during expiration check");
        return true;
    }
};

const ProtectedRouteComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isTokenValid, setIsTokenValid] = useState<boolean>(true);
    const [expiryTimeout, setExpiryTimeout] = useState<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const storedToken = sessionStorage.getItem("access");
        setToken(storedToken);

        if (storedToken) {
            if (!isTokenExpired(storedToken)) {
                setLoading(false);
                Logger.info("Token is valid, setting up auto-refresh");
                setupTokenRefresh(storedToken);
            } else {
                setLoading(false);
                Logger.info("Token expired or not found, attempting refresh");
                refreshToken();
            }
        } else {
            setLoading(false);
            Logger.warn("No access token found, redirecting to login.");
            setIsTokenValid(false);
        }

        return () => {
            if (expiryTimeout) {
                clearTimeout(expiryTimeout);
            }
        };
    }, []);

    const setupTokenRefresh = (token: string) => {
        try {
            const decoded: any = JSON.parse(atob(token.split('.')[1]));
            const expiryTime = decoded.exp * 1000; // Expiry time in ms
            const refreshBeforeExpiry = 4 * 60 * 1000; // 2 minutes
            const intervalTime = 45 * 1000;

            //Logger.info("Setting up token refresh...");

            const interval = setInterval(() => {
                const now = Date.now();
                const timeLeft = expiryTime - now;
    
                if (timeLeft < refreshBeforeExpiry) {
                    Logger.info("Token is nearing expiry, refreshing...");
                    clearInterval(interval);
                    refreshToken();
                }
            }, intervalTime);
    
            setExpiryTimeout(interval);
        } catch (error) {
            Logger.error("Failed to parse token for refresh interval setup", error);
        }
    };

    const refreshToken = async () => {
        const refreshToken = sessionStorage.getItem("refresh");
        if (!refreshToken) {
            Logger.warn("No refresh token available");
            sessionStorage.removeItem("access");
            sessionStorage.removeItem("refresh");
            setIsTokenValid(false);
            setLoading(false);
            return;
        }

        Logger.info("Attempting to refresh token...");
        try {
            const response = await fetch("http://127.0.0.1:8000/auth/token/refresh/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                
                Logger.info("Token refreshed successfully");
                sessionStorage.setItem("access", data["access-token"]);

                setIsTokenValid(true);
                setupTokenRefresh(data["access-token"]);
            } else {
                const errorText = await response.text();
                Logger.error(`Failed to refresh token. Response: ${errorText}`);
                
                if (response.status === 401) {
                    Logger.error("Refresh token expired or invalid, clearing session storage");
                }
                
                sessionStorage.removeItem("access");
                sessionStorage.removeItem("refresh");

                setIsTokenValid(false);
            }
        } catch (error) {
            Logger.error("Error refreshing token:", error);
            sessionStorage.removeItem("access");
            sessionStorage.removeItem("refresh");
            
            setIsTokenValid(false);
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader size={15} color="#3ac285" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }
    if (!isTokenValid) {
        Logger.warn("Redirecting to sign-in as token is invalid");
        return <Navigate to="/auth/sign-in/" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRouteComponent;