// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

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

type CreateCustomerPayload = Omit<CustomerType, "id" | "created_at">;
type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

contextBridge.exposeInMainWorld("api", {
  getUsers: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-users", params) as Promise<PaginatedResponse<UserType>>,

  createUsers: (data: { name?: string; email?: string; }) =>
    ipcRenderer.invoke("create-users", data),

  updateUsers: (id: number, data: { name?: string; email?: string; }) =>
    ipcRenderer.invoke("update-users", { id, data }),

  deleteUsers: (id: number) =>
    ipcRenderer.invoke("delete-users", id),

  getCustomers: (params?: PaginationParams) =>
    ipcRenderer.invoke(
      "get-customers",
      params
    ) as Promise<PaginatedResponse<CustomerType>>,

  createCustomers: (data: CreateCustomerPayload) =>
    ipcRenderer.invoke("create-customers", data) as Promise<CustomerType>,

  updateCustomers: (id: number, data: UpdateCustomerPayload) =>
    ipcRenderer.invoke("update-customers", { id, data }) as Promise<CustomerType>,

  deleteCustomers: (id: number) =>
    ipcRenderer.invoke("delete-customers", id) as Promise<void>,
});