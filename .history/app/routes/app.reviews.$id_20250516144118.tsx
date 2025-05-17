import { LoaderFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
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
  const reviewsData = useLoaderData<typeof loader>();
  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
  };
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
      onClick={() => handleViewDetails(item.id)}
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
