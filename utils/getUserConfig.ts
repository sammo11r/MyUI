/**
 * Make a call to the backend to get the user config
 * @param hasuraHeaders 
 * @param userId 
 * @returns 
 */
 export const getUserConfig = async (hasuraHeadersVersioning: HeadersInit, userId: number) => {
    // Get all base tables from hasura REST backend
    const rawResponse = await fetch("http://localhost:3000/api/userConfig", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            hasuraHeaders: hasuraHeadersVersioning,
            userId: userId
        }),
    });
    const content = await rawResponse.json();
    return content;
};
