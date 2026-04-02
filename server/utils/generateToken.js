// import jwt from "jsonwebtoken";

// export function generateToken(userId) {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "7d"
//   });
// }


import jwt from "jsonwebtoken";

export function generateToken(userId) {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  return jwt.sign({ userId }, secret, {
    expiresIn: "7d"
  });
}
// export function generateToken(userId) {
//   const secret = process.env.JWT_SECRET;

//   if (!secret) {
//     throw new Error("JWT_SECRET is not defined in environment variables.");
//   }

//   return jwt.sign({ userId }, secret, {
//     expiresIn: "7d"
//   });
// }
