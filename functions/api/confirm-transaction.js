// functions/api/confirm-payments.js

import axios from 'axios';

export const onRequest = async ({ request, env }) => {
  try {
    // Parse the incoming request body (assuming JSON)
    const reqBody = await request.json();
    
    // Retrieve the sessionId from query parameters
    const url = new URL(request.url);
    const paymentSessionId = url.searchParams.get('sessionId');
    
    // Call Cashfree API to check payment status
    const cashfreeResponse = await checkCashfreePaymentStatus(paymentSessionId, env);

    // If payment is not successful or pending, handle it accordingly
    if (cashfreeResponse.payment_status !== 'SUCCESS') {
      if (cashfreeResponse.payment_status === 'PENDING') {
        return new Response(
          JSON.stringify({ error: 'Payment is pending. Please wait or try again later.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (cashfreeResponse.payment_status === 'USER_DROPPED') {
        return new Response(
          JSON.stringify({ error: 'Payment was dropped by the user.' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (cashfreeResponse.payment_status === 'FAILED') {
        return new Response(
          JSON.stringify({
            error: `Payment failed: ${cashfreeResponse.error_details.error_description_raw || 'Unknown error'}`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
    
    // If payment was successful, confirm it with Snipcart
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

// Function to check the payment status with Cashfree
const checkCashfreePaymentStatus = async (sessionId, env) => {
  try {
    const url = `https://sandbox.cashfree.com/pg/orders/${sessionId}/payments`;
    const headers = {
      'x-client-id': env.CASHFREE_CLIENT_ID,
      'x-client-secret': env.CASHFREE_CLIENT_SECRET,
      'Accept': 'application/json',
      'x-api-version': '2023-08-01'
    };

    const response = await axios.get(url, { headers });
    const paymentStatus = response.data[0]; // Assuming the response is an array with one payment entry

    return paymentStatus;
  } catch (e) {
    console.error('Error checking Cashfree payment status:', e);
    throw new Error('Unable to fetch Cashfree payment status');
  }
};
