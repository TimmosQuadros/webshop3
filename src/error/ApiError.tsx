interface ApiErrorData {
    message?: string;
    errors?: Record<string, string[]>;
}

class ApiError extends Error {
    status: number;
    data: ApiErrorData;

    constructor(status: number, data: ApiErrorData) {
        super(ApiError.determineErrorMessage(status, data));
        this.status = status;
        this.data = data;
    }

    static determineErrorMessage(status: number, data: ApiErrorData): string {
        if (status === 400) {
            let message = 'Please check your submission for any errors.';
            if (data && data.errors) {
                message += ' Details: ' + Object.values(data.errors).join(' ');
            }
            return message;
        } else if (status === 401) {
            return 'You are not authorized. Please log in and try again.';
        } else if (status === 403) {
            return 'You do not have permission to perform this action.';
        } else if (status === 404) {
            return 'The requested resource was not found.';
        } else if (status === 408) {
            return 'Your request timed out. Please try again.';
        } else if (status === 429) {
            return 'You have sent too many requests. Please wait and try again later.';
        } else if (status === 500) {
            return 'A server error occurred. We are working to resolve this issue.';
        } else if (status === 503) {
            return 'Our service is currently unavailable. Please try again later.';
        } else {// If the error object contains a message, use it; otherwise, use a generic message
            return (data && typeof data.message === 'string') ? data.message : 'An unexpected error occurred.';
        }
    }
}

export default ApiError;