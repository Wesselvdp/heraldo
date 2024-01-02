"use client";
import React, { FC, use, useState } from "react";
import Button from "./Button";

type T = {
  isOpen: boolean;
  actions: any;
  children: React.ReactNode;
};

const openStyles = "translate-x-0 opacity-100";
const closedStyles = "translate-x-full opacity-0";

const SidePanel: FC<T> = ({ isOpen, actions, children }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={() => actions.close()}
          className="bg-slate-500 opacity-50  fixed inset-0"
        ></div>
      )}
      <div
        className={`fixed transition-all ${
          isOpen ? openStyles : closedStyles
        } overflow-scroll right-0 bg-white shadow top-0 bottom-0 w-[600px] max-w-[90%]`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;
