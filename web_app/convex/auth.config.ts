export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://devoted-hen-6833.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};
