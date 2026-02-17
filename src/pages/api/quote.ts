import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Log the enquiry (in production, send to email or save to database)
    console.log('Quote Request Received:', {
      timestamp: new Date().toISOString(),
      ...body,
    });

    // In production, you would:
    // 1. Send email to sales team
    // 2. Save to database
    // 3. Send confirmation email to customer
    
    // For now, just return success
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Quote request submitted successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing quote request:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to process quote request',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
