import * as sizingService from "../services/sizing.service.js";

export const recommendSize = async (
  req,
  res
) => {
  try {
    const { height, weight } = req.body;

    const rule =
      await sizingService.recommendSize(
        height,
        weight
      );

    res.json(rule);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const createSizingRule = async (
  req,
  res
) => {
  try {
    const rule =
      await sizingService.createSizingRule(
        req.body
      );

    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};