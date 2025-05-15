import { Card, Button, Text } from "@shopify/polaris";

export default function AppRating() {
  const url =
    "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=newAppsSection";
  const handleAddBlock = () => {
    window.open(url, "_blank");
  };

  return (
    <div style={{ maxWidth: "550px", margin: "40px auto" }}>
      <Card>
        <div style={{ padding: "20px" }}>
          <Text as="h4" variant="headingLg">
            Add block Star Rating to your product detail page
          </Text>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <img
              src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
              alt="Star Rating Block"
              width={200}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button onClick={handleAddBlock}>Add block Star Rating</Button>
          </div>
        </div>
      </Card>
      <Card>
        <div style={{ padding: "20px" }}>
          <Text as="h4" variant="headingLg">
            Add block Star Rating to your product detail page
          </Text>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <img
              src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
              alt="Star Rating Block"
              width={200}
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "20px" }}>
            <Button onClick={handleAddBlock}>Add block Star Rating</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
