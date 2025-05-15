import { useNavigate } from "@remix-run/react";
import { BlockStack, CalloutCard } from "@shopify/polaris";

export default function AppRating() {
  const navigate = useNavigate();
  return (
    <div style={{ width: "30%", height: "100%", margin: "auto" }}>
      <CalloutCard
        title="Add block Star Rating to your product detail page"
        primaryAction={{
          content: "Add block Star Rating",
          url: "https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=newAppsSection",
        }}
      >
        <img
          src="https://cdn.pixabay.com/photo/2022/01/25/14/54/stars-6966346_1280.png"
          alt="Star Rating Block"
          width={100}
        />
        <button
          onClick={() => {
            navigate(
              "/https://demo-shop-windy.myshopify.com/admin/themes/current/editor?template=product&addAppBlockId=1094180700161/theme&target=newAppsSection",
            );
          }}
        >
          <p>Add block Star Rating</p>
        </button>
      </CalloutCard>
    </div>
  );
}
