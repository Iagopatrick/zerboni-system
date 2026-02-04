import axios from "axios";
import { SupplierType } from "./types/supplier";
import { ProductType } from "./types/product";
import { app, BrowserWindow, ipcMain, dialog } from "electron";
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

const API_URL = "http://127.0.0.1:3333/api";

ipcMain.handle("get-users", async (_, params: PaginationParams) => {
  const res = await axios.get(`${API_URL}/users`, { params });
  return res.data as PaginatedResponse<UserType>;
});

ipcMain.handle("create-users", async (_, data) => {
  const res = await axios.post(`${API_URL}/users`, data);
  return res.data;
});

ipcMain.handle("update-users", async (_, { id, data }) => {
  const res = await axios.put(`${API_URL}/users/${id}`, data);
  return res.data;
});

ipcMain.handle("delete-users", async (_, id) => {
  await axios.delete(`${API_URL}/users/${id}`);
  return true;
});

type CreateCustomerPayload = Omit<CustomerType, "id" | "created_at">;
type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

ipcMain.handle(
  "get-customers",
  async (_event, params?: PaginationParams) => {
    const res = await axios.get(`${API_URL}/customers`, { params });
    return res.data as PaginatedResponse<CustomerType>;
  }
);

ipcMain.handle(
  "create-customers",
  async (_event, data: CreateCustomerPayload) => {
    const res = await axios.post(`${API_URL}/customers`, data);
    return res.data as CustomerType;
  }
);

ipcMain.handle(
  "update-customers",
  async (_event, { id, data }: { id: number; data: UpdateCustomerPayload }) => {
    const res = await axios.put(`${API_URL}/customers/${id}`, data);
    return res.data as CustomerType;
  }
);

ipcMain.handle(
  "delete-customers",
  async (_event, id: number) => {
    await axios.delete(`${API_URL}/customers/${id}`);
    return true;
  }
);

type CreateSupplierPayload = Omit<SupplierType, "id" | "created_at">;
type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

ipcMain.handle(
  "get-suppliers",
  async (_event, params?: PaginationParams) => {
    const res = await axios.get(`${API_URL}/suppliers`, { params });
    return res.data as PaginatedResponse<SupplierType>;
  }
);

ipcMain.handle(
  "create-suppliers",
  async (_event, data: CreateSupplierPayload) => {
    const res = await axios.post(`${API_URL}/suppliers`, data);
    return res.data as SupplierType;
  }
);

ipcMain.handle(
  "update-suppliers",
  async (
    _event,
    { id, data }: { id: number; data: UpdateSupplierPayload }
  ) => {
    const res = await axios.put(`${API_URL}/suppliers/${id}`, data);
    return res.data as SupplierType;
  }
);

ipcMain.handle(
  "delete-suppliers",
  async (_event, id: number) => {
    await axios.delete(`${API_URL}/suppliers/${id}`);
    return true;
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
