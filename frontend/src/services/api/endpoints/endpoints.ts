import { API_CONFIG } from '../../../constants/config/apiConfig';

const BASE_URL = API_CONFIG.BASE_URL;

export const loginEndpoint = () => `${BASE_URL}/auth/login`;
export const signinEndpoint = () => `${BASE_URL}/auth/signin`;
export const refreshTokenEndpoint = () => `${BASE_URL}/auth/refresh`;
export const logoutEndpoint = () => `${BASE_URL}/auth/logout`;

export const sendMoneyEndpoint = () => `${BASE_URL}/transfer/send-money`;

export const createThreadEndpoint = () => `${BASE_URL}/thread/create`;
export const getInboxEndpoint = () => `${BASE_URL}/thread/inbox`;

export const endpoints = {
  auth: {
    login: loginEndpoint,
    signin: signinEndpoint,
    refresh: refreshTokenEndpoint,
    logout: logoutEndpoint,
  },
  transfer: {
    sendMoney: sendMoneyEndpoint,
  },
  thread: {
    create: createThreadEndpoint,
    inbox: getInboxEndpoint,
  },
};

export default endpoints;
