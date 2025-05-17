import { json } from "@remix-run/node";
import { authenticate } from "app/shopify.server";
import { getReview } from "./getReview";

export async function updateReview(request: Request, params: any) {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const reviewId = params.reviewId;
  const productId = params.id;
  console.log("đã đến đây");

  const { reviewsData } = await getReview(productId, admin);
  console.log("reviewsData đây : ", reviewsData);
  const reviews = JSON.parse(reviewsData.value);
  console.log("reviews đây : ", reviews);
  const reviewIndex = reviews.findIndex(
    (review: any) => review.id === reviewId,
  );
  console.log("reviewIndex đây : ", reviewIndex);

  if (reviewIndex === -1) {
    return json({ error: "Không tìm thấy review" });
  }

  const updatedReviewData = {
    id: reviewId,
    rating: parseInt(formData.get("rating") as string),
    author: formData.get("author") as string,
    email: formData.get("email") as string,
    title: formData.get("title") as string,
    body: formData.get("body") as string,
    productId: reviews[reviewIndex].productId,
    productName: reviews[reviewIndex].productName,
    createdAt: reviews[reviewIndex].createdAt,
    updatedAt: new Date().toISOString(),
  };

  reviews[reviewIndex] = updatedReviewData;

  const totalRating = reviews.reduce(
    (sum: any, review: any) => sum + review.rating,
    0,
  );
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  const appInstallationRes = await admin.graphql(`
    query {
      appInstallation {
        id
      }
    }
  `);

  const appInstallationJson = await appInstallationRes.json();
  const appInstallationId = appInstallationJson?.data?.appInstallation?.id;

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

  return redirect(`/app/reviews/${productId}`);
}
