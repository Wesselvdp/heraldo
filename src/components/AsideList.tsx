"use client";
import React, { FC, useState } from "react";
import Button from "./Button";
import Link from "next/link";
type Item = {
  id: string;
  query: string;
  icon: string;
  name: string;
  href: string;
};
type T = {
  items: Item[];
};

const AsideList: FC<T> = ({ items }) => {
  const [search, setSearch] = useState("");
  console.log({ items });

  return (
    <div className="border-r-2 w-[300px] h-full">
      <div className="p-2 border-b-2">
        <input
          className="w-full bg-white"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="px-2 py-4 mb-2">
        <div className="mb-2">
          {items.map(item => (
            <Link href={`/subscriptions/${item.id}`}>
              <div className=" cursor-pointer flex items-center text-slate-500 gap-4 p-2 text-sm rounded-lg hover:bg-slate-300">
                <span className="material-icons text-sm">newspaper</span>
                <span>{item.name || "unnamed"}</span>
              </div>
            </Link>
          ))}
          {/* <Link href="/dashboard">
            <div className=" cursor-pointer flex items-center text-slate-500 gap-4 p-2 text-sm rounded-lg hover:bg-slate-300">
              <span className="material-icons text-sm">newspaper</span>
              <span>Blizzard - Mike Ybarra</span>
            </div>
          </Link>
          <div className=" cursor-pointer flex items-center text-slate-500 gap-4 p-2 text-sm rounded-lg hover:bg-slate-300">
            <span className="material-icons text-sm">newspaper</span>
            <span>Cheil - campaigns</span>
          </div>*/}
        </div>
        <Button block={true}>
          <Link href="/subscriptions/create">+ New subscription</Link>
        </Button>
      </div>
    </div>
  );
};

export default AsideList;
