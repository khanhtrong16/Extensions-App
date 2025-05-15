import { Card, Button, Image, Text, Box } from "@shopify/polaris";

export default function AppRating() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=newAppsSection";

  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "40px auto" }}>
      <Card>
        <Card.Section>
          <Text variant="headingLg" as="h2">
            Add block Star Rating to your product detail page
          </Text>
        </Card.Section>

        <Card.Section>
          <Box paddingBlockEnd="400">
            <div style={{ textAlign: "center" }}>
              <Image
                source="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
                alt="Star Rating Block"
                width={200}
              />
            </div>
          </Box>
        </Card.Section>

        <Card.Section>
          <div style={{ textAlign: "center" }}>
            <Button primary size="large" onClick={handleAddBlock}>
              Add block Star Rating
            </Button>
          </div>
        </Card.Section>
      </Card>
    </div>
  );
}
