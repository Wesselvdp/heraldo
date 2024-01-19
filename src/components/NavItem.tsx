"use client";
import React, { FC, useState, useEffect } from "react";

import {
  useFloating,
  useInteractions,
  useHover,
  useFocus,
  offset
} from "@floating-ui/react";
type T = {
  icon: string;
  tooltip?: string;
};

const NavItem: FC<T> = props => {
  const [isOpen, setIsOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: "right",
    middleware: [
      // Assumes placement is 'bottom' (the default)
      offset({
        mainAxis: 10
      })
    ]
  });

  const hover = useHover(context);
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus
  ]);

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex transition-all p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
      >
        <span className="material-icons">{props.icon}</span>
      </div>
      {isOpen && props.tooltip && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="bg-slate-800 p-2 rounded-lg shadow-lg text-xs text-slate-100"
        >
          {props.tooltip}
        </div>
      )}
    </>
  );
};

export default NavItem;
