import { CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  return (
    <CalloutCard
      primaryAction={{
        content: "Add block Star Rating",
        url: "#",
      }}
    >
      <p>Add block Star Rating to your product detail page</p>
    </CalloutCard>
  );
}
