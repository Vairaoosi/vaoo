// functions/api/process-payment.js
export const onRequest = async ({ request, env }) => {
    try {
      const url = new URL(request.url);
      const publicToken = url.searchParams.get('publicToken');
      
      if (!publicToken) {
        return new Response(
          JSON.stringify({ error: 'Missing publicToken query parameter' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
  
      // Fetch Snipcart data
      const snipcartDataResp = await fetch(`${env.BASE_URL}/api/get-snipcart-session?publicToken=${publicToken}`);
      const snipcartData = await snipcartDataResp.json();
  
      // Create order in Cashfree
      const cashfreeResp = await fetch(`${env.BASE_URL}/api/create-cashfree-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snipcartData })
      });
  
      const cashfreeData = await cashfreeResp.json();
      
      return new Response(
        JSON.stringify({ snipcartData, cashfreeData }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
      
    } catch (e) {
      console.error('Error in payment processing:', e);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', message: e.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
  