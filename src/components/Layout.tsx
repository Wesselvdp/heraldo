import React, { FC } from "react";
import AsideList from "./AsideList";
import Link from "next/link";

type T = any;

const Layout: FC<T> = props => {
  return (
    <div className="flex w-full h-[100vh]">
      {/* nav */}
      <aside className="flex w-[80px] flex-col relative py-4 px-2 border-r-2 items-center border-slate-200">
        <div className="mb-2">
          <span className="material-icons">logo_dev</span>
        </div>
        <nav>
          <Link href={"/subscriptions"}>
            <div className=" flex p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
              <span className="material-icons">newspaper</span>
            </div>
          </Link>
        </nav>
      </aside>

      <div className="flex flex-1">{props.children}</div>
    </div>
  );
};

export default Layout;
