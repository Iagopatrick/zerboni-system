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

declare global {
  interface Window {
    api: {
      getUsers: (params?: GetUsersParams) => Promise<GetUsersResponse>;

      createUsers: (data: {
        name: string;
        email: string;
      }) => Promise<any>;

      updateUsers: (
        id: number,
        data: {
          name?: string;
          email?: string;
        }
      ) => Promise<any>;

      deleteUsers: (id: number) => Promise<void>;
    };
  }
}
