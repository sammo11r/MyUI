import { UserConfigSetting } from "./customTypes";

/**
 * Make a call to the backend to update the user configuration file
 * @param userConfig The user configuration object
 */
export const updateUserConfig = async (userConfig: UserConfigSetting) => {
  const rawResponse = await fetch("http://localhost:3000/api/configWriter", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userConfig),
  });
  const content = await rawResponse.json();
  console.log(content.message); // Log API response
};
