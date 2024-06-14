import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { darkModeCotext } from "../context/DarkMoodContext";
import { Loading } from "./Loading";
import { faMagnifyingGlass, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const DataTable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const { data, loading, error } = useFetch(
    path !== "hotels"
      ? `https://itravel-apis.vercel.app/api/${path}`
      : `https://itravel-apis.vercel.app/api/${path}/all-hotels`
  );
  const [list, setList] = useState();
  const { darkMode } = useContext(darkModeCotext);
  const [isOpen, setIsOpen] = useState(false);
  const [removedId, setRemovedId] = useState();
  const [err, setErr] = useState();
  const [msg, setMsg] = useState();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (!loading && !error) {
      setList(
        data
          .filter((item) => {
            return search.toUpperCase() === ""
              ? item
              : path === "user"
              ? item.firstName.toUpperCase().startsWith(search.toUpperCase()) ||
                item.lastName.toUpperCase().startsWith(search.toUpperCase())
              : path === "hotels"
              ? item.HotelName.toUpperCase().startsWith(search.toUpperCase()) ||
                item.country.toUpperCase().startsWith(search.toUpperCase()) ||
                item.city.toUpperCase().startsWith(search.toUpperCase()) ||
                item.type.toUpperCase().startsWith(search.toUpperCase())
              : path === "rooms"
              ? item.title.toUpperCase().startsWith(search.toUpperCase()) ||
                item.price
                  .toString()
                  .toUpperCase()
                  .startsWith(search.toUpperCase())
              : item.content.toUpperCase().startsWith(search.toUpperCase()) ||
                item.type.toUpperCase().startsWith(search.toUpperCase());
          })
          .reverse()
      );
    }
    return () => {}; // Empty cleanup function
  }, [data, search]);
  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://itravel-apis.vercel.app/api/${path}/${removedId}`
      );
      setMsg(res.data);
      setList(list.filter((item) => item._id !== removedId));
      setRemovedId();
      const msgTime = setTimeout(() => {
        setMsg("");
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(msgTime);
    } catch (err) {
      setErr(err.response.data.message);
      const errTime = setTimeout(() => {
        setErr("");
        setIsOpen(false);
      }, 2000);
      return () => clearTimeout(errTime);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className=" w-full flex gap-4">
            <Link
              to={`/${path}/${params.row._id}`}
              state={{ data: params.row }}
              className=" border-dashed border-[1px] border-[#4040ff] rounded-md py-1 px-2 text-blue-700 text-center hover:bg-blue-700  hover:text-white hover:transition-all transition-all"
            >
              <button>View</button>
            </Link>
            {(path === "hotels" || path === "rooms") && (
              <Link
                to={`/${path}/edit/${params.row._id}`}
                state={{ data: params.row }}
                className=" border-dashed border-[1px] border-[#59ff40] rounded-md py-1 px-2 text-green-700 text-center hover:bg-green-700  hover:text-white hover:transition-all transition-all"
              >
                <button>Edit</button>
              </Link>
            )}
            <button
              onClick={() => {
                setIsOpen(true);
                setRemovedId(params.row._id);
              }}
              className=" border-dashed border-[1px] border-[#e83737] rounded-md py-1 px-2 text-red-700 text-center hover:bg-red-600 hover:text-white hover:transition-all transition-all"
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className=" relative w-full p-2 m-2 shadow-md rouded-md shadow-[gray] min-w-full ">
      {loading ? (
        <div className=" absolute top-[40%] left-[30%]">
          <Loading />
        </div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          {isOpen && (
            <div className="fixed top-[40%] left-[40%] z-10 w-[500px] opacity-100 bg-[#cdcdcd] p-2 rounded-lg flex flex-col ">
              <p
                className={
                  darkMode
                    ? " w-full text-center mb-[30px] font-semibold text-2xl text-black"
                    : " w-full text-center mb-[30px] font-semibold text-2xl"
                }
              >
                Are You Sure
              </p>
              <div className="w-full flex justify-around">
                <button
                  onClick={() => handleDelete()}
                  className="  border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-red-600 hover:scale-[1.08] hover:transition-all transition-all"
                >
                  Delete
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className=" border-[1px] border-[#737373] rounded-md py-1 px-2 text-white text-center bg-green-700  hover:scale-[1.08] hover:transition-all transition-all"
                >
                  Cancel
                </button>
              </div>
              {err && (
                <span className="w-full text-red-600 text-center self-center mt-5">
                  {err}
                </span>
              )}
              {msg && (
                <span className="w-full text-green-600 text-center self-center mt-5">
                  {msg}
                </span>
              )}
            </div>
          )}
          <div
            className={
              isOpen ? "w-full relative opacity-60" : " w-full relative"
            }
          >
            <div className=" flex w-full justify-between px-5 items-center mb-4">
              <div className="flex gap-5">
                <p className="text-3xl text-[gray] font-medium capitalize">
                  {path}
                </p>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search..."
                    className="w-[300px] h-[35px] indent-4 rounded-2xl border-[1px] border-gray-500 font-semibold outline-none text-gray-300  placeholder:text-gray-600"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    className=" absolute right-2 "
                  />
                </div>
              </div>
              {path !== "reviews" && (
                <Link
                  to={`/${path}/new`}
                  className=" border-[1px] border-[#29a92f] rounded-md py-1 px-2 text-green-700 text-center hover:bg-green-700  hover:text-white hover:transition-all transition-all"
                >
                  Add New
                </Link>
              )}
            </div>
            {list?.length === 0 && (
              <h1 className="text-center py-8">No Data Available</h1>
            )}

            {list?.length > 0 && (
              <DataGrid
                className=" h-[600px] min-h-[100px] p-5 text-center"
                sx={
                  darkMode
                    ? {
                        "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell, & .MuiCheckbox-root":
                          {
                            color: "rgb(200,200,200)",
                          },
                        "& .MuiDataGrid-columnFooter": {
                          color: "rgb(200,200,200)",
                        },
                      }
                    : {
                        "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                          color: "black",
                        },
                      }
                }
                rows={list}
                columns={columns.concat(actionColumn)}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 8,
                    },
                  },
                }}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row._id}
                pageSizeOptions={[5, 10, 20, 50, 100, 9]} // add 9 to the pageSizeOptions array
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
