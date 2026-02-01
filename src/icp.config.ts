import axios from "axios";
import { ipcMain } from "electron";

const API_URL = "http://127.0.0.1:3333/api";

ipcMain.handle("get-users", async () => {
  const res = await axios.get(`${API_URL}/users`);
  return res.data;
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