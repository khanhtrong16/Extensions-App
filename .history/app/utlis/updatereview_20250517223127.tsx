import { json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { getReview } from "./getReview";

export async function updateReview(request: Request, params: any) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  // Lấy ID của review cần update
  const reviewId = params.reviewId;
  const productId = params.id;

  // Lấy dữ liệu reviews hiện tại
  const { reviewsData } = await getReview(params, request);
  const metafieldNode = reviewsData.metafield;

  if (!metafieldNode) {
    return json({ error: "Không tìm thấy reviews cho sản phẩm này" });
  }

  // Parse reviews hiện tại
  const reviews = JSON.parse(metafieldNode.value);

  // Tìm review cần update
  const reviewIndex = reviews.findIndex((review) => review.id === reviewId);

  if (reviewIndex === -1) {
    return json({ error: "Không tìm thấy review" });
  }

  // Lấy dữ liệu mới từ form
  const updatedReviewData = {
    id: reviewId, // giữ nguyên ID
    rating: parseInt(formData.get("rating") as string),
    author: formData.get("author") as string,
    email: formData.get("email") as string,
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    productId: reviews[reviewIndex].productId, // giữ nguyên productId
    productName: reviews[reviewIndex].productName, // giữ nguyên productName
    createdAt: reviews[reviewIndex].createdAt, // giữ nguyên thời gian tạo
    updatedAt: new Date().toISOString(), // thêm thời gian cập nhật
  };

  // Cập nhật review trong mảng
  reviews[reviewIndex] = updatedReviewData;

  // Tính lại rating trung bình
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  // Lấy appInstallation ID
  const appInstallationRes = await admin.graphql(`
    query {
      appInstallation {
        id
      }
    }
  `);

  const appInstallationJson = await appInstallationRes.json();
  const appInstallationId = appInstallationJson?.data?.appInstallation?.id;

  // Chuẩn bị metafields để cập nhật
  const metafieldsToSet = [
    {
      namespace: "product_reviews",
      key: `reviews_${productId}`,
      value: JSON.stringify(reviews),
      type: "json",
      ownerId: appInstallationId,
    },
    {
      namespace: "product_reviews",
      key: `rating_${productId}`,
      value: averageRating.toFixed(1),
      type: "number_decimal",
      ownerId: appInstallationId,
    },
  ];

  // Cập nhật metafields
  const updateResponse = await admin.graphql(
    `#graphql
      mutation CreateAppMetafields($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { 
            namespace 
            key 
            value 
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    {
      variables: {
        metafields: metafieldsToSet,
      },
    },
  );

  const result = await updateResponse.json();

  if (result.data.metafieldsSet.userErrors.length > 0) {
    return json({
      success: false,
      error: result.data.metafieldsSet.userErrors[0].message,
    });
  }

  return json({
    success: true,
    message: "Cập nhật đánh giá thành công",
  });
}
