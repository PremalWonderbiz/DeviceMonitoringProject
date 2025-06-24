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

export function formatRelativeTime(timestamp: string): string {
  const time = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - time.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  } else if (hours < 24) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}
