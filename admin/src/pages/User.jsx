import { DataTable } from "../components/DataTable";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { UserInfo } from "../components/UserInfo";
import { hotelColumns, reviewsColumns } from "../dataTableSources";

export const User = () => {
  return (
    <div className=" w-full flex">
      <Sidebar />
      <div className="flex">
        <div className="w-[.5px] h-full bg-[#999]"></div>
        <div className=" w-full gap-2 min-w-[80vw] ">
          <Navbar />
          <UserInfo />
          {/* <div className=" w-full p-2 mt-4">
            <h1 className=" text-2xl font-bold ml-4">Last Transictions</h1>
            <DataTable columns={reviewsColumns} />
          </div> */}
        </div>
      </div>
    </div>
  );
};
