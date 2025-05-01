const { CosmosClient } = require("@azure/cosmos");

const endpoint = "YOUR_COSMOS_DB_ENDPOINT";
const key = "YOUR_COSMOS_DB_KEY";
const databaseId = "UserDatabase";
const containerId = "Users";

const client = new CosmosClient({ endpoint, key });

module.exports = async function (context, req) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    context.res = {
      status: 400,
      body: "Missing required fields",
    };
    return;
  }

  try {
    const container = client.database(databaseId).container(containerId);
    const newUser = { id: username, email, username, password };
    await container.items.create(newUser);

    context.res = {
      status: 200,
      body: "User created successfully",
    };
  } catch (error) {
    context.res = {
      status: 500,
      body: `Error: ${error.message}`,
    };
  }
};