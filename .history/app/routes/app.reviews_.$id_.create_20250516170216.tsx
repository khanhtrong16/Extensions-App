import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSubmit, useParams } from "@remix-run/react";
import {
  Card,
  Page,
  TextField,
  Select,
  Button,
  FormLayout,
  Banner,
  InlineStack,
  Text,
  Box,
} from "@shopify/polaris";
import { useState } from "react";
import { createReview } from "app/utlis/createReview";

// Action để xử lý form submit
export const action: ActionFunction = async ({ request, params }) => {
  const result = await createReview(request);
  console.log("result đây : ", result);
  const resultJson = await result.json();

  if (resultJson.success) {
    return redirect("/app/reviews");
  } else {
    return json({
      error: resultJson.message || "Có lỗi xảy ra khi gửi đánh giá.",
    });
  }
};

export default function AppReviewsCreate() {
  const { id } = useParams();
  const actionData = useActionData<{ error?: string }>();
  const submit = useSubmit();

  const [formValues, setFormValues] = useState({
    rating: "5",
    author: "",
    email: "",
    title: "",
    body: "",
  });

  const handleChange = (field) => (value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("product_id", id as string);
    // Không cần thêm product_id vào đây vì sẽ được thêm trong action
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    submit(formData, { method: "post" });
  };

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
