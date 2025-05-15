import { CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  return (
    <CalloutCard
      title="Customize the style of your checkout"
      primaryAction={{
        content: "Customize checkout",
        url: "#",
      }}
    >
      <p>Add block Star Rating to your product detail page</p>
    </CalloutCard>
  );
}
