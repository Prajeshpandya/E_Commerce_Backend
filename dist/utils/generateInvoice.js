import easyinvoice from "easyinvoice";
// Create your invoice! Easy!
const data = {
    apiKey: "free", // Please register to receive a production apiKey: https://app.budgetinvoice.com/register
    mode: "development", // Production or development, defaults to production
    products: [
        {
            quantity: 2,
            description: "Test product",
            taxRate: 6,
            price: 33.87,
        },
    ],
};
easyinvoice.createInvoice(data, function (result) {
    // The response will contain a base64 encoded PDF file
    console.log('PDF base64 string: ', result.pdf);
    // Now this result can be used to save, download or render your invoice
    // Please review the documentation below on how to do this
});
