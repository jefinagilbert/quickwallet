import { ERROR_MESSAGES } from "../../constants/index.js";
import transferService from "../../services/transfer/transferService.js";

const transferController = async (req, res) => {
  const { senderId, receiverId, description, amount_in_cents } = req.body;
  try {
    const result = await transferService(
      senderId,
      receiverId,
      description,
      amount_in_cents,
    );
    res.status(result.code).json(result);
  } catch (e) {
    res.status(e.code || 500).json({
      code: e.code || 500,
      error: e.message || ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

export default transferController;
