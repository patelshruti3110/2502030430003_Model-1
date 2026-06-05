const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await parseResponse(response);

  if (response.status === 401) {
    window.dispatchEvent(new Event("auth-error"));
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.response = { status: response.status, data };
    throw error;
  }

  return { data, status: response.status };
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function jsonOptions(method, data) {
  return {
    method,
    body: JSON.stringify(data),
  };
}

export const userAPI = {
  signup: (data) => request("/users/signup", jsonOptions("POST", data)),
  login: (data) => request("/users/login", jsonOptions("POST", data)),
  profile: () => request("/users/profile"),
};

export const portfolioAPI = {
  create: (data) => request("/portfolio/create", jsonOptions("POST", data)),
  get: () => request("/portfolio/get"),
  getByUserId: (userId) => request(`/portfolio/user/${userId}`),
};

export const projectAPI = {
  create: (data) => request("/projects/add", jsonOptions("POST", data)),
  list: () => request("/projects/get"),
  get: (id) => request(`/projects/${id}`),
  update: (id, data) => request(`/projects/${id}`, jsonOptions("PUT", data)),
  delete: (id) => request(`/projects/${id}`, { method: "DELETE" }),
  listAll: () => request("/projects/all"),
  listByUserId: (userId) => request(`/projects/user/${userId}`),
};

export const resumeAPI = {
  create: (data) => request("/resumes", jsonOptions("POST", data)),
  list: () => request("/resumes"),
  get: (id) => request(`/resumes/${id}`),
  update: (id, data) => request(`/resumes/${id}`, jsonOptions("PUT", data)),
  delete: (id) => request(`/resumes/${id}`, { method: "DELETE" }),
};

export default request;
