const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || "Request failed";
    throw new Error(message);
  }

  return data;
}

export async function publicApi(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  return parseResponse(response);
}

export async function adminPublicApi(path, accessCode, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessCode ? { "x-admin-access-code": accessCode } : {}),
      ...(options.headers || {})
    }
  });

  return parseResponse(response);
}

export async function authApi(path, token, accessCode, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(accessCode ? { "x-admin-access-code": accessCode } : {}),
      ...(options.headers || {})
    }
  });

  return parseResponse(response);
}

export { API_BASE_URL };
