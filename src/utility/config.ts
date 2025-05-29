

const config = {
    JWT_SECRET: process.env.JWT_SECRET || "default_secret",
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN) || 10,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_secret",
    JWT_REFRESH_EXPIRES_IN: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 15,
    EMAIL_USER: process.env.EMAIL_USER || "your-email@gmail.com",
    EMAIL_PASS: process.env.EMAIL_PASS || "your-password",
    PASSWORD_RECOVERY_EXPIRATION: Number(process.env.PASSWORD_RECOVERY_EXPIRATION) || 10,
    EMAIL_CONFIRMATION_EXPIRATION: Number(process.env.EMAIL_CONFIRMATION_EXPIRATION) || 10,
    LIMIT_WINDOW_SECONDS: Number(process.env.LIMIT_WINDOW_SECONDS) || 12,
    MAX_REQUESTS: Number(process.env.MAX_REQUESTS) || 5,
};

export default config;