export async function onRequestPost(context) {
  const { request, env } = context;

  const answers = await request.json();

  const tokenResponse = await fetch(
    `https://login.microsoftonline.com/${env.TENANT_ID}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET,
        scope: "https://graph.microsoft.com/.default",
        grant_type: "client_credentials"
      })
    }
  );

  const { access_token } = await tokenResponse.json();

  const emailPayload = {
    message: {
      subject: "Nové údaje z formuláře SMB Discovery",
      body: {
        contentType: "HTML",
        content: `<pre>${JSON.stringify(answers, null, 2)}</pre>`
      },
      toRecipients: [
        { emailAddress: { address: env.RECIPIENT_EMAIL } }
      ]
    }
  };

  await fetch(
    `https://graph.microsoft.com/v1.0/users/${env.SENDER_EMAIL}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(emailPayload)
    }
  );

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
