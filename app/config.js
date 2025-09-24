// app/config.js

// Detecta se é ambiente de desenvolvimento (__DEV__ é true no Expo/React Native)
const isDev = __DEV__; 

// URLs base
const BASE_URL = isDev 
  ? 'http://192.168.0.100'      // IP local da sua máquina durante desenvolvimento
  : 'http://gzfinanceiropessoal.com.br';  // URL pública da API para APK/produção

export const DASHBOARD_API = `${BASE_URL}/api_dashboard.php`;
export const LOGIN_API = `${BASE_URL}/api_login.php`;
export const LANCAMENTO_API = `${BASE_URL}/api_lancamento.php`;
export const SELECTS_API = `${BASE_URL}/api_selects.php`;
