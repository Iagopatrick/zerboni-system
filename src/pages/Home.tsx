import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";
import { Userpage } from "./users/User";
import { UserFormPage } from "./users/components/UserFormPage";

type UserView = "list" | "create" | "view" | "edit";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.USUARIOS);

  const [userView, setUserView] = useState<UserView>("list");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  return (
    <div className="flex h-full bg-bluePrimary/85">
      <Navbar tab={tab} setTab={setTab} />

      {tab === TabsEnum.USUARIOS && (
        <>
          {userView === "list" && (
            <Userpage
              onCreate={() => setUserView("create")}
              onView={(id) => {
                setSelectedUserId(id);
                setUserView("view");
              }}
              onEdit={(id) => {
                setSelectedUserId(id);
                setUserView("edit");
              }}
            />
          )}

          {(userView === "create" || userView === "view" || userView === "edit") && (
            <UserFormPage
              mode={userView}
              userId={selectedUserId}
              onBack={() => {
                setUserView("list");
                setSelectedUserId(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
