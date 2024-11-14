// api/submit.js

export async function onRequestPost(context) {
    // Get the form data (email submitted by user)
    const formData = await context.request.formData();
    const email = formData.get('email');

    // Validate email
    if (!email) {
        return new Response('Email is required', { status: 400 });
    }

    // SendGrid API URL
    const sendGridAPIUrl = 'https://api.sendgrid.com/v3/mail/send';

    // Get SendGrid API key from Cloudflare Pages Secrets
    const sendGridApiKey = context.env.SENDGRID_API_KEY;  // Use context.env to access secrets in Cloudflare Workers

    // Email content for sending a welcome message to the user
    const messageToUser = {
        personalizations: [
            {
                to: [{ email: email }],
                subject: 'Welcome to Our Newsletter!',
            },
        ],
        from: { email: 'support@vairaoosi.com' }, // Your email
        content: [
            {
                type: 'text/plain',
                value: `Hi there,

Thank you for signing up for our newsletter! We are excited to have you on board. You will receive the latest updates, news, and special offers directly to your inbox.

Stay tuned for our upcoming emails!

Best regards,
The [Your Company Name] Team`,
            },
        ],
    };

    try {
        // Send the welcome email to the user
        const responseUser = await fetch(sendGridAPIUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sendGridApiKey}`,
            },
            body: JSON.stringify(messageToUser),
        });

        if (!responseUser.ok) {
            throw new Error('Error sending welcome email to user');
        }

        // Return a success response
        return new Response('Form submitted successfully and welcome email sent!', { status: 200 });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response('Error submitting form', { status: 500 });
    }
}
