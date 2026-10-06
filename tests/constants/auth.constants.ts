import dotenv from 'dotenv';
dotenv.config();

export const CREDENTIALS = {
  VALID_USER: {
    username: process.env.VALID_USERNAME || '',
    password: process.env.VALID_PASSWORD || '',
  },
  INVALID_USER: {
    username: process.env.INVALID_USERNAME || '',
    password: process.env.INVALID_PASSWORD || '',
  },
  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
  },
  ESS_CREDENTIALS: {
    ESS_USERNAME: process.env.ESS_USERNAME || '',
    ESS_PASSWORD: process.env.ESS_PASSWORD || '',
  },
} as const;

export const AUTH_MESSAGES = {
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    REQUIRED: 'Required',
  },
} as const;

// Type definitions derived from the constants for type safety in test scripts
export type Credentials = typeof CREDENTIALS;
export type AuthMessages = typeof AUTH_MESSAGES;
