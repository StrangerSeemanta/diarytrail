import { IoSettingsOutline } from "react-icons/io5";
import { BiUser } from "react-icons/bi";
import { IconType } from "react-icons";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { BsBook } from "react-icons/bs";
import { MdOutlineExplore } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
export interface SidebarLink {
  Label: string;
  Icon: IconType;
  To: string;
  isActive: boolean;
}
export function getSidebarLinks(pathname: string) {
  const links: SidebarLink[] = [
    {
      Label: "Explore",
      Icon: MdOutlineExplore,
      To: "/",
      isActive: pathname === "/",
    },
    {
      Label: "status",
      Icon: TfiStatsUp,
      To: "/status",
      isActive: pathname === "/status",
    },
    {
      Label: "my diaries",
      Icon: BsBook,
      To: "/diaries",
      isActive: pathname === "/diaries",
    },
    {
      Label: "friends",
      Icon: HiOutlineUserGroup,
      To: "/profile",
      isActive: pathname === "/profile",
    },
    {
      Label: "profile",
      Icon: BiUser,
      To: "/profile",
      isActive: pathname === "/profile",
    },
    {
      Label: "settings",
      Icon: IoSettingsOutline,
      To: "/settings",
      isActive: pathname === "/settings",
    },
  ];

  return links;
}
