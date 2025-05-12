import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Middleware } from "@reduxjs/toolkit";

// Define action types
export const API_REQUEST = "API_REQUEST";
export const API_SUCCESS = "API_SUCCESS";
export const API_FAILURE = "API_FAILURE";

// Define interfaces for API actions
export interface ApiRequestAction {
  type: typeof API_REQUEST;
  payload: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: any;
    params?: any;
    onSuccess?: string | ((response: any) => void);
    onFailure?: string | ((error: any) => void);
    headers?: Record<string, string>;
  };
}

// API Middleware
export const apiMiddleware: Middleware =
  (store) => (next) => async (action: any) => {
    // If not an API request action, pass to next middleware
    if (action.type !== API_REQUEST) {
      return next(action);
    }

    const { url, method, data, params, onSuccess, onFailure, headers } =
      action.payload;

    try {
      // Prepare axios config
      const config: AxiosRequestConfig = {
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          // Add any default headers here, e.g., authorization
          "Content-Type": "application/json",
        },
      };

      // Make the API call
      const response: AxiosResponse = await axios(config);

      // Handle success
      if (onSuccess) {
        if (typeof onSuccess === "string") {
          // If success is a string action type
          store.dispatch({
            type: onSuccess,
            payload: response.data,
          });
        } else {
          // If success is a callback function
          onSuccess(response.data);
        }
      }

      // Dispatch success action
      store.dispatch({
        type: API_SUCCESS,
        payload: response.data,
      });

      return response.data;
    } catch (error: any) {
      // Handle error
      if (onFailure) {
        if (typeof onFailure === "string") {
          // If failure is a string action type
          store.dispatch({
            type: onFailure,
            payload: error.response?.data || error.message,
          });
        } else {
          // If failure is a callback function
          onFailure(error);
        }
      }

      // Dispatch failure action
      store.dispatch({
        type: API_FAILURE,
        payload: error.response?.data || error.message,
      });

      throw error;
    }
  };

// Helper function to create API request actions
export const apiRequest = (
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  options: Omit<ApiRequestAction["payload"], "url" | "method"> = {}
): ApiRequestAction => ({
  type: API_REQUEST,
  payload: { url, method, ...options },
});
