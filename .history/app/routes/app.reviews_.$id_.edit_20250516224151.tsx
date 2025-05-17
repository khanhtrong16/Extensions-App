import {
  Banner,
  Box,
  FormLayout,
  Card,
  Form,
  Page,
  TextField,
  Text,
  Select,
  InlineStack,
  Button,
} from "@shopify/polaris";

export default function AppReviewsEdit() {
  return (
    <Page
      title="Thêm đánh giá mới"
      backAction={{ content: "Quay lại", url: "/app/reviews" }}
    >
      <Card>
        {actionData?.error && (
          <Banner status="critical">
            <p>{actionData.error}</p>
          </Banner>
        )}

        <Box paddingBlockEnd="400">
          <Text variant="headingMd" as="h2">
            Mã sản phẩm: {id}
          </Text>
        </Box>

        <Form method="post" onSubmit={handleSubmit}>
          <FormLayout>
            <TextField
              label="Tên người đánh giá"
              autoComplete="off"
              value={formValues.author}
              onChange={handleChange("author")}
              required
            />

            <TextField
              label="Email"
              type="email"
              autoComplete="off"
              value={formValues.email}
              onChange={handleChange("email")}
              required
            />
            <Select
              label="Đánh giá"
              options={[
                { label: "5 sao", value: "5" },
                { label: "4 sao", value: "4" },
                { label: "3 sao", value: "3" },
                { label: "2 sao", value: "2" },
                { label: "1 sao", value: "1" },
              ]}
              value={formValues.rating}
              onChange={handleChange("rating")}
            />
            <TextField
              label="Tiêu đề đánh giá"
              autoComplete="off"
              value={formValues.title}
              onChange={handleChange("title")}
              required
            />

            <TextField
              label="Nội dung đánh giá"
              multiline={4}
              autoComplete="off"
              value={formValues.body}
              onChange={handleChange("body")}
              required
            />

            <InlineStack align="end">
              <Button submit primary>
                Gửi đánh giá
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
