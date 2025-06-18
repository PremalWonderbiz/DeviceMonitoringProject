//function to capitalize first letter of the input text
export function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function handleAxiosError(error: any) {
    if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Server responded with an error:", error.response.status, error.response.data);
    } else if (error.request) {
        // Request was made, but no response received
        console.error("No response received. Server may be down or unreachable.");
    } else {
        // Something else happened
        console.error("Error setting up the request:", error.message);
    }
}