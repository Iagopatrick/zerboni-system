// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("api", {
  getUsers: () => ipcRenderer.invoke("get-users"),

  createUsers: (data: { name?: string; email?: string; }) =>
    ipcRenderer.invoke("create-users", data),

  updateUsers: (id: number, data: { name?: string; email?: string; }) =>
    ipcRenderer.invoke("update-users", { id, data }),

  deleteUsers: (id: number) =>
    ipcRenderer.invoke("delete-users", id),
});