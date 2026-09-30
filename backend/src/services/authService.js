import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { getAdminByEmail } from "../repositories/adminRepository.js";

export async function loginAdmin({ email, password }) {
  const admin = await getAdminByEmail(email);

  if (!admin) {
    throw new Error("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.password_hash
  );
console.log("Password matches:", passwordMatches);
  if (!passwordMatches) {
    throw new Error("Invalid email or password");
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