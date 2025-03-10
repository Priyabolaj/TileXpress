import React, { useEffect, useState } from "react";
import { MdOutlinePendingActions } from "react-icons/md";
import {
  LuArrowDown,
  LuArrowUp,
  LuShoppingBag,
  LuShoppingCart,
  LuUsers,
} from "react-icons/lu";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import ColumnChart from "./ColumnChart";
import { getAxiosInstance } from "../../../utility/axiosApiConfig";

function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const axiosInstance = getAxiosInstance();
  const fetchData = async () => {
    await axiosInstance
      .get("http://localhost:8081/api/admin/totalData", {})
      .then((res) => {
        const data = res.data;
        setTotalSales(data.totalSales);
        setPendingOrders(data.pendingOrders);
        setTotalUsers(data.totalUsers);
        setTotalProducts(data.totalProducts);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <div className="flex flex-col items-start justify-center p-6 h-fit w-auto bg-white shadow rounded">
          <LuShoppingCart
            fontSize={50}
            className="text-indigo-500 p-3 bg-indigo-500/10 rounded-full"
          />
          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h4 className="text-2xl font-bold">₹{totalSales}</h4>
              <span className="text-sm font-medium">Total Sales</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>0.43%</span>
              <LuArrowUp />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center p-6 h-fit w-auto bg-white shadow rounded">
          <MdOutlinePendingActions
            fontSize={50}
            className="text-indigo-500 p-3 bg-indigo-500/10 rounded-full"
          />
          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h4 className="text-2xl font-bold">{pendingOrders}</h4>
              <span className="text-sm font-medium">Pending Orders</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>4.35%</span>
              <LuArrowUp />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center p-6 h-fit w-auto bg-white shadow rounded">
          <LuShoppingBag
            fontSize={50}
            className="text-indigo-500 p-3 bg-indigo-500/10 rounded-full"
          />
          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h4 className="text-2xl font-bold">{totalProducts}</h4>
              <span className="text-sm font-medium">Total Product</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>2.59%</span>
              <LuArrowUp />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start justify-center p-6 h-fit w-auto bg-white shadow rounded">
          <LuUsers
            fontSize={50}
            className="text-indigo-500 p-3 bg-indigo-500/10 rounded-full"
          />
          <div className="mt-4 flex items-end justify-between w-full">
            <div>
              <h4 className="text-2xl font-bold">{totalUsers}</h4>
              <span className="text-sm font-medium">Total Users</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <span>0.95%</span>
              <LuArrowDown />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        <div className="flex-1 flex shadow-lg border border-indigo-100 pt-7 pb-2 px-5">
          <BarChart />
        </div>
        <div className="flex-1 flex shadow-lg border border-indigo-100 pt-7 pb-2 px-5">
          <ColumnChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
