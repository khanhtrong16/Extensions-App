import { AccountConnection } from "@shopify/polaris";

export default function AppRating() {
  return (
    <AccountConnection
      accountName={accountName}
      connected={connected}
      title="Example App"
      action={{
        content: buttonText,
        onAction: handleAction,
      }}
      details={details}
      termsOfService={terms}
    />
  );
}
