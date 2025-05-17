import { ActionFunction, json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";

/**
 * Action function xử lý POST request để thêm đánh giá
 */
export const action: ActionFunction = async ({ request }) => {
  try {
    const { admin } = await authenticate.public.appProxy(request);

    if (!admin) {
      throw new Error("Không thể xác thực với Shopify Admin API");
    }
    const formData = await request.formData();
    const rating = parseInt(formData.get("rating") as string);
    const author = formData.get("author") as string;
    const email = formData.get("email") as string;
    const title = formData.get("title") as string;
    const body = formData.get("body") as string;
    const productId = formData.get("product_id") as string;
    const productName =
      (formData.get("product_name") as string) || "Unknown Product";
    console.log("productId", productId);

    // Lấy thông tin app metafields hiện tại
    const existingMetafieldRes = await admin.graphql(`
    query {
      appInstallation {
        metafields(first: 3, keys: [
          "product_reviews.reviews_${productId}",
          "product_reviews.rating_${productId}",
          "product_reviews.count_${productId}"
        ]) {
          edges {
            node {
              id
              key
              value
            }
          }
        }
      }
    }
    `);

    const responseJson = await existingMetafieldRes.json();
    const metafieldNodes =
      responseJson?.data?.appInstallation?.metafields?.edges || [];
    console.log("metafieldNodes", responseJson);
    return null;
    // Tìm và xử lý metafields hiện tại
    let existingReviews = [];

    // Tìm review metafield
    const reviewsNode = metafieldNodes.find(
      (edge: any) => edge.node.key === `reviews_${productId}`,
    );
    if (reviewsNode) {
      try {
        existingReviews = JSON.parse(reviewsNode.node.value);
      } catch (e) {
        console.error("Lỗi khi parse dữ liệu reviews:", e);
      }
    }

    // Thêm review mới vào mảng
    const newReview = {
      id: Date.now().toString(),
      rating,
      author,
      email,
      title,
      body,
      productName,
      productId, // Lưu thêm productId để dễ dàng query
      createdAt: new Date().toISOString(),
    };

    // Thêm review mới vào đầu danh sách để hiển thị mới nhất trước
    const updatedReviews = [newReview, ...existingReviews];

    // Giới hạn số lượng reviews để tránh vượt quá kích thước tối đa của metafield
    const limitedReviews = updatedReviews.slice(0, 50);

    // Tính toán rating trung bình từ tất cả các đánh giá
    const totalRating = limitedReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      limitedReviews.length > 0 ? totalRating / limitedReviews.length : 0;

    // Chuẩn bị metafields để cập nhật
    const metafieldsToSet = [
      {
        namespace: "product_reviews",
        key: `reviews_${productId}`,
        value: JSON.stringify(limitedReviews),
        type: "json",
      },
      {
        namespace: "product_reviews",
        key: `rating_${productId}`,
        value: averageRating.toFixed(1),
        type: "number_decimal",
      },
      {
        namespace: "product_reviews",
        key: `count_${productId}`,
        value: limitedReviews.length.toString(),
        type: "number_integer",
      },
    ];

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

    if (!appInstallationId) {
      throw new Error("Không thể lấy App Installation ID");
    }

    // Thực hiện mutation để cập nhật app metafields
    const response = await admin.graphql(
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
          metafields: metafieldsToSet.map((field) => ({
            ...field,
            ownerId: appInstallationId, // Sử dụng ID của app installation
          })),
        },
      },
    );

    const mutationResponse = await response.json();
    console.log(
      "mutationResponse",
      mutationResponse.data.metafieldsSet.metafields,
    );

    if (mutationResponse.data.metafieldsSet.userErrors.length > 0) {
      console.error(
        "Lỗi GraphQL:",
        mutationResponse.data.metafieldsSet.userErrors,
      );
      return json(
        {
          success: false,
          message: "Có lỗi xảy ra khi lưu đánh giá.",
          errors: mutationResponse.data.metafieldsSet.userErrors,
        },
        { status: 500 },
      );
    }

    return json({
      success: true,
      message: "Đánh giá đã được gửi thành công",
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewCount: limitedReviews.length,
    });
  } catch (error) {
    console.error("Lỗi truy vấn DB:", error);
    return json(
      {
        success: false,
        message: "Có lỗi xảy ra khi lưu đánh giá.",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
};
