import { useQuery } from "react-query";
import { workspaceStates } from "../const/enum";

/**
 * @export
 * @param {*} {
 *   isBaseTable,
 *   hasuraProps,
 *   hasuraHeaders,
 *   setEditable,
 *   setInsertable,
 *   setDeletable,
 *   tableName,
 *   mode
 * }
 */
export function checkPermissions({
  isBaseTable,
  hasuraProps,
  hasuraHeaders,
  setEditable,
  setInsertable,
  setDeletable,
  tableName,
  mode,
  gridViewToggle,
}: any) {
  // Check if the base table is editable by the logged-in user
  useQuery(["accessQuery", tableName, gridViewToggle], async () => {
    await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `{ __type(name: "mutation_root") { fields { name }}}`,
      }),
    })
      .then((result) => result.json())
      .then((result) => {
        if (result.data && isBaseTable) {
          // Set the editable state
          setEditable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "update_" + tableName
            )
          );
          // Set the insertable state
          setInsertable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "insert_" + tableName
            )
          );
          // Set the deletable state
          setDeletable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "delete_" + tableName
            )
          );
        } else {
          // Table is a grid view on a dashboard
          // Data cannot be modified while being in edit mode
          setEditable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "update_" + tableName
            ) && mode != workspaceStates.EDIT_DASHBOARD
          );
          setInsertable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "insert_" + tableName
            ) && mode != workspaceStates.EDIT_DASHBOARD
          );
          setDeletable(
            result.data.__type.fields.some(
              (e: { name: string }) => e.name == "delete_" + tableName
            ) && mode != workspaceStates.EDIT_DASHBOARD
          );
        }
      });
  });
}

/**
 * @export
 * @param {*} {
 *   editRowQueryInput,
 *   hasuraProps,
 *   hasuraHeaders,
 *   editRowForm,
 *   setEditingKey,
 *   setTableNameState,
 *   setEditRowQueryInput,
 *   t
 * }
 */
export function updateRowQuery({
  editRowQueryInput,
  hasuraProps,
  hasuraHeaders,
  editRowForm,
  setEditingKey,
  setTableNameState,
  setEditRowQueryInput,
  setAlert,
  setAlertText,
  gridViewToggle, 
  setGridViewToggle,
  t,
}: any) {
  useQuery(["updateRowQuery", editRowQueryInput], async () => {
    // Only execute the query if it is defined
    if (editRowQueryInput !== undefined) {
      let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
        method: "POST",
        headers: hasuraHeaders,
        body: JSON.stringify({
          query: editRowQueryInput,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          // Check if there are errors thrown by Hasura
          if (res.errors) {
            // Get the error message
            let errorMessage: string = res.errors[0].message;
            let column = "";
            let error = ["Error"];
            if (errorMessage.includes("not found in type")) {
              // User was not allowed to edit this column, show error
              column = errorMessage.substring(
                errorMessage.indexOf('"') + 1,
                errorMessage.lastIndexOf('"')
              );
              error = [t(`table.editError`)];
            } else if (errorMessage.includes("Foreign key violation")) {
              // Foreign key violated by user's input, show error
              column = errorMessage.substring(
                errorMessage.indexOf("_") + 1,
                errorMessage.lastIndexOf("_")
              );
              error = [t(`table.foreignKey`)];
            } else {
              setAlert(true);
              setAlertText(errorMessage);
            }
            editRowForm.setFields([
              {
                name: column,
                errors: error,
              },
            ]);
          } else {
            // Close edit menu
            setEditingKey("");
            // Force a update for the table by setting a unique table name
            setTableNameState(crypto.randomUUID());
            setGridViewToggle(!gridViewToggle);
          }
        });

      setEditRowQueryInput(undefined);
    }
  });
}
