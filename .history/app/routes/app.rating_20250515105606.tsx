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
        src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
        alt="Star Rating Block"
      />
    </CalloutCard>
  );
}
