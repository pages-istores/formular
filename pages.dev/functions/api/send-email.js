export async function onRequestPost(context) {
    const data = await context.request.json();

    const message = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

    const email = {
        personalizations: [
            {
                to: [{ email: "pages@logicworks.cz" }],
                subject: "Nová odpověď z firemního dotazníku"
            }
        ],
        from: { email: "no-reply@pages.dev", name: "Firemní formulář" }
        content: [
            {
                type: "text/plain",
                value: message
            }
        ]
    };

    await fetch("https://api.mailchannels.net/tx/v1/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(email)
    });

    return new Response("OK", { status: 200 });
}
