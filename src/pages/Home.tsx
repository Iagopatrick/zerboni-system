import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";
import { Userpage } from "./users/User";
import { UserFormPage } from "./users/components/UserFormPage";
import { CustomerPage } from "./customers/Customer";
import { CustomerFormPage } from "./customers/components/CustomerFormPage";
import { SupplierPage } from "./suppliers/Supplier";
import { SupplierFormPage } from "./suppliers/components/SupplierFormPage";

type UserView = "list" | "create" | "view" | "edit";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.SUPPLIERS);

  const [userView, setUserView] = useState<UserView>("list");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [customerView, setCustomerView] = useState<UserView>("list");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [supplierView, setSupplierView] = useState<UserView>("list");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(null);

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

      {tab === TabsEnum.SUPPLIERS && (
        <>
          {supplierView === "list" && (
            <SupplierPage
              onCreate={() => setSupplierView("create")}
              onView={(id) => {
                setSelectedSupplierId(id);
                setSupplierView("view");
              }}
              onEdit={(id) => {
                setSelectedSupplierId(id);
                setSupplierView("edit");
              }}
            />
          )}

          {(supplierView === "create" || supplierView === "view" || supplierView === "edit") && (
            <SupplierFormPage
              mode={supplierView}
              supplierId={selectedSupplierId}
              onBack={() => {
                setSupplierView("list");
                setSelectedSupplierId(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};
