module.exports = {
  reactStrictMode: true,
  images: {
    domains: [''], 
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL, 
    LOYALTY_PROGRAM_SETTINGS: process.env.LOYALTY_PROGRAM_SETTINGS, 
  },
};