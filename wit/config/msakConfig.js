export const msalConfig = {
    auth: {
      clientId: "cd0bbe46-cc26-4b8c-a44a-bc2beb1edad4", // Replace with your Azure AD App's client ID
      authority: "https://login.microsoftonline.com/f1117260-f8a0-4080-a864-401f06c68314", // Replace with your tenant ID
      redirectUri: "myapp://auth", // Use your custom scheme
    },
  };