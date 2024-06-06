import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

export const Featured = () => {
  return (
    <div className="flex flex-col h-[440px] gap-4 shadow-lg shadow-[#727272] m-3  rounded-md p-3 items-center w-[450px] max-lg:w-[520px] max-lg:mb-0">
      <h1 className=" self-start">Total Revenue</h1>

      <CircularProgressbar
        value={70}
        text="70%"
        strokeWidth={5}
        className="w-[100px] h-[100px]"
      />

      <p>Total Bookings Made Today</p>
      <p className=" text-[30px]">$420</p>
      <p className=" w-[85%] text-center">
        Previous transactions processing. Last payments may not be included.
      </p>
      <div className=" w-full flex justify-between">
        <div className=" flex flex-col items-center gap-2">
          <span>Target</span>
          <div className="flex">
            <KeyboardArrowDownIcon className="text-[red]" />
            <p className=" text-[red]">$12.4k</p>
          </div>
        </div>
        <div className=" flex flex-col items-center gap-2">
          <span>Last Week</span>
          <div className="flex">
            <KeyboardArrowUpOutlinedIcon className="text-[green]" />
            <p className=" text-[green]">$12.4k</p>
          </div>
        </div>
        <div className=" flex flex-col items-center gap-2">
          <span>Last Month</span>
          <div className="flex">
            <KeyboardArrowUpOutlinedIcon className="text-[green]" />
            <p className=" text-[green]">$12.4k</p>
          </div>
        </div>
      </div>
    </div>
  );
};
