import Constants from 'expo-constants';

const PORT = 3000;

function getWsUrl() {
  if (process.env.EXPO_PUBLIC_WS_URL) return process.env.EXPO_PUBLIC_WS_URL;

  const host = Constants.expoConfig?.hostUri?.split(':')[0] ?? 'localhost';
  return `ws://${host}:${PORT}`;
}

export const WS_URL = getWsUrl();