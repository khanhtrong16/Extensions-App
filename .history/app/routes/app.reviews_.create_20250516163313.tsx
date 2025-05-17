import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useActionData, useSubmit } from "@remix-run/react";
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
} from "@shopify/polaris";
import { useState } from "react";
import { authenticate } from "app/shopify.server";
import { useAppBridge } from "@shopify/app-bridge-react";
import { ResourcePicker } from "@shopify/app-bridge/actions";

export const action: ActionFunction = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  try {
    // Gửi dữ liệu tới endpoint app.proxy
    const proxyResponse = await fetch(
      "https://your-shop-domain.myshopify.com/apps/reviews",
      {
        method: "POST",
        body: formData,
      },
    );

    const result = await proxyResponse.json();

    if (result.success) {
      return redirect("/app/reviews");
    } else {
      return json({
        error: result.message || "Có lỗi xảy ra khi gửi đánh giá.",
      });
    }
  } catch (error) {
    return json({ error: error.message || "Có lỗi xảy ra." });
  }
};

export default function AppReviewsCreate() {
  const actionData = useActionData<{ error?: string }>();
  const submit = useSubmit();
  const app = useAppBridge();

  const [formValues, setFormValues] = useState({
    product_id: "",
    product_name: "",
    rating: "5",
    author: "",
    email: "",
    title: "",
    body: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<{
    title: string;
    id: string;
  } | null>(null);

  const handleChange = (field) => (value) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleProductSelect = () => {
    const resourcePicker = ResourcePicker.create(app, {
      resourceType: ResourcePicker.ResourceType.Product,
      options: {
        selectMultiple: false,
      },
    });

    resourcePicker.subscribe(ResourcePicker.Action.SELECT, ({ selection }) => {
      const product = selection[0];
      // Chuyển đổi gid://shopify/Product/123456789 thành 123456789
      const productId = product.id.replace("gid://shopify/Product/", "");

      setSelectedProduct({
        id: productId,
        title: product.title,
      });

      setFormValues({
        ...formValues,
        product_id: productId,
        product_name: product.title,
      });

      resourcePicker.unsubscribe();
    });

    resourcePicker.subscribe(ResourcePicker.Action.CANCEL, () => {
      resourcePicker.unsubscribe();
    });

    resourcePicker.dispatch(ResourcePicker.Action.OPEN);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
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

        <Form method="post" onSubmit={handleSubmit}>
          <FormLayout>
            <Card sectioned>
              <Button onClick={handleProductSelect} fullWidth>
                {selectedProduct
                  ? `Sản phẩm đã chọn: ${selectedProduct.title}`
                  : "Chọn sản phẩm"}
              </Button>
              {selectedProduct && (
                <div style={{ marginTop: "10px" }}>
                  <Text>Mã sản phẩm: {selectedProduct.id}</Text>
                </div>
              )}
            </Card>

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
              <Button submit primary disabled={!selectedProduct}>
                Gửi đánh giá
              </Button>
            </InlineStack>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
}
