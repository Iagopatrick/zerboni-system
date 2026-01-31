import axios from "axios";
import { ipcMain } from "electron";

ipcMain.handle("get-users", async () => {
    const res = await axios.get("http://127.0.0.1:3333/api/users"); 
  return res.data;
});