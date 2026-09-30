import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getAdminByEmail } from "../repositories/adminRepository.js";

export async function loginAdmin({ email, password }) {
  const admin = await getAdminByEmail(email);

  if (!admin) {
    const error = new Error("Invalid email or password");
    error.code = "ADMIN_NOT_FOUND";
    throw error;
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.password_hash
  );

  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.code = "PASSWORD_MISMATCH";
    throw error;
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
      name: admin.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "8h",
    }
  );

  return {
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
    },
    token,
  };
}