import { ActionFunction } from "@remix-run/node";
import { createReview } from "app/utlis/createReview";

/**
 * Action function xử lý POST request để thêm đánh giá
 */
export const action: ActionFunction = async ({ request }) => {
  const result = await createReview(request);
  return result;
};
