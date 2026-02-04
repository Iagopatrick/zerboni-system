import axios from "axios";
import { ipcMain } from "electron";
import { SupplierType } from "./types/supplier";
import { SupplierPaymentType } from "./types/supplier-payment";

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

type CreateSupplierPaymentPayload = Omit<SupplierPaymentType, "id" | "created_at">;
type UpdateSupplierPaymentPayload = Partial<CreateSupplierPaymentPayload>;

ipcMain.handle(
  "get-suppliers-payments",
  async (_event, params?: PaginationParams) => {
    const res = await axios.get(`${API_URL}/suppliers-payments`, { params });
    return res.data as PaginatedResponse<SupplierPaymentType>;
  }
);

ipcMain.handle(
  "create-suppliers-payments",
  async (_event, data: CreateSupplierPaymentPayload) => {
    const res = await axios.post(`${API_URL}/suppliers-payments`, data);
    return res.data as SupplierPaymentType;
  }
);

ipcMain.handle(
  "update-suppliers-payments",
  async (
    _event,
    { id, data }: { id: number; data: UpdateSupplierPaymentPayload }
  ) => {
    const res = await axios.put(`${API_URL}/suppliers-payments/${id}`, data);
    return res.data as SupplierPaymentType;
  }
);

ipcMain.handle(
  "delete-suppliers-payments",
  async (_event, id: number) => {
    await axios.delete(`${API_URL}/suppliers-payments/${id}`);
    return true;
  }
);