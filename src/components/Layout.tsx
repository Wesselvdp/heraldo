import React, { FC } from "react";

import Link from "next/link";
import SignoutButton from "./SignoutButton";
import SidePanel from "./SidePanel";
import MainBody from "./MainBody";
import { logout } from "@/actions";
import NavItem from "./NavItem";

type T = any;

const Layout: FC<T> = props => {
  return (
    <div className="flex w-full h-[100vh]">
      {/* nav */}
      <aside className="flex w-[80px] flex-col relative py-4 px-2 border-r-2 items-center border-slate-200">
        <div className="mb-2 flex flex-col items-center">
          <span className="font-bold">H</span>
          <span className="font-bold text-xs">Beta</span>
        </div>
        <nav>
          <Link href={"/subscriptions"}>
            <NavItem icon="newspaper" tooltip="Subscriptions" />
          </Link>

          <NavItem icon="medical_services" tooltip="Med search coming soon" />
        </nav>
        <div className=" mt-auto flex p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
          <SignoutButton logout={logout} />
        </div>
      </aside>

      <MainBody>{props.children}</MainBody>
    </div>
  );
};

export default Layout;
