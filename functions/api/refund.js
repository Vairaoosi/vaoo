// functions/api/refund.js

// export default async (req, res) => {
//   const { transactionId } = req.query
//   try {
//     // Validate the request was made by Snipcart
//     await axios.get(`${process.env.PAYMENT_URL}/api/public/custom-payment-gateway/validate?publicToken=${req.body.publicToken}`)

//     // TODO: Refund the order via the gateway
    
//     return res.json({
//       refundId: transactionId
//     })
//   } catch (e) {
//     // Couldn't validate the request
//     console.error(e)
//     return res.status(401)
//   }
// }

// functions/api/refund.js

import axios from 'axios';

export const onRequest = async ({ request, env }) => {
  try {
    // Parse the incoming request body (assuming JSON)
    const reqBody = await request.json();

    // Extract transactionId from the query parameters
    const url = new URL(request.url);
    const transactionId = url.searchParams.get('transactionId');

    if (!transactionId) {
      return new Response(
        JSON.stringify({ error: 'Missing transactionId query parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate the request was made by Snipcart
    if (reqBody && reqBody.publicToken) {
      await axios.get(`${env.PAYMENT_URL}/api/public/custom-payment-gateway/validate?publicToken=${reqBody.publicToken}`);

      // TODO: Refund the order via the gateway
      // Your refund logic with the payment gateway should be added here

      return new Response(
        JSON.stringify({ refundId: transactionId }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // If the publicToken is missing, return a 401 Unauthorized error
      return new Response(
        JSON.stringify({ error: 'Missing or invalid publicToken' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (e) {
    console.error('Error during refund request:', e);

    // Return a 500 error if any issue occurs
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
