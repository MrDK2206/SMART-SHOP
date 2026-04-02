export const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@cartify.com",
    password: "Admin123!",
    isAdmin: true,
    mobileNumber: "9999999999",
    billingAddress: "Admin Office, Main Road",
    pincode: "380001",
    panNumber: "ABCDE1234F",
    gstNumber: "24ABCDE1234F1Z5",
    privacyPolicyAcceptedAt: new Date().toISOString()
  },
  {
    name: "Demo Shopper",
    email: "shopper@cartify.com",
    password: "Shop123!",
    isAdmin: false,
    mobileNumber: "8888888888",
    billingAddress: "Demo Customer Street",
    pincode: "380015",
    panNumber: "PQRSX1234L",
    gstNumber: "",
    privacyPolicyAcceptedAt: new Date().toISOString()
  }
];
