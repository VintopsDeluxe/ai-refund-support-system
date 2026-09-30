import { getOrderById } from "../repositories/orderRepository.js";

export async function getOrder(req, res) {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(404).json({
      success: false,
      message: "Order not found.",
    });
  }
}