import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.DASHBOARD);

  return (
    <div className="flex h-[100%] bg-bluePrimary">
      <Navbar tab={tab} setTab={setTab} />
      <h2>Welcome to the Home Page</h2>
    </div>
  );
};
