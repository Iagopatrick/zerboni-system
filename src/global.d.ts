export { };

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.svg" {
  const src: string;
  export default src;
}

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

type CreateUserPayload = {
  name: string;
  email: string;
};

type UpdateUserPayload = Partial<CreateUserPayload>;

type CreateCustomerPayload = Omit<CustomerType, "id" | "created_at">;
type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

type CreateSupplierPayload = Omit<SupplierType, "id" | "created_at">;
type UpdateSupplierPayload = Partial<CreateSupplierPayload>;

declare global {
  interface Window {
    api: {
      getUsers: (
        params?: PaginationParams
      ) => Promise<PaginatedResponse<UserType>>;

      createUsers: (data: CreateUserPayload) => Promise<UserType>;

      updateUsers: (
        id: number,
        data: UpdateUserPayload
      ) => Promise<UserType>;

      deleteUsers: (id: number) => Promise<void>;

      getCustomers: (
        params?: PaginationParams
      ) => Promise<PaginatedResponse<CustomerType>>;

      createCustomers: (
        data: CreateCustomerPayload
      ) => Promise<CustomerType>;

      updateCustomers: (
        id: number,
        data: UpdateCustomerPayload
      ) => Promise<CustomerType>;

      deleteCustomers: (id: number) => Promise<void>;

      getSuppliers: (
        params?: PaginationParams
      ) => Promise<PaginatedResponse<SupplierType>>;

      createSuppliers: (
        data: CreateSupplierPayload
      ) => Promise<SupplierType>;

      updateSuppliers: (
        id: number,
        data: UpdateSupplierPayload
      ) => Promise<any>;

      deleteSuppliers: (id: number) => Promise<void>;
    };
  }
}
