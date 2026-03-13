const { Resend } = require('resend');

async function testEmail() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("RESEND_API_KEY is not set.");
        return;
    }

    const resend = new Resend(apiKey);
    const testEmailAddress = process.argv[2] || "arasa.kumar@example.com"; // User can pass email as arg

    console.log(`Attempting to send test email to: ${testEmailAddress}`);

    try {
        const data = await resend.emails.send({
            from: "AgriBridge <onboarding@resend.dev>",
            to: testEmailAddress,
            subject: "Test Email from AgriBridge",
            html: "<p>This is a test email to verify Resend integration.</p>"
        });

        console.log("Resend API Response:", JSON.stringify(data, null, 2));
        
        if (data.error) {
            console.error("Resend delivery reported an error.");
        } else {
            console.log("Resend successfully accepted the email for delivery.");
        }
    } catch (err) {
        console.error("Fatal error during email sending:");
        console.error(err);
    }
}

testEmail();
