// functions/api/payment-methods.js

import axios from 'axios'

export const onRequest = async ({ request, env }) => {
  const reqBody = await request.json();  // Parse the incoming request body
  console.log(JSON.stringify(reqBody));

  if (reqBody && reqBody.publicToken) {
    try {
      // This is to Validate that the request was actually made by Snipcart
      await axios.get(`${env.PAYMENT_URL}/api/public/custom-payment-gateway/validate?publicToken=${reqBody.publicToken}`);

      // Return the payment methods to snipcart
      return new Response(
        JSON.stringify([{
          id: 'cashfree',
          name: 'Cashfree',
          checkoutUrl: `${env.CHECKOUT_URL_2}`,
       },
       {
          id: 'paymentrequest-custom-gateway',
          name: 'Google Pay',
          checkoutUrl: `${env.CHECKOUT_URL}`,  // Dynamic checkout URL
          iconUrl: `${env.CHECKOUT_URL}/google_pay.png`
        }]),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (e) {
      // Couldn't validate the request
      console.error(e);
      return new Response(null, { status: 401 });
    }
  }

  // No publicToken provided. This means the request was NOT made by Snipcart
  return new Response(null, { status: 401 });
};


