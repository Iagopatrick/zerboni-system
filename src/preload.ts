// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { SupplierType } from "./types/supplier";
import { SupplierPaymentType } from "./types/supplier-payment";
import { ProductType } from "./types/product";
import { DashboardData } from "./pages/dashboard/Dashboard";

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

type CreateSupplierPayload = Omit<SupplierType, "id" | "created_at">;
type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

type CreateSupplierPaymentPayload = Omit<
  SupplierPaymentType,
  "id" | "created_at"
>;
type UpdateSupplierPaymentPayload = Partial<CreateSupplierPaymentPayload>;
type CreateProductPayload = Omit<ProductType, "id" | "created_at">;
type UpdateProductPayload = Partial<CreateProductPayload>;

contextBridge.exposeInMainWorld("api", {
  getUsers: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-users", params) as Promise<
      PaginatedResponse<UserType>
    >,

  createUsers: (data: { name?: string; email?: string }) =>
    ipcRenderer.invoke("create-users", data),

  updateUsers: (id: number, data: { name?: string; email?: string }) =>
    ipcRenderer.invoke("update-users", { id, data }),

  deleteUsers: (id: number) => ipcRenderer.invoke("delete-users", id),

  getCustomers: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-customers", params) as Promise<
      PaginatedResponse<CustomerType>
    >,

  createCustomers: (data: CreateCustomerPayload) =>
    ipcRenderer.invoke("create-customers", data) as Promise<CustomerType>,

  updateCustomers: (id: number, data: UpdateCustomerPayload) =>
    ipcRenderer.invoke("update-customers", {
      id,
      data,
    }) as Promise<CustomerType>,

  deleteCustomers: (id: number) =>
    ipcRenderer.invoke("delete-customers", id) as Promise<void>,

  getSuppliers: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-suppliers", params) as Promise<
      PaginatedResponse<SupplierType>
    >,

  createSuppliers: (data: CreateSupplierPayload) =>
    ipcRenderer.invoke("create-suppliers", data) as Promise<SupplierType>,

  updateSuppliers: (id: number, data: UpdateSupplierPayload) =>
    ipcRenderer.invoke("update-suppliers", {
      id,
      data,
    }) as Promise<SupplierType>,

  deleteSuppliers: (id: number) =>
    ipcRenderer.invoke("delete-suppliers", id) as Promise<void>,

  getSuppliersPayments: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-suppliers-payments", params) as Promise<
      PaginatedResponse<SupplierPaymentType>
    >,

  createSuppliersPayments: (data: CreateSupplierPaymentPayload) =>
    ipcRenderer.invoke(
      "create-suppliers-payments",
      data,
    ) as Promise<SupplierPaymentType>,

  updateSuppliersPayments: (id: number, data: UpdateSupplierPaymentPayload) =>
    ipcRenderer.invoke("update-suppliers-payments", {
      id,
      data,
    }) as Promise<SupplierPaymentType>,

  deleteSuppliersPayments: (id: number) =>
    ipcRenderer.invoke("delete-suppliers-payments", id) as Promise<void>,
  getProducts: (params?: PaginationParams) =>
    ipcRenderer.invoke("get-products", params) as Promise<
      PaginatedResponse<ProductType>
    >,

  createProducts: (data: CreateProductPayload) =>
    ipcRenderer.invoke("create-products", data) as Promise<ProductType>,

  updateProducts: (id: number, data: UpdateProductPayload) =>
    ipcRenderer.invoke("update-products", { id, data }) as Promise<ProductType>,

  deleteProducts: (id: number) =>
    ipcRenderer.invoke("delete-products", id) as Promise<void>,

  getDashboardData: () =>
    ipcRenderer.invoke("get-dashboard-data") as Promise<DashboardData>,

  listSales: (params: any) => ipcRenderer.invoke("list-sales", params),
  createSale: (data: any) => ipcRenderer.invoke("create-sale", data),
  deleteSale: (id: number) => ipcRenderer.invoke("delete-sale", id),
  getSaleById: (id: number) => ipcRenderer.invoke("get-sale-by-id", id),
});
