// Simple example of hitting the /api/name?name=Beth end point returns a status of 200 and the message with param included below
exports.handler = async (event, context) => {
	const { name = "Anonymous" } = event.queryStringParameters;
	return {
	  statusCode: 200,
	  body: JSON.stringify(`Hello, ${name}`)
	};
  };
