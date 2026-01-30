import { JSX } from "react/jsx-runtime";
import { ZerboniIcon } from "../assets/icons/ZerboniIcon";
import { HomeIcon } from "../assets/icons/HomeIcon";
import { TabsEnum } from "../constans/tab.constans";
import { colors } from "../constans/colors";
import { BoxIcon } from "../assets/icons/BoxIcon";
import { ConfigIcon } from "../assets/icons/ConfigIcon";
import { TruckIcon } from "../assets/icons/TruckIcon";
import { AssetsIcon } from "../assets/icons/AssetsIcon";
import { LogoutIcon } from "../assets/icons/LogoutIcon";
import userImg from "../assets/images/dc.jpg";
interface NavbarProps {
  setTab?: (tab: TabsEnum) => void;
  tab?: TabsEnum;
}

const NavbarItem = ({
  label,
  isActive,
  onClick,
  icon,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: JSX.Element;
}) => {
  return (
    <div
      className={`flex items-center justify-start gap-[3.5px] py-3.5 px-6 w-full ${isActive ? "bg-secondary rounded-r-4xl shadow-xl/20" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">{icon}</div>
      <p
        className={`font-semibold text-md font-Inter ${isActive ? "text-white" : `text-primary`}`}
      >
        {label}
      </p>
    </div>
  );
};

export const Navbar = ({ tab, setTab }: NavbarProps) => {
  return (
    <aside className="flex flex-col bg-white h-screen w-62.5  pr-6 py-4 rounded-r-lg shadow-xl/20 justify-between">
      <div className="flex gap-[6.5px] items-center px-6">
        <div>
          <ZerboniIcon width={40} height={40} />
        </div>
        <div>
          {" "}
          <p className="font-bold font-Inter text-primary text-xl">
            Zerboni Kids
          </p>
        </div>
      </div>
      <nav
        className={`h-full w-full bg-white flex items-center justify-center flex-col gap-3.75`}
      >
        <NavbarItem
          label="Dashboard"
          isActive={tab === TabsEnum.DASHBOARD}
          onClick={() => setTab && setTab(TabsEnum.DASHBOARD)}
          icon={
            <HomeIcon
              width={33}
              height={33}
              color={
                tab === TabsEnum.DASHBOARD ? colors.selected : colors.primary
              }
            />
          }
        />
        <NavbarItem
          label="Usuários"
          isActive={tab === TabsEnum.USUARIOS}
          onClick={() => setTab && setTab(TabsEnum.USUARIOS)}
          icon={
            <ConfigIcon
              width={33}
              height={33}
              color={
                tab === TabsEnum.USUARIOS ? colors.selected : colors.primary
              }
            />
          }
        />
        <NavbarItem
          label="Estoque"
          isActive={tab === TabsEnum.STOCK}
          onClick={() => setTab && setTab(TabsEnum.STOCK)}
          icon={
            <BoxIcon
              width={40}
              height={40}
              color={tab === TabsEnum.STOCK ? colors.selected : colors.primary}
            />
          }
        />
        <NavbarItem
          label="Fornecedores"
          isActive={tab === TabsEnum.SUPPLIERS}
          onClick={() => setTab && setTab(TabsEnum.SUPPLIERS)}
          icon={
            <TruckIcon
              width={33}
              height={33}
              color={
                tab === TabsEnum.SUPPLIERS ? colors.selected : colors.primary
              }
            />
          }
        />
        <NavbarItem
          label="Relatórios"
          isActive={tab === TabsEnum.REPORTS}
          onClick={() => setTab && setTab(TabsEnum.REPORTS)}
          icon={
            <AssetsIcon
              width={33}
              height={33}
              color={
                tab === TabsEnum.REPORTS ? colors.selected : colors.primary
              }
            />
          }
        />
        <NavbarItem
          label="Vendas"
          isActive={tab === TabsEnum.SALES}
          onClick={() => setTab && setTab(TabsEnum.SALES)}
          icon={
            <LogoutIcon
              width={33}
              height={33}
              color={tab === TabsEnum.SALES ? colors.selected : colors.primary}
            />
          }
        />
      </nav>
      <div className="px-6 flex items-center justify-between">
        <div>
          {" "}
          <LogoutIcon width={33} height={33} color={"#666668"} />
        </div>
        <div className="flex items-center gap-1.25">
          <p className="font-semibold text-[13px] text-[#666668]">
            Iago Patrick
          </p>
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <img src={userImg} className="object-contain " />
          </div>
        </div>
      </div>
    </aside>
  );
};
