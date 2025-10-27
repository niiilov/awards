import React from "react";

export const Autoscroll = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-6 flex-nowrap">{children}</div>
    </div>
  );
};
