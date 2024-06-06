import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";

export const List = ({ columns }) => {
  return (
    <div className=" w-[98vw] flex min-w-max">
      <Sidebar />
      <div className="flex w-full">
        <div className=" w-full gap-2  ">
          {/* <Navbar /> */}
          <DataTable columns={columns} />
        </div>
      </div>
    </div>
  );
};
