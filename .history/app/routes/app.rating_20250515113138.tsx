import { BlockStack, CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  return (
    <div style={{ width: "30%", height: "100%", margin: "auto" }}>
      <CalloutCard
        title="Add block Star Rating to your product detail page"
        primaryAction={{
          content: "Add block Star Rating",
          url: "#",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
          alt="Star Rating Block"
          width={100}
        />
        https://coolstore.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=newAppsSection
      </CalloutCard>
    </div>
  );
}
