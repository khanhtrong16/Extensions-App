import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
type AdminAPI = {
  graphql: (query: string) => Promise<Response>;
};

type BlockData = {
  disabled: boolean;
  [key: string]: any;
};
type LoaderData = {
  firstBlock: BlockData;
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
  // const firstBlock = await fetchDisabledStatus(admin);
  // const response = await admin.graphql(
  //   `#graphql
  //   query AppInstallationMetafield($namespace: String!, $key: String!, $ownerId: ID!) {
  //     appInstallation(id: $ownerId) {
  //       apiKey: metafield(namespace: $namespace, key: $key) {
  //         value
  //       }
  //     }
  //   }`,
  //   {
  //     variables: {
  //       namespace: "product_reviews",
  //       key: "reviews_8003700228148",
  //       ownerId: "gid://shopify/AppInstallation/556783960116",
  //     },
  //   },
  // );
  const response = await admin.graphql(
    `#graphql
      query {
      appInstallation {
        metafields(first: 10, namespace: "product_reviews") {
          edges {
            node {
              id
              key
              value
            }
          }
        }
      }
    }
  `,
  );
  const data = await response.json();
  const reviewsData = data.data.appInstallation.metafields.edges.map(
    (item: any) => item.node,
  );
  const reviewList = reviewsData.filter((item: any) =>
    item.key.startsWith("reviews_"),
  );
  return reviewList;
};

export default function AppReviews() {
  // const initialData = useLoaderData<typeof loader>();
  // const [blockData, setBlockData] = useState<BlockData>(initialData.firstBlock);
  // const fetcher = useFetcher<LoaderData>();
  // // Update blockData when fetcher returns new data
  // useEffect(() => {
  //   if (fetcher.data && fetcher.data.firstBlock) {
  //     setBlockData(fetcher.data.firstBlock);
  //   }
  // }, [fetcher.data]);

  // // Initial data load effect
  // useEffect(() => {
  //   setBlockData(initialData.firstBlock);
  // }, [initialData]);

  // Handle visibility change
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === "visible") {
  //       // Reload data when tab becomes visible
  //       fetcher.load("/app/reviews");
  //     }
  //   };
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, [fetcher]);

  // const url =
  //   "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";

  // const handleAddBlock = () => {
  //   window.open(url, "_blank");
  // };
  const reviewsData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const handleViewDetails = (id: string) => {};
  console.log("reviewsData đây : ", reviewsData);

  const listReviews = reviewsData.map((item: any) => {
    const productId = item.key.replace("reviews_", "");
    const count = JSON.parse(item.value).length;
    let averageRating = 0;
    try {
      const reviews = JSON.parse(item.value);
      const totalRating = reviews.reduce(
        (sum: number, r: any) => sum + r.rating,
        0,
      );
      averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    } catch (error) {
      console.error("Lỗi parse JSON cho productId:", productId, error);
    }

    return {
      product: productId,
      rating: parseFloat(averageRating.toFixed(1)),
      count,
    };
  });
  // console.log("listReviews đây : ", listReviews);
  // return;
  const rows = listReviews.map((item: any) => [
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
      onClick={() => handleViewDetails(item.product)}
    >
      View Details
    </Button>,
  ]);

  return (
    <Page title="Product Reviews">
      <Box paddingBlockEnd="400">
        {/* <Button disabled={!blockData.disabled} onClick={handleAddBlock}>
          Add block Star Rating
        </Button> */}
      </Box>
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["ProductID", "Rating", "Review Count", "Actions"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
