import { useState } from "react";
import { Navbar } from "../components/Navbar";
import { TabsEnum } from "../constans/tab.constans";
import { Userpage } from "./users/User";
import { UserFormPage } from "./users/components/UserFormPage";
import { CustomerPage } from "./customers/Customer";
import { CustomerFormPage } from "./customers/components/CustomerFormPage";
import { SupplierPage } from "./suppliers/Supplier";
import { SupplierFormPage } from "./suppliers/components/SupplierFormPage";
import { SupplierPaymentPage } from "./suppliers-payment/SupplierPayment";
import { SupplierPaymentFormPage } from "./suppliers-payment/components/SupplierPaymentFormPage";
import { ProductPage } from "./products/Product";
import { ProductFormPage } from "./products/components/ProductFormPage";
import { Dashboard } from "./dashboard/Dashboard";

type UserView = "list" | "create" | "view" | "edit";

export const HomePage = () => {
  const [tab, setTab] = useState<TabsEnum>(TabsEnum.STOCK);

  const [userView, setUserView] = useState<UserView>("list");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [productView, setProductView] = useState<UserView>("list");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const [customerView, setCustomerView] = useState<UserView>("list");
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    null,
  );

  const [supplierView, setSupplierView] = useState<UserView>("list");
  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null,
  );

  const [supplierPaymentView, setSupplierPaymentView] =
    useState<UserView>("list");
  const [selectedSupplierPaymentId, setSelectedSupplierPaymentId] = useState<
    number | null
  >(null);

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

          {(userView === "create" ||
            userView === "view" ||
            userView === "edit") && (
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

      {tab === TabsEnum.STOCK && (
        <>
          {productView === "list" && (
            <ProductPage
              onCreate={() => setProductView("create")}
              onView={(id) => {
                setSelectedProductId(id);
                setProductView("view");
              }}
              onEdit={(id) => {
                setSelectedProductId(id);
                setProductView("edit");
              }}
            />
          )}

          {(productView === "create" ||
            productView === "view" ||
            productView === "edit") && (
            <ProductFormPage
              mode={productView}
              productId={selectedProductId}
              onBack={() => {
                setProductView("list");
                setSelectedProductId(null);
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

          {(customerView === "create" ||
            customerView === "view" ||
            customerView === "edit") && (
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

          {(supplierView === "create" ||
            supplierView === "view" ||
            supplierView === "edit") && (
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

      {tab === TabsEnum.SUPPLIERS_PAYMENT && (
        <>
          {supplierPaymentView === "list" && (
            <SupplierPaymentPage
              onCreate={() => setSupplierPaymentView("create")}
              onView={(id) => {
                setSelectedSupplierPaymentId(id);
                setSupplierPaymentView("view");
              }}
              onEdit={(id) => {
                setSelectedSupplierPaymentId(id);
                console.log(id);
                setSupplierPaymentView("edit");
              }}
            />
          )}

          {(supplierPaymentView === "create" ||
            supplierPaymentView === "view" ||
            supplierPaymentView === "edit") && (
            <SupplierPaymentFormPage
              mode={supplierPaymentView}
              supplierPaymentId={selectedSupplierPaymentId}
              onBack={() => {
                setSupplierPaymentView("list");
                setSelectedSupplierPaymentId(null);
              }}
            />
          )}
        </>
      )}
      {tab === TabsEnum.DASHBOARD && <Dashboard />}
    </div>
  );
};
