import { Logger } from "../lib/utils";

export function getAccessToken() {
    return sessionStorage.getItem("access");
}

export function getRefreshToken() {
    return sessionStorage.getItem("refresh");
}

export async function refreshTokenIfNeeded() {
    const refresh = getRefreshToken();
    if (!refresh) {
        Logger.info("Refresh token does not exist when doing auto refreshing")
        return;
    }

    try {
        const response = await fetch("http://127.0.0.1:8000/token/refresh/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ "refresh": refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            sessionStorage.setItem("access", data.access);
        } else {
            sessionStorage.clear();
        }
    } catch (e) {
        Logger.error("Token refresh failed", e);
        sessionStorage.clear();
    }
}
