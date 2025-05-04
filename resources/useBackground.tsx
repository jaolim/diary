import { useContext } from "react";

import { BackgroundContext } from "./backgroundContext";

// useBackground for BackgroundContext use that throws and error if used outside of it
export const useBackground = () => {
    const context = useContext(BackgroundContext)

    if (!context) {
        throw new Error("Use only within background Provider")
    }

    return context
}