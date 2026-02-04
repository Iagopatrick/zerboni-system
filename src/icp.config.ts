import axios, { AxiosError } from "axios";
import { ipcMain } from "electron";
import { SupplierType } from "./types/supplier";
import { ProductType } from "./types/product";
import fs from "fs";
import path from "path";

interface PaginationParams {
  search?: string;
  page?: number;
  limit?: number;
}
interface PaginatedResponse<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function handleAxiosError(error: unknown) {
  const err = error as AxiosError<any>;

  return {
    success: false,
    error: {
      status: err.response?.status ?? 500,
      message:
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Erro desconhecido",
    },
  };
}



const API_URL = "http://127.0.0.1:3333/api";

ipcMain.handle("get-users", async (_, params: PaginationParams) => {
  try {

    const res = await axios.get(`${API_URL}/users`, { params });
    return res.data as PaginatedResponse<UserType>;
  } catch (error) {
    return handleAxiosError(error);
  }
});

ipcMain.handle("create-users", async (_, data) => {
  try {
    const res = await axios.post(`${API_URL}/users`, data);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
});

ipcMain.handle("update-users", async (_, { id, data }) => {
  try {
    const res = await axios.put(`${API_URL}/users/${id}`, data);
    return res.data;
  } catch (error) {
    return handleAxiosError(error);
  }
});

ipcMain.handle("delete-users", async (_, id) => {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
    return true;
  } catch (error) {
    return handleAxiosError(error);
  }
});

type CreateCustomerPayload = Omit<CustomerType, "id" | "created_at">;
type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

ipcMain.handle(
  "get-customers",
  async (_event, params?: PaginationParams) => {
    try {
      const res = await axios.get(`${API_URL}/customers`, { params });
      return res.data as PaginatedResponse<CustomerType>;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "create-customers",
  async (_event, data: CreateCustomerPayload) => {
    try {
      const res = await axios.post(`${API_URL}/customers`, data);
      return res.data as CustomerType;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "update-customers",
  async (_event, { id, data }: { id: number; data: UpdateCustomerPayload }) => {
    try {
      const res = await axios.put(`${API_URL}/customers/${id}`, data);
      return res.data as CustomerType;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "delete-customers",
  async (_event, id: number) => {
    try {
      await axios.delete(`${API_URL}/customers/${id}`);
      return true;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

type CreateSupplierPayload = Omit<SupplierType, "id" | "created_at">;
type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

ipcMain.handle(
  "get-suppliers",
  async (_event, params?: PaginationParams) => {
    try {
      const res = await axios.get(`${API_URL}/suppliers`, { params });
      return res.data as PaginatedResponse<SupplierType>;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "create-suppliers",
  async (_event, data: CreateSupplierPayload) => {
    try {
      const res = await axios.post(`${API_URL}/suppliers`, data);
      return res.data as SupplierType;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "update-suppliers",
  async (
    _event,
    { id, data }: { id: number; data: UpdateSupplierPayload }
  ) => {
    try {
      const res = await axios.put(`${API_URL}/suppliers/${id}`, data);
      return res.data as SupplierType;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "delete-suppliers",
  async (_event, id: number) => {
    try {
      await axios.delete(`${API_URL}/suppliers/${id}`);
      return true;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

ipcMain.handle(
  "get-dashboard-data",
    async (_event) => {
    try {
      const res = await axios.get(`${API_URL}/dashboard`);
      return res.data;
    } catch (error) {
      return handleAxiosError(error);
    }
  }
);

type CreateProductPayload = Omit<ProductType, "id" | "created_at">;
type UpdateProductPayload = Partial<CreateProductPayload>;

ipcMain.handle(
  "get-products",
  async (_event, params?: PaginationParams) => {
    const res = await axios.get(`${API_URL}/products`, { params });
    return res.data as PaginatedResponse<ProductType>;
  }
);

ipcMain.handle(
  "create-products",
  async (_event, data: UpdateProductPayload) => {
    const res = await axios.post(`${API_URL}/products`, data);
    return res.data as ProductType;
  }
);

ipcMain.handle(
  "update-products",
  async (
    _event,
    { id, data }: { id: number; data: UpdateProductPayload }
  ) => {
    const res = await axios.put(
      `${API_URL}/products/${id}`, data);
    return res.data as ProductType;
  }
);

ipcMain.handle(
  "delete-products",
  async (_event, id: number) => {
    await axios.delete(`${API_URL}/products/${id}`);
    return true;
  }
);
