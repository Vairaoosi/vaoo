// functions/api/create-cashfree-order.js
export const onRequest = async ({ request, env }) => {
    try {
      const url = new URL(request.url);
      const { snipcartData, orderAmount, currency } = await request.json(); // Assumes Snipcart data is passed in request body
  
      if (!snipcartData || !snipcartData.invoice) {
        return new Response(
          JSON.stringify({ error: 'Invalid Snipcart data' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      const customerDetails = {
        customer_id: snipcartData.invoice.targetId,
        customer_name: snipcartData.invoice.billingAddress.name,
        customer_email: snipcartData.invoice.email,
        customer_phone: snipcartData.invoice.shippingAddress.phone || '0000000000',
      };
  
      // Generate unique order ID (ensure it's unique)
      const uniqueOrderId = `${snipcartData.id}_${Date.now()}`;
  
      const returnUrl = `https://vairaoosi.com/api/confirm-transaction?sessionId=${snipcartData.id}&orderId=${uniqueOrderId}`;
  
      const orderData = {
        order_amount: orderAmount || snipcartData.invoice.amount,
        order_currency: currency || snipcartData.invoice.currency.toUpperCase(),
        order_id: uniqueOrderId,
        customer_details: customerDetails,
        order_meta: {
          return_url: returnUrl,
        },
      };
  
      const cashfreeResp = await fetch('https://sandbox.cashfree.com/pg/orders', {
        method: 'POST',
        headers: {
          'x-client-id': env.CASHFREE_CLIENT_ID,
          'x-client-secret': env.CASHFREE_CLIENT_SECRET,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-api-version': '2023-08-01'
        },
        body: JSON.stringify(orderData),
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
  
      return new Response(
        JSON.stringify({ snipcartData, cashfreeData }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (e) {
      console.error('Error during Cashfree order creation:', e);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', message: e.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
  