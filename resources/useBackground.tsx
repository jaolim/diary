import { useContext } from "react";

import { BackgroundContext } from "./backgroundContext";

export const useBackground = () => {
    const context = useContext(BackgroundContext)

    if (!context) {
        throw new Error("Use only within background Provider")
    }

    return context
}