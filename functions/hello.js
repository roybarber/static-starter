// Simple example of hitting the /api/hello end point returns a status of 200 and the responseData included below
exports.handler = async function (event, context) {
	return {
		statusCode: 200,
		body: JSON.stringify(responseData)
	};
}
const responseData = {
	items: [
		{
			name: "Item 1",
			price: "£20.00",
			productMessage: null
		},
		{
			name: "Item 2",
			price: "£21.00",
			productMessage: null
		}
	]
}
