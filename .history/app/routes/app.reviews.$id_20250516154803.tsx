/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query AppInstallationMetafields($ownerId: ID!) {
    appInstallation(id: $ownerId) {
    metafield(namespace: "product_reviews", key: "reviews_8003700228148") {
      id
      namespace
      key
      value
    }
  }
}`,
    {
      variables: {
        ownerId: "gid://shopify/AppInstallation/557070614580",
      },
    },
  );
  const data = await response.json();
  console.log("data đây : ", data.data.node);
  return data;
};

export default function AppReviews() {
  console.log("chuyển rồi");

  const reviewsData = useLoaderData<typeof loader>();
  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
  };
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
    <Page title="Product Reviews Details">
      <Card>
        {/* <DataTable
          columnContentTypes={["text", "text", "numeric", "text"]}
          headings={["ProductID", "Rating", "Review Count", "Actions"]}
          rows={rows}
        /> */}
      </Card>
    </Page>
  );
}
