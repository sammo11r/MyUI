/**
 * Make a call to the backend to encrpyt the password
 * @param password
 */
 export const introspect = async (hasuraHeaders: any) => {
    // Get all base tables from hasura REST backend
    const rawResponse = await fetch("http://localhost:3000/api/introspection", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
        body: JSON.stringify({hasuraHeaders: hasuraHeaders}),
    });
    const content = await rawResponse.json();
    const data = content.data.__schema.queryType.fields;
    let instances = data.map((instance: any) => instance.name);
    // For every table hasura has query types for aggregate functions and functions on the primary key.
    // We are not intrested in those tables, only the base table, so we filter them.
    instances = instances.filter((name: string) => {
        return !name.endsWith("_aggregate") && !name.endsWith("_by_pk");
    });

    return instances;
};
