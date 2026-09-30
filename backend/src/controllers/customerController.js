import { getAllCustomers } from "../repositories/customerRepository.js";

export async function getCustomers(req, res) {
  try {
    const customers = await getAllCustomers();

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers.",
    });
  }
}