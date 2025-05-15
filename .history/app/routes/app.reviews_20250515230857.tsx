import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import { useEffect } from "react";

type AdminAPI = {
  graphql: (query: string) => Promise<Response>;
};
async function fetchDisabledStatus(admin: AdminAPI) {
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
  return firstBlock;
}

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const firstBlock = await fetchDisabledStatus(admin);
  return { firstBlock };
};

export default function AppReviews() {
  const { firstBlock } = useLoaderData<typeof loader>();
  // console.log("firstBlock", firstBlock);
  const fetcher = useFetcher();
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetcher.load("/app/reviews");
      } else {
        return false;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetcher]);

  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";

  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  const reviewsData = [
    {
      id: "1",
      product: "Product 1",
      rating: "4.5",
      count: 100,
    },
  ];

  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
  };

  const rows = reviewsData.map((item) => [
    <Text
      key={`product-${item.id}`}
      variant="bodyMd"
      fontWeight="bold"
      as="span"
    >
      {item.product}
    </Text>,
    item.rating + "★",
    item.count,
    <Button
      key={`action-${item.id}`}
      size="slim"
      onClick={() => handleViewDetails(item.id)}
    >
      View Details
    </Button>,
  ]);

  return (
    <Page title="Product Reviews">
      <Box paddingBlockEnd="400">
        <Button disabled={!firstBlock.disabled} onClick={handleAddBlock}>
          Add block Star Rating
        </Button>
      </Box>
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["Product", "Rating", "Review Count", "Actions"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
