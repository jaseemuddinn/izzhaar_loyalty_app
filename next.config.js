module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-image-domain.com'], // Replace with your image domain if needed
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, // Add your database URL here
    LOYALTY_PROGRAM_SETTINGS: process.env.LOYALTY_PROGRAM_SETTINGS, // Add any other environment variables
  },
};