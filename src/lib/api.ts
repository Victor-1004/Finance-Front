import Cookies from "js-cookie";

interface RequestOptions extends RequestInit {
  data?: any;
}

export const api = async (endpoint: string, options: RequestOptions = {}) => {
  const token = Cookies.get("token");
  
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", token);
  }

  const config: RequestInit = {
    method: options.method || "GET",
    ...options,
    headers,
  };

  if (options.data) {
    config.body = JSON.stringify(options.data);
  }

  const response = await fetch(`/api${endpoint}`, config);
  if (response.status === 401) {
    Cookies.remove("token");
    window.location.href = "/login";
    throw new Error("Sessão expirada");
  }
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Erro ${response.status}`);
  }
  let data:any = {};
  if(response.status !== 204) {
   data = await response.json();
  }
  data["status"] = response.status;
  return data;
};
