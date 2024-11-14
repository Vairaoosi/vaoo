// functions/api/confirm-payments.js

import axios from 'axios';

export const onRequest = async ({ request, env }) => {
  try {
    // Parse the incoming request body (assuming JSON)
    const reqBody = await request.json();
    
    // Retrieve the sessionId from query parameters
    const url = new URL(request.url);
    const paymentSessionId = url.searchParams.get('sessionId');

    // Construct the data object to match Snipcart's schema
    const data = {
      paymentSessionId,
      state: 'processed',
      transactionId: reqBody.requestId,
      instructions: 'Your payment will appear on your statement in the coming days',
      links: {
        refunds: `https://vairaoosi.com/api/refund?transactionId=${reqBody.requestId}`
      }
    };

    // Authentication using Snipcart API key
    const options = {
      headers: {
        Authorization: `Bearer ${env.SNIPCART_PRIMARY_API}`
      }
    };

    // Confirm the payment with Snipcart API
    const resp = await axios.post(`${env.PAYMENT_URL}/api/private/custom-payment-gateway/payment`, data, options);
    
    // Return the Snipcart order confirmation URL to redirect the user
    return new Response(
      JSON.stringify({ returnUrl: resp.data.returnUrl }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (e) {
    console.error('Error confirming payment:', e);
    
    // Return a 500 error if anything goes wrong
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
