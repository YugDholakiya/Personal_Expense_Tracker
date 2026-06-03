import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

/**
 * Wraps the entire app. Provides { isLoggedIn, userName, checkAuth, logout }
 * to every component via useAuth().
 */
export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true); // true while first check runs

    // Call the backend to determine current session state
    const checkAuth = useCallback(async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/status`, {
                credentials: "include",
            });
            const data = await res.json();
            setIsLoggedIn(data.loggedIn === true);
            setUserName(data.name || "");
        } catch {
            setIsLoggedIn(false);
            setUserName("");
        } finally {
            setLoading(false);
        }
    }, []);

    // Run once on mount
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const logout = useCallback(async () => {
        setIsLoggedIn(false);
        setUserName("");
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userName, loading, checkAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
