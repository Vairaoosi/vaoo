// functions/api/payment-session.js

// import axios from 'axios'

// export default async (req, res) => {
//   try {
//     const {publicToken} = req.query
//     const resp = await axios.get(`${process.env.PAYMENT_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`)
//     return res.json(resp.data)
//   } catch (e) {
//     console.error(e)
//     return res.status(500).send()
//   }
// }

// functions/api/payment-session.js

import axios from 'axios';

export const onRequest = async ({ request, env }) => {
  try {
    // Extract query parameter 'publicToken' from the request URL
    const url = new URL(request.url);
    const publicToken = url.searchParams.get('publicToken');

    if (!publicToken) {
      return new Response(
        JSON.stringify({ error: 'Missing publicToken query parameter' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Make an external request to the payment gateway to get payment session details
    const resp = await axios.get(`${env.PAYMENT_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`);

    // Return the payment session data to the client
    return new Response(
      JSON.stringify(resp.data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('Error fetching payment session:', e);

    // Return a 500 error in case of failure
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
