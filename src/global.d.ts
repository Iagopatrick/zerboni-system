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

declare global {
  interface Window {
    api: {
      getUsers: () => Promise<any>;

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
