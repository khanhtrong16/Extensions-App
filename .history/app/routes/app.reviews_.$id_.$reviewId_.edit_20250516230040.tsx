import { LoaderFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { useActionData } from "@remix-run/react";
import { useParams } from "@remix-run/react";
import {
  FormLayout,
  Card,
  Form,
  Page,
  TextField,
  Select,
  InlineStack,
  Button,
} from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import { getReview } from "app/utlis/getReview";
import { useState } from "react";

export const loader: LoaderFunction = async ({ request, params }) => {
  const { reviewsData, id } = await getReview(params, request);
  console.log("reviewsData đây : ", reviewsData);
  return { reviewsData, id };
};
export default function AppReviewsEdit() {
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
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    submit(formData, { method: "post" });
  };
  return (
    <Page
      title="Chỉnh sửa đánh giá"
      backAction={{ content: "Quay lại", url: "/app/reviews" }}
    >
      <Card>
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
