// functions/api/create-order.js

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

    // Step 1: Fetch payment session data from Snipcart
    const snipcartSessionUrl = `${env.PAYMENT_URL}/api/public/custom-payment-gateway/payment-session?publicToken=${publicToken}`;
    const snipcartResp = await fetch(snipcartSessionUrl);

    if (!snipcartResp.ok) {
      const errorData = await snipcartResp.json();
      throw new Error(`Error fetching Snipcart session data: ${errorData.message}`);
    }

    const snipcartData = await snipcartResp.json();

    if (!snipcartData || !snipcartData.invoice) {
      return new Response(
        JSON.stringify({ error: 'Invalid Snipcart session data' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Prepare the data for Cashfree order creation
    const customerDetails = {
      customer_id: snipcartData.invoice.targetId,  // Using Snipcart's targetId as customer_id
      customer_name: snipcartData.invoice.billingAddress.name,
      customer_email: snipcartData.invoice.email,
      customer_phone: snipcartData.invoice.shippingAddress.phone || '0000000000',  // Use a default phone if not provided
    };

    // Generating a unique order ID using Snipcart's session ID + timestamp to ensure no duplication
    const uniqueOrderId = `${snipcartData.id}_${Date.now()}`;  // Adding timestamp for uniqueness

    // The return URL now includes the unique order ID
    const returnUrl = `https://vairaoosi.com/api/confirm-transaction?sessionId=${snipcartData.id}&orderId=${uniqueOrderId}`;

    const orderData = {
      order_amount: snipcartData.invoice.amount,  // Snipcart amount
      order_currency: snipcartData.invoice.currency.toUpperCase(),  // Ensure currency is in uppercase
      order_id: uniqueOrderId,  // Unique order ID
      customer_details: customerDetails,
      order_meta: {
        return_url: returnUrl,  // Updated return URL with the unique order ID
      },
    };

    // Step 3: Create order in Cashfree using the prepared data
    const cashfreeResp = await fetch('https://sandbox.cashfree.com/pg/orders', {
      method: 'POST',
      headers: {
        'x-client-id': env.CASHFREE_CLIENT_ID,  // Cashfree client ID from environment
        'x-client-secret': env.CASHFREE_CLIENT_SECRET,  // Cashfree client secret from environment
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01'
      },
      body: JSON.stringify(orderData)
    });

    if (!cashfreeResp.ok) {
      const errorData = await cashfreeResp.json();
      throw new Error(`Error creating order in Cashfree: ${errorData.message}`);
    }

    const cashfreeData = await cashfreeResp.json();

    if (!cashfreeData || !cashfreeData.cf_order_id) {
      return new Response(
        JSON.stringify({ error: 'Error creating order in Cashfree' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Return combined data from Snipcart and Cashfree
    const response = {
      snipcartData: snipcartData,
      cashfreeData: cashfreeData
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (e) {
    console.error('Error during payment processing:', e);

    return new Response(
      JSON.stringify({ error: 'Internal Server Error', message: e.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
