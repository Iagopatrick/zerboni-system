import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";
import { Userpage } from "./users/User";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.USUARIOS);

  return (
    <div className="flex h-full bg-bluePrimary/85">
      <Navbar tab={tab} setTab={setTab} />
      {tab === TabsEnum.USUARIOS && <Userpage />}
    </div>
  );
};
