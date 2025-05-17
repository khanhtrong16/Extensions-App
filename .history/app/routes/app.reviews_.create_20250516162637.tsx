import { Card, Page } from "@shopify/polaris";

export default function AppReviewsCreate() {
  return (
    <Page title="Create Review">
      <Card>
        <Form>
          <TextField label="Author" />
          <TextField label="Rating" />
          <TextField label="Title" />
          <TextField label="Description" />
        </Form>
      </Card>
    </Page>
  );
}
