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
    try {
      const res = await fetch(`${URL}/deleteVoucher/${id}`, {
        method: "GET",
      });
      const voucher = await res.json();
      if (res.status === 200) {
        alert("Xóa voucher thành công");
        navigate("/Partner/ListVoucherPN");
      } else {
        alert("Error: " + (voucher.message || "Failed to delete voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-bl to-[#75bde0] from-[#eeeeee] h-full flex items-center justify-center">
        <span className="font-extrabold text-4xl text-center">Loading...</span>
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
    <div className="lg:bg-[#eaf9e7] bg-[#4c7da7] h-full">
      <div className="w-full bg-gradient-to-bl to-[#75bde0] h-full from-30% from-[#eeeeee] p-4 ">
        <div className="grid grid-cols-12 text-[#3b7097]">
          <div className="col-span-11 flex items-center">
            <h1 className="text-4xl mt-4 mb-10 w-full text-left font-bold px-10">
              Chi tiết voucher
            </h1>
          </div>
          <div className="col-span-1 flex items-center ">
            <Link to={`/Partner/ListvoucherPN`}>
              <button className="bg-[#eaf9e7] hover:bg-[#5591bc] w-10 h-10 border-4 border-[#5591bc] hover:text-[#eaf9e7] font-bold rounded-full">
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
              <span className="font-bold text-[#3b7097]">Hạn sử dụng:</span>
              <span className="text-[#3b7097]">
                {voucher.ReleaseTime ? date(voucher.ReleaseTime) : "N/A"}
                <span> - </span>
                {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
              </span>
            </p>
          </div>
          <div className="w-full text-[#3B7097]">
            <h1 className="text-3xl font-bold mb-2">{voucher.Name}</h1>
            <div className="w-full border-b border-[#3B7097] mb-10">
              <span className="text-xl text-[#3b7097]">{voucher._id}</span>
              <span className="float-right font-bold text-xl text-[#3b7097]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    voucher.States === "enable"
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
                <span className="font-bold text-[#3b7097]">
                  Số lượng còn lại:{" "}
                </span>
                <span className=" text-[#3b7097]">
                  {voucher.RemainQuantity || "N/A"}
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#3b7097]">Mức giảm: </span>
                <span className=" text-[#3b7097]">
                  {voucher.PercentDiscount || "N/A"}%
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#3b7097]">Mô tả: </span>
                <span className=" text-[#3b7097]">
                  {voucher.Description || "N/A"}
                </span>
              </p>
              <div className="my-4">
                {voucher.conditions && voucher.conditions.length > 0 ? (
                  voucher.conditions.map((condition) => (
                    <div
                      key={condition._id}
                      className="shadow-inner shadow-[#82C0DF] rounded-lg p-2 mb-2 font-semibold bg-white"
                    >
                      <p>
                        <span className="text-lg font-bold text-[#3b7097]">
                          Giá trị tối thiểu:{" "}
                        </span>
                        <span className="text-lg text-[#3B7097] font-normal">
                          {formattedPrice(condition.MinValue)}
                        </span>
                      </p>
                      <p>
                        <span className="text-lg font-bold text-[#3b7097]">
                          Giá trị tối đa:{" "}
                        </span>
                        <span className="text-lg text-[#3b7097] font-normal">
                          {formattedPrice(condition.MaxValue)}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Không có điều kiện áp dụng.</p>
                )}
              </div>
              <div className="my-4 bg-white shadow-inner shadow-[#82C0DF] rounded-lg p-2 mb-5">
                {voucher.haveVouchers && voucher.haveVouchers.length > 0 ? (
                  voucher.haveVouchers.map((haveVoucher) => (
                    <div key={haveVoucher._id}>
                      <p>
                        <span className="text-[#3b7097] text-lg font-semibold">
                          Service:
                        </span>{" "}
                        <span className="text-[#3b7097] text-lg font-normal">
                          {serviceNames[haveVoucher.Service_ID] || "Loading..."}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#3b7097] font-semibold">
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
              to={`/Partner/EditVoucherPN/${id}`}
              className="bg-[#3b7097] hover:bg-[#daf9fe] font-bold text-lg text-[#eaf9e7] hover:text-[#3b7097] border-2 border-[#326080] p-5 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span className="ml-2">Edit</span>
            </Link>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#2F4F4F] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handleDeleteVoucher(id)}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete</span>
            </button>
          </div>
          <div className="col-span-3 gap-10">
            <button
              className="bg-[#3bb0b0] hover:bg-[#eaf9e7] font-bol outline-none text-lg text-[#eaf9e7] hover:text-[#3bb0b0] border-2 border-[#3bb0b0] p-5 rounded-lg flex items-center justify-center w-full"
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
