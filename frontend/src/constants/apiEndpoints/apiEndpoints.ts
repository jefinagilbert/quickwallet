import { API_CONFIG } from '../config/apiConfig';

const BASE_URL = API_CONFIG.BASE_URL;

export const loginEndpoint = () => `${BASE_URL}/auth/login`;
export const signinEndpoint = () => `${BASE_URL}/auth/signin`;
export const refreshTokenEndpoint = () => `${BASE_URL}/auth/refresh`;
export const logoutEndpoint = (): string => `${BASE_URL}/auth/logout`;

export const sendMoneyEndpoint = () => `${BASE_URL}/transfer/send-money`;

export const createThreadEndpoint = () => `${BASE_URL}/thread/create`;
export const getInboxEndpoint = () => `${BASE_URL}/thread/inbox`;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: loginEndpoint(),
    SIGNIN: signinEndpoint(),
    REFRESH: refreshTokenEndpoint(),
    LOGOUT: logoutEndpoint(),
  },
  TRANSFER: {
    SEND_MONEY: sendMoneyEndpoint(),
  },
  THREAD: {
    CREATE: createThreadEndpoint(),
    INBOX: getInboxEndpoint(),
  },
} as const;

export type ApiEndpoints = typeof API_ENDPOINTS;
