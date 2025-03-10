import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginationButtons from "../Utility/PaginationButtons";
import axios from "axios";
import { getAxiosInstance } from "../../../utility/axiosApiConfig";

function Products() {
  const axiosInstance = getAxiosInstance();
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [tableItems, setTableItems] = useState([]);

  const fetchData = async () => {
    await axiosInstance
      .get("http://localhost:8081/api/admin/product/all", {})
      .then((res) => {
        const data = res.data;
        setTableItems(data);
        // console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const getProducts = function (page, limit) {
      let array = [];
      let j = 0;
      for (let i = (page - 1) * limit; i < page * limit && tableItems[i]; i++) {
        array.push(tableItems[i]);
        array[j].idx = i + 1;
        j++;
      }
      return array;
    };

    setLoading(false);

    let result = getProducts(currentPage + 1, limit);

    setTotalPages(Math.ceil(tableItems.length / limit));
    setProducts(result);
  }, [limit, currentPage, tableItems]);

  const deleteProduct = async (productId) => {
    try {
      await axiosInstance.delete(`http://localhost:8081/api/admin/product/${productId}/delete`);
      fetchData(); 
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-0">
      <div className="items-start justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
            All products
          </h3>
        </div>
        <div className="mt-3 md:mt-0">
          <div className="flex justify-end gap-x-4">
            <input
              placeholder="Search..."
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              className="w-fit px-3 py-2 outline-none border border-indigo-200 bg-indigo-50 rounded"
            />
            <select
              name="records"
              id="records"
              className="px-3 py-2 outline-none border border-indigo-200 bg-indigo-50 rounded"
              onClick={(e) => setLimit(e.target.value)}
              defaultValue={limit}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-[55vh]">
          <div className="animate-spin h-16 w-16 rounded-full border-4 border-r-transparent border-indigo-500"></div>
        </div>
      ) : (
        <div className="mt-8 shadow-sm border rounded-lg overflow-x-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
              <tr>
                <th className="py-3 px-1 text-center">No.</th>
                <th className="py-3 px-6">Products</th>
                <th className="py-3 px-6 text-center">Colour</th>
                <th className="py-3 px-6 text-center">Quantity</th>
                <th className="py-3 px-6 text-center">Price</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 divide-y">
              {products
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.title.toLowerCase().includes(search);
                })
                .map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-1 py-4 whitespace-nowrap text-center">
                      {item.idx}
                    </td>
                    <td className="flex items-center gap-x-3 py-3 px-6 whitespace-nowrap">
                      <img
                        src={item.imageUrl}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <span className="block text-gray-700 text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="block text-gray-700 text-xs">
                          {item.brand}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.color}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      ₹{item.price}/Box
                    </td>
                    <td className="text-center px-6 whitespace-nowrap space-x-2 gap-1">
                      <Link
                        className="py-2 px-3 font-medium text-indigo-600 border hover:border-indigo-500 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                        to={`/admin/products/update/${item.id}`}
                      >
                        Edit
                      </Link>
                      <button
                          className="py-2 leading-none px-3 font-medium border hover:border-red-500 text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                          onClick={() => deleteProduct(item.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationButtons
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default Products;
