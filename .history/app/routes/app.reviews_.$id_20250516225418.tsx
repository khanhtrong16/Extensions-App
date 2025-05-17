/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import {
  Page,
  Card,
  DataTable,
  Button,
  Text,
  Box,
  Link,
  BlockStack,
  ButtonGroup,
} from "@shopify/polaris";
import { authenticate } from "app/shopify.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { reviewsData, id } = await getReview(params, request);
  return { reviewsData, id };
};

export default function AppReviews() {
  const { reviewsData, id } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const ListReviews = JSON.parse(reviewsData.value);
  const listReviews = ListReviews.map((item: any) => {
    return {
      id: item.id,
      author: item.author,
      rating: item.rating,
      title: item.title,
      description: item.body,
    };
  });
  console.log("listReviews đây : ", listReviews);

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
    <Button
      key={`action-${item.id}`}
      size="slim"
      onClick={() => navigate(`/app/reviews/${item.id}/edit`)}
    >
      Edit
    </Button>,
  ]);

  return (
    <Page title="Product Reviews Details">
      <Button onClick={() => navigate("/app/reviews")}>Back</Button>
      <Card>
        <Button onClick={() => navigate(`/app/reviews/${id}/create`)}>
          Create Review
        </Button>
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={["Author", "Rating", "Title", "Description", "Actions"]}
          rows={rows}
        />
      </Card>
    </Page>
  );
}
