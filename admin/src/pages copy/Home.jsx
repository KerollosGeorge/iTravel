import { Featured } from "../components/Featured";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Widget } from "../components/Widget";
import { Chart } from "../components/Chart";

export const Home = () => {
  return (
    <div className=" w-full flex">
      <Sidebar />
      <div className="flex">
        <div className="w-[.5px] h-full bg-[#999]"></div>
        <div className=" w-full flex flex-col gap-2">
          <Navbar />
          <div className=" w-full flex max-lg:w-[550px] max-lg:flex-wrap max-lg:items-center max-lg:self-center">
            <Widget type="user" />
            <Widget type="orders" />
            <Widget type="earning" />
            <Widget type="balance" />
          </div>
          <div className=" flex max-xl:w-full items-center max-xl:transition-all transition-all  max-lg:flex-col">
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
            <Featured />
          </div>
        </div>
      </div>
    </div>
  );
};
