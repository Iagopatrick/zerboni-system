import axios from "axios";
import { ipcMain } from "electron";

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