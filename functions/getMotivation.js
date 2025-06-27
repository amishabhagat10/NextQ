export async function handler() {
  try {
    const response = await fetch("https://zenquotes.io/api/random");
    const data = await response.json();
    const quote = data[0]?.q + " — " + data[0]?.a;

    return {
      statusCode: 200,
      body: JSON.stringify({ quote })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch quote" })
    };
  }
}