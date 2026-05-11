export async function onRequestPost(context) {
  const data = await context.request.json();

  const repoOwner = "TVŮJ_GITHUB_USERNAME";
  const repoName = "TVŮJ_REPOZITÁŘ";
  const folder = "responses";

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `${timestamp}.json`;

  const content = btoa(JSON.stringify(data, null, 2));

  const githubToken = context.env.GITHUB_TOKEN;

  const response = await fetch(
    `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${folder}/${filename}`,
    {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: `New form submission (${timestamp})`,
        content: content
      })
    }
  );

  return new Response("OK", { status: response.status });
}
