/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query AppInstallationMetafields($ownerId: ID!, $key: String!) {
    appInstallation(id: $ownerId) {
    metafield(namespace: "product_reviews", key: $key) {
      id
      namespace
      key
      value
    }
  }
}`,
    {
      variables: {
        key: `reviews_${params.id}`,
        ownerId: "gid://shopify/AppInstallation/557070614580",
      },
    },
  );
  const data = await response.json();
  console.log("data đây : ", data.data.appInstallation.metafield);
  const reviewsData = data.data.appInstallation.metafield;
  return reviewsData;
};

export default function AppReviews() {
  const reviewsData = useLoaderData<typeof loader>();
  const ListReviews = JSON.parse(reviewsData.value);
  const listReviews = ListReviews.map((item: any) => {
    return {
      author: item.author,
      rating: item.rating,
      title: item.title,
      description: item.body,
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
      {item.author}
    </Text>,
    item.rating + "★",
    item.title,
    item.description,
    <Button key={`action-${item.id}`} size="slim" onClick={() => item.id}>
      Edit
    </Button>,
  ]);

  return (
    <Page title="Product Reviews Details">
      <Card>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={["Author", "Rating", "Title", "Description", "Actions"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
