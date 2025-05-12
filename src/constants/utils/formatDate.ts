/* eslint-disable @typescript-eslint/no-explicit-any */
export const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = String(date.getFullYear()).slice(2); // Get last 2 digits of the year
    return `${day}/${month}/${year}`;
};

export const formatDueDate = (date: any) => {
    const now = new Date();

    const due = new Date(date);

    const diffMs = due.getTime() - now.getTime();

    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    return `${days} Day(s)`;
};