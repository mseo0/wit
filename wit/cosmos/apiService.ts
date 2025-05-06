import { API_URL } from './configEnv';

export type Example = {
  id: string;
  email: string;
  name: string;
  password: string;
};

export const fetchExampleDATA = async (): Promise<Example[]> => {
  try {
    const url = API_URL ? `${API_URL}/api/getExample` : '/api/getExample';
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const postExampleDATA = async (userData: {
  id: string;
  name: string;
  email: string;
  password: string;
}): Promise<Example> => {
  try {
    const response = await fetch(`${API_URL}/api/upsertExample`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to save user data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

export const fetchUsername = async (): Promise<string> => {
    try {
      const url = API_URL ? `${API_URL}/api/getUsername` : '/api/getUsername';
      const response = await fetch(url);
      const data = await response.json();
      return data.username; // Assuming the API returns { username: "JohnDoe" }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };