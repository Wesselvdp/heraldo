"use client";
import React, { FC, useState, useEffect } from "react";
import { createContext } from "react";
import SidePanel from "./SidePanel";

export const MyContext = createContext({} as any);

type T = any;

const MainBody: FC<T> = props => {
  const [sidePanelIsOpen, setSidePanelIsOpen] = useState(false);
  const [PanelRenderFunc, setPanelRenderFunc] = useState<any>(null);

  const toggle = () => setSidePanelIsOpen(!sidePanelIsOpen);
  const close = () => setSidePanelIsOpen(false);
  const open = () => setSidePanelIsOpen(true);
  const panelActions = { toggle, close, open };

  return (
    <>
      <MyContext.Provider
        value={{ panelActions, panelRenderFunc: null, setPanelRenderFunc }}
      >
        {/* Side panel */}
        <div className="flex flex-1">{props.children}</div>
        <SidePanel actions={panelActions} isOpen={sidePanelIsOpen}>
          {PanelRenderFunc && <PanelRenderFunc />}
        </SidePanel>
      </MyContext.Provider>
    </>
  );
};

export default MainBody;
