import bcrypt from "bcryptjs";

const password = "Adminsupport@@";

const hash = await bcrypt.hash(password, 10);

console.log(hash);