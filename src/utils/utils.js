import { toast } from "react-toastify";

export async function makeApiRequest(
  url,
  { method = "GET", data = null, token = null, apiKey = null } = {}
) {
  try {
    let newOptions = { method };
    const headers = {};

    if (token) headers["x-access-token"] = token;
    if (apiKey) headers["x-api-key"] = apiKey;

    if (data instanceof FormData) {
      newOptions.body = data;
    } else if (data) {
      headers["Content-Type"] = "application/json";
      newOptions.body = JSON.stringify(data);
    }

    newOptions.headers = headers;

    // Check if it's a full URL
    const fullUrl = url.startsWith("http") ? url : process.env.REACT_APP_BASE_URL + url;

    const response = await fetch(fullUrl, newOptions);
    const processedData = await response.json();

    if (response.ok) {
      return processedData;
    } else {
      if (response.status === 401) {
        removeUserSession();
        window.location.href = "/";
      }
      throw new Error(processedData.message || "Request failed");
    }
  } catch (error) {
    throw error;
  }
}


export const removeUserSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

// Notification message
export const notify = (message, type = "success") => {
  const option = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  };
  if (type === "success") {
    toast.success(message, option);
  } else if (type === "warn") {
    toast.warn(message, option);
  } else if (type === "error") {
    toast.error(message, option);
  }
};

// utils/utils.js

export const retryRequest = async (apiFn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await apiFn();
    } catch (error) {
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
};
