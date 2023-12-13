
export const getEnvVariables = () => {
    import.meta.env;//se comenta esto
    return {
        ...import.meta.env//se comenta esto
        // VITE_MODE: import.meta.env.VITE_MODE,
        // VITE_API_URL: process.meta.env.VITE_API_URL,
    }
}
