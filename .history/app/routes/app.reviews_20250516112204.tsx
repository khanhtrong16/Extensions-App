import { LoaderFunction, json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import { useEffect, useState } from "react";

type AdminAPI = {
  graphql: (query: string) => Promise<Response>;
};

type ReviewData = {
  productId: string;
  productName: string;
  rating: number;
  count: number;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    body: string;
    createdAt: string;
  }>;
};

type LoaderData = {
  reviewsData: ReviewData[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  // First, query to get all product_reviews.reviews_* metafields
  const metafieldsResponse = await admin.graphql(`
    query {
      appInstallation {
        metafields(first: 100, namespace: "product_reviews") {
          edges {
            node {
              id
              key
              value
              type
            }
          }
        }
      }
    }
  `);

  const responseJson = await metafieldsResponse.json();
  const metafields =
    responseJson?.data?.appInstallation?.metafields?.edges || [];

  // Organize reviews by product
  const reviewsByProduct = new Map<string, ReviewData>();

  metafields.forEach((edge: any) => {
    const { key, value, type } = edge.node;

    // Process review data metafields
    if (key.startsWith("reviews_")) {
      const productId = key.replace("reviews_", "");

      if (!reviewsByProduct.has(productId)) {
        reviewsByProduct.set(productId, {
          productId,
          productName: "Unknown Product", // Will be updated from the reviews
          rating: 0,
          count: 0,
          reviews: [],
        });
      }

      try {
        const reviews = JSON.parse(value);
        reviewsByProduct.get(productId)!.reviews = reviews;

        // Extract product name from the first review
        if (reviews.length > 0 && reviews[0].productName) {
          reviewsByProduct.get(productId)!.productName = reviews[0].productName;
        }
      } catch (e) {
        console.error(`Error parsing reviews for product ${productId}:`, e);
      }
    }
    // Process rating metafields
    else if (key.startsWith("rating_")) {
      const productId = key.replace("rating_", "");

      if (!reviewsByProduct.has(productId)) {
        reviewsByProduct.set(productId, {
          productId,
          productName: "Unknown Product",
          rating: 0,
          count: 0,
          reviews: [],
        });
      }

      reviewsByProduct.get(productId)!.rating = parseFloat(value);
    }
    // Process count metafields
    else if (key.startsWith("count_")) {
      const productId = key.replace("count_", "");

      if (!reviewsByProduct.has(productId)) {
        reviewsByProduct.set(productId, {
          productId,
          productName: "Unknown Product",
          rating: 0,
          count: 0,
          reviews: [],
        });
      }

      reviewsByProduct.get(productId)!.count = parseInt(value);
    }
  });

  // Convert Map to array
  const reviewsData = Array.from(reviewsByProduct.values());

  return json({ reviewsData });
};

export default function AppReviews() {
  const { reviewsData } = useLoaderData<LoaderData>();
  const fetcher = useFetcher<LoaderData>();

  // Handle visibility change to refresh data when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetcher.load("/app/reviews");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetcher]);

  // Use fetcher data if available, otherwise use initial data
  const displayData = fetcher.data?.reviewsData || reviewsData;

  const handleViewDetails = (productId: string) => {
    // You can implement a modal or navigation to view detailed reviews
    console.log("View details for product ID:", productId);
  };

  const rows = displayData.map((item) => [
    <Text
      key={`product-${item.productId}`}
      variant="bodyMd"
      fontWeight="bold"
      as="span"
    >
      {item.productName}
    </Text>,
    <Text key={`rating-${item.productId}`}>{item.rating.toFixed(1)}★</Text>,
    item.count,
    <Button
      key={`action-${item.productId}`}
      size="slim"
      onClick={() => handleViewDetails(item.productId)}
    >
      View Details
    </Button>,
  ]);

  return (
    <Page title="Product Reviews">
      {rows.length === 0 ? (
        <Card>
          <Card.Section>
            <Text>
              No reviews found. Reviews submitted by customers will appear here.
            </Text>
          </Card.Section>
        </Card>
      ) : (
        <Card>
          <DataTable
            columnContentTypes={["text", "text", "numeric", "text"]}
            headings={["Product", "Rating", "Review Count", "Actions"]}
            rows={rows}
          />
        </Card>
      )}
    </Page>
  );
}
