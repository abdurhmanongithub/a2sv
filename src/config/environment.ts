import * as dotenv from 'dotenv';
dotenv.config(); // Load .env file

// Define and export your configuration
export const environment = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'defaultsecret',
    // Add other configuration settings as needed
};