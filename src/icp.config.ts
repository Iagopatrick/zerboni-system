import axios from "axios";
import { ipcMain } from "electron";

interface GetUsersParams {
  search?: string;
  page?: number;
  limit?: number;
}
interface GetUsersResponse {
  rows: UserType[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_URL = "http://127.0.0.1:3333/api";

ipcMain.handle("get-users", async (_, params: GetUsersParams) => {
  const res = await axios.get(`${API_URL}/users`, { params });
  return res.data as GetUsersResponse;
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