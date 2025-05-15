import { CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  return (
    <CalloutCard
      title="Add block Star Rating to your product detail page"
      primaryAction={{
        content: "Add block Star Rating",
        url: "#",
      }}
    >
      <img
        src="https://cdn.shopify.com/s/files/1/0556/7385/0321/files/star-rating-block.png?v=1715796000"
        alt="Star Rating Block"
      />
    </CalloutCard>
  );
}
