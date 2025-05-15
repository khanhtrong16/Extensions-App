export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      theme(id: "gid://shopify/OnlineStoreTheme/143326347316") {
        id
        name
        role
        files(filenames: ["config/settings_data.json"], first: 1) {
          nodes {
            body {
              ... on OnlineStoreThemeFileBodyText {
                content
              }
            }
          }
        }
      }
    }`,
  );

  const responseJson = await response.json();
  const rawContent = responseJson.data.theme.files.nodes[0].body.content;
  const cleaned = rawContent.replace(/^\/\*[\s\S]*?\*\//, "").trim();
  const parsed = JSON.parse(cleaned);
  const blocks = parsed.current.blocks;
  const firstBlock = Object.values(blocks)[0];
  return { firstBlock };
};
