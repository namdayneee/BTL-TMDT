import * as sizingService from "../services/sizing.service.js";

export const recommendSize = async (req, res) => {
  try {
    const { height, weight, fitPreference, productId } = req.body;

    if (!height || !weight) {
      return res.status(400).json({ message: "height và weight là bắt buộc" });
    }

    const result = await sizingService.recommendSize(
      Number(height),
      Number(weight),
      fitPreference || null,
      productId || null
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSizingRule = async (req, res) => {
  try {
    const rule = await sizingService.createSizingRule(req.body);
    res.status(201).json(rule);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllSizingRules = async (req, res) => {
  try {
    const rules = await sizingService.getAllSizingRules();
    res.json(rules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
