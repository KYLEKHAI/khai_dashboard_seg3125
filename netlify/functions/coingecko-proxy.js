const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const path = event.path.replace("/.netlify/functions/coingecko-proxy", "");

    const apiUrl = `https://api.coingecko.com/api/v3${path}?${
      event.queryStringParameters
        ? new URLSearchParams(event.queryStringParameters).toString()
        : ""
    }`;

    console.log("Proxying request to:", apiUrl);

    const response = await fetch(apiUrl);
    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy error:", error);

    return {
      statusCode: 500,
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Failed to fetch data from CoinGecko API",
      }),
    };
  }
};
