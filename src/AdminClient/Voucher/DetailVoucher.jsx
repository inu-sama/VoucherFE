import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faXmark,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import { useParams, Link, useNavigate } from "react-router-dom";

const DetailVoucher = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceNames, setServiceNames] = useState({});
  const navigate = useNavigate();
  const URL = "https://server-voucher.vercel.app/api";

  const handlestate = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, { method: "GET" });
      const voucher = await res.json();
      if (res.status === 400) {
        alert("Error: " + (voucher.message || "Failed to update state"));
      } else {
        alert("Update State Success");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/DetailVoucher/${id}`);
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setVoucher(data);
      console.log("Dữ liệu nhận được:", data);
    } catch (error) {
      setError("Cannot fetch data from server");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const fetchServiceID = async (serviceId) => {
    try {
      const response = await fetch(`${URL}/getServiceID/${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name; // Return the name directly
      } else {
        throw new Error("Failed to fetch service name");
      }
    } catch (error) {
      console.error("Error fetching service name:", error);
      return "Unknown Service"; // Default value in case of error
    }
  };

  useEffect(() => {
    const fetchServiceNames = async () => {
      const names = {};
      for (const haveVoucher of voucher.haveVouchers) {
        names[haveVoucher.Service_ID] = await fetchServiceID(
          haveVoucher.Service_ID
        );
      }
      setServiceNames(names);
    };

    if (voucher?.haveVouchers?.length > 0) {
      fetchServiceNames();
    }
  }, [voucher?.haveVouchers]);

  const handleDeleteVoucher = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this voucher?"
    );
    if (!confirm) return;
    else {
      try {
        const res = await fetch(`${URL}/deleteVoucher/${id}`, {
          method: "GET",
        });
        const voucher = await res.json();
        if (res.status === 200) {
          alert("Xóa voucher thành công");
          navigate("/Admin/ListVoucher");
        } else {
          alert("Error: " + (voucher.message || "Failed to delete voucher"));
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-bl to-[#dffbd8] from-30% from-[#eeeeee] h-full flex items-center justify-center">
        <span className="font-extrabold text-black text-4xl text-center">
          Loading...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center w-full text-4xl translate-y-1/2 h-full font-extrabold">
        {error}
      </div>
    );
  }

  return (
    <div className="lg:bg-[#EAF8E6]  h-full bg-[#EAF8E6]">
      <div className="w-full  to-[#d8ffce] from-30% h-full from-[#ffffff]  p-4">
        <div className="grid grid-cols-12 text-[#16233B]">
          <div className="col-span-11 flex items-center">
            <h1 className="text-4xl mt-4 mb-10 w-full text-left font-bold px-10">
              Chi tiết voucher
            </h1>
          </div>
          <div className="col-span-1 flex items-center ">
            <Link to={`/Admin/ListVoucher`}>
              <button className="bg-[#eaf9e7] hover:bg-[#4BA771] w-10 h-10 border-4 border-[#4BA771] hover:text-[#eaf9e7] font-bold rounded-full">
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </Link>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="p-10">
            <img
              className="w-full rounded-xl h-auto object-cover"
              src={voucher.Image}
              alt="Voucher"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
              }}
            />
            <p className="text-xl my-2 flex justify-between">
              <span className="font-bold text-[#4BA771]">Hạn sử dụng:</span>
              <span className="text-[#4BA771]">
                {voucher.ReleaseTime ? date(voucher.ReleaseTime) : "N/A"}
                <span> - </span>
                {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
              </span>
            </p>
          </div>
          <div className="w-full text-[#4ca74e]">
            <h1 className="text-3xl font-bold mb-2">{voucher.Name}</h1>
            <div className="w-full border-b border-[#4ca74e] mb-10">
              <span className="text-xl text-[#16233B]">{voucher._id}</span>
              <span className="float-right font-bold text-xl text-[#16233B]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    voucher.States === "Enable"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {voucher.States}
                </span>
              </span>
            </div>
            <div>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#16233B]">
                  Số lượng còn lại:{" "}
                </span>
                <span className=" text-[#4BA771]">
                  {voucher.RemainQuantity || "N/A"}
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#16233B]">Mức giảm: </span>
                <span className=" text-[#4BA771]">
                  {voucher.PercentDiscount || "N/A"}%
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#16233B]">Mô tả: </span>
                <span className=" text-[#4BA771]">
                  {voucher.Description || "N/A"}
                </span>
              </p>
              <div className="my-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-center rtl:text-center text-lg text-white dark:text-[#2a793a]">
                    <thead className="text-sm text-gray-700 uppercase  dark:bg-[#8ae293] dark:text-[#2a793a]">
                      <tr className="text-lg">
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          STT
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Giá trị tối thiểu
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Giá trị tối đa
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {voucher.conditions && voucher.conditions.length > 0 ? (
                        voucher.conditions
                          .slice(0, voucher.conditions.length)
                          .map((condition, index) => (
                            <tr
                              key={(condition._id, index)}
                              className="odd:bg-[#d9ebda] odd:dark:bg-[#daebd9] even:bg-gray-50 even:dark:bg-[#c9e9cc] border-b dark:border-[#bad6bc] text-md"
                            >
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4">
                                {formattedPrice(condition.MinValue)}
                              </td>
                              <td className="px-6 py-4">
                                {formattedPrice(condition.MaxValue)}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="text-center">
                            {" "}
                            Không có điều kiện
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="my-4 bg-[#daebd9] shadow-inner shadow-[#6ac766] rounded-lg p-2 mb-5">
                {voucher.haveVouchers && voucher.haveVouchers.length > 0 ? (
                  voucher.haveVouchers.map((haveVoucher) => (
                    <div key={haveVoucher._id}>
                      <p>
                        <span className="text-[#22672d] text-xl font-semibold">
                          Service:
                        </span>{" "}
                        <span className="text-[#16233B] text-xl font-normal">
                          {serviceNames[haveVoucher.Service_ID] || "Loading..."}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#22672d] font-semibold">
                    Toàn bộ service
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-10 w-full justify-center mt-10">
          <div className="col-span-1"></div>
          <div className="col-span-3">
            <Link
              to={`/Admin/EditVoucher/${id}`}
              className="bg-[#339d33] hover:bg-[#ddfeda] font-bold text-lg text-[#eaf9e7] hover:text-[#163b18] border-2 border-[#32803a] p-5 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span className="ml-2">Edit</span>
            </Link>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#1a402f] hover:bg-[#ddfeda] font-bold text-lg text-[#eaf9e7] hover:text-[#163b18] border-2 border-[#32803a] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handleDeleteVoucher(id)}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete</span>
            </button>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#3bb0b0] hover:bg-[#ddfeda] font-bold text-lg text-[#eaf9e7] hover:text-[#163b18] border-2 border-[#32807a] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handlestate(id)}
            >
              <FontAwesomeIcon icon={faWrench} />
              <span className="ml-2"> State</span>
            </button>
          </div>
          <div className="col-span-1"></div>
        </div>
      </div>
    </div>
  );
};

export default DetailVoucher;
