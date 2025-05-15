import { CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  return (
    <CalloutCard
      title="Add block Star Rating to your product detail page"
      primaryAction={{
        content: "Add block Star Rating",
        url: "#",
      }}
    ></CalloutCard>
  );
}
