/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import { apiInstance } from "./apiInstance";


// Generic GET
export const getFetch = async <T = any>(
  url: string
): Promise<AxiosResponse<T>> => {
  return await apiInstance.get<T>(url);
};


// Generic POST
export const postFetch = async <T = any, D = any>(
  url: string,
  body: D
): Promise<AxiosResponse<T>> => {
  return await apiInstance.post<T>(url, body);
};


// Generic DELETE
export const deleteFetch = async <T = any>(
  url: string
): Promise<AxiosResponse<T>> => {
  return await apiInstance.delete<T>(url);
};

// Generic PUT
export const putFetch = async <T = any, D = any>(
  url: string,
  body: D
): Promise<AxiosResponse<T>> => {
  return await apiInstance.put<T>(url, body);
};

// Generic PATCH
export const patchFetch = async <T = any, D = any>(
  url: string,
  body: D
): Promise<AxiosResponse<T>> => {
  return await apiInstance.patch<T>(url, body);
};