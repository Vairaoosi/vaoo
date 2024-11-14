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
  
      // Fetch Snipcart payment session data
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
  
      return new Response(
        JSON.stringify(snipcartData),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
  
    } catch (e) {
      console.error('Error fetching Snipcart session data:', e);
      return new Response(
        JSON.stringify({ error: 'Internal Server Error', message: e.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
