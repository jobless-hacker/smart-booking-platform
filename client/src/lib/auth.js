const TOKEN_KEY = "admin_token";
const ACCESS_CODE_KEY = "admin_access_code";

export function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getAccessCode() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ACCESS_CODE_KEY) || "";
}

export function setAccessCode(accessCode) {
  localStorage.setItem(ACCESS_CODE_KEY, accessCode);
}

export function clearAccessCode() {
  localStorage.removeItem(ACCESS_CODE_KEY);
}
