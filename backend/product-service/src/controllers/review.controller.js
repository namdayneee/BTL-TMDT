import * as reviewService from "../services/review.service.js";

function sendError(res, error, fallbackStatus = 500) {
  const message = error.message || "Lỗi máy chủ";
  const status =
    message.includes("đã được đánh giá") ||
    message.includes("Không tìm thấy")
      ? 400
      : fallbackStatus;
  res.status(status).json({ message });
}

export const createReview = async (req, res) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(review);
  } catch (error) {
    sendError(res, error);
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(
      req.user.id,
      req.params.id,
      req.body
    );
    res.json(review);
  } catch (error) {
    sendError(res, error);
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getProductReviews(
      req.params.productId
    );
    res.json(reviews);
  } catch (error) {
    sendError(res, error);
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getMyReviews(req.user.id);
    res.json(reviews);
  } catch (error) {
    sendError(res, error);
  }
};

export const getReviewByOrder = async (req, res) => {
  try {
    const review = await reviewService.getReviewByOrder(
      req.user.id,
      req.params.orderId
    );
    if (!review) {
      return res.status(404).json({ message: "Chưa có đánh giá cho đơn này" });
    }
    res.json(review);
  } catch (error) {
    sendError(res, error);
  }
};
