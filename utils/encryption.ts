import { PasswordEncryptRequest } from "./customTypes";

/**
 * Make a call to the backend to encrpyt the password
 *
 * @param {PasswordEncryptRequest} password
 * @return {*}
 */
export const encrypt = async (password: PasswordEncryptRequest) => {
  const rawResponse = await fetch("http://localhost:3000/api/encrypt", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  });
  const content = await rawResponse.json();
  return content;
};
