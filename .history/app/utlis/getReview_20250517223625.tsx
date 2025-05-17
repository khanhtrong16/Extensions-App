import { authenticate } from "app/shopify.server";

export async function getReview(params: any, request: Request, id: string) {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query AppInstallationMetafields($ownerId: ID!, $key: String!) {
    appInstallation(id: $ownerId) {
    metafield(namespace: "product_reviews", key: $key) {
      id
      namespace
      key
      value
    }
  }
}`,
    {
      variables: {
        key: `reviews_${id}`,
        ownerId: "gid://shopify/AppInstallation/557070614580",
      },
    },
  );
  const data = await response.json();
  const reviewsData = data.data.appInstallation.metafield;
  return { reviewsData, id };
}
