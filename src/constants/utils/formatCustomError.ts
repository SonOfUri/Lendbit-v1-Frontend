export const formatCustomError = (reason: string): string => {
    // Split by double underscore to separate contract and error
    const [rawContract, rawError] = reason.split("__");

    // Format contract name (add space before capital letters)
    const formattedContract = rawContract.replace(/([a-z])([A-Z])/g, "$1 $2");

    // Format error message
    const formattedError = rawError
        .replace(/([a-z])([A-Z])/g, "$1 $2") // add space before capitals
        .replace(/_/g, " ");                // replace underscores with space

    return `${formattedContract} 🔒 ${formattedError}`;
};