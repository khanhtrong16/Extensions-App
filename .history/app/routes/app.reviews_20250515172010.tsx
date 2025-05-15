import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button, Text, Box } from "@shopify/polaris";

async function fetchDisabledStatus(): Promise<boolean> {
  const res = await fetch("/app/disabled-status");
  const data = await res.json();
  return data.disabled;
}

export default function AppReviews() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=mainSection";

  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  // Dữ liệu mẫu cho danh sách đánh giá
  const reviewsData = [
    {
      id: "1",
      product: "Product 1",
      rating: "4.5",
      count: 100,
    },
    {
      id: "2",
      product: "Product 2",
      rating: "3.8",
      count: 75,
    },
    {
      id: "3",
      product: "Product 3",
      rating: "5.0",
      count: 42,
    },
    {
      id: "4",
      product: "Product 4",
      rating: "4.2",
      count: 21,
    },
  ];

  const handleViewDetails = (id: string) => {
    console.log("View details for product ID:", id);
    // Thêm logic để xem chi tiết sau này
  };

  // Định dạng dữ liệu cho DataTable
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
