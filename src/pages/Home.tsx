import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";
import { Userpage } from "./users/User";
import { UserFormPage } from "./users/components/UserFormPage";
import { CustomerPage } from "./customers/Customer";
import { CustomerFormPage } from "./customers/components/CustomerFormPage";

type UserView = "list" | "create" | "view" | "edit";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.USUARIOS);

  const [userView, setUserView] = useState<UserView>("list");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [customerView, setCustomerView] = useState<UserView>("list");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

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

      {tab === TabsEnum.CUSTOMERS && (
        <>
          {customerView === "list" && (
            <CustomerPage
              onCreate={() => setCustomerView("create")}
              onView={(id) => {
                setSelectedCustomerId(id);
                setCustomerView("view");
              }}
              onEdit={(id) => {
                setSelectedCustomerId(id);
                setCustomerView("edit");
              }}
            />
          )}

          {(customerView === "create" || customerView === "view" || customerView === "edit") && (
            <CustomerFormPage
              mode={customerView}
              customerId={selectedCustomerId}
              onBack={() => {
                setCustomerView("list");
                setSelectedCustomerId(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
