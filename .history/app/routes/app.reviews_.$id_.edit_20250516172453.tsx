import { Card, Form, Page, TextField } from "@shopify/polaris";

export default function AppReviewsEdit() {
  return (
    <Page title="Edit Review">
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
