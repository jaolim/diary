import { useContext } from "react";

import { AuthContext } from "./authContext";

// useAuth for AuthContext use that throws and error if used outside of it
export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("Use only within AuthProvider")
    }

    return context
}