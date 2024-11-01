import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ListVoucher = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const URL = "https://server-voucher.vercel.app/api";
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await fetch(`${URL}/getService`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleState = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status === 400) {
        alert("Error: " + (data?.message || "Failed to update state"));
      } else {
        navigate(`/Partner/Editvoucher/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${URL}/getvoucherManagerbyPartner`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setVouchers(data);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteVoucher = async (id) => {
    try {
      const res = await fetch(`${URL}/deleteVoucher/${id}`);
      const data = await res.json();
      if (res.status === 200) {
        alert("Xóa voucher thành công");
        fetchVouchers();
      } else {
        alert("Error: " + (data?.message || "Failed to delete voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (loading) {
    return (
      <div className="text-center w-full text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
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
    <div className="lg:bg-[#eaf9e7] bg-[#4ca771]">
      <div className="w-full bg-[#eaf9e7] rounded-t-xl p-4">
        <h1 className="text-4xl text-[#2F4F4F] mb-4 w-full text-center font-bold">
          Danh sách voucher
        </h1>
        <div className="flex justify-between my-2 h-fit w-full p-2">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="font-semibold bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] outline-none px-4 py-2 rounded-lg"
            >
              Sort by Service
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-[#eaf9e7] rounded-box z-[1] w-52 p-2 shadow-inner shadow-[#4ca771] mt-2"
            >
              <li className="flex items-center text-[#2F4F4F] text-lg">
                <a
                  onClick={() => {
                    setSelectedServices(null);
                    console.log(selectedServices);
                  }}
                  className="w-full hover:bg-[#4ca771] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                >
                  All services
                </a>
              </li>
              {services.map((service) => (
                <li
                  key={service._id}
                  className="flex items-center text-[#2F4F4F] text-lg"
                >
                  <a
                    onClick={() => {
                      setSelectedServices(service);
                      console.log(selectedServices);
                    }}
                    className="w-full hover:bg-[#4ca771] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {service.ServiceName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/Partner/CreatevoucherPN"
            className="font-semibold bg-[#2F4F4F] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg"
          >
            Create Voucher
          </Link>
        </div>
        <div className="grid mx-2 grid-cols-1 lg:grid-cols-2 gap-4">
          {!selectedServices
            ? vouchers.map((voucher) => (
                <div
                  key={voucher._id}
                  className=" w-full rounded-lg p-4 bg-[#c0e6b3] text-[#2F4F4F]"
                >
                  <h2 className="text-2xl font-bold mb-3">{voucher.Name}</h2>
                  <div className="grid grid-cols-12">
                    <div className="col-span-8">
                      <p>{voucher.Description}</p>
                      <p>
                        <span className="font-bold text-[#4ca771]">
                          Số lượng còn lại:
                        </span>{" "}
                        {voucher.RemainQuantity}
                      </p>
                      <p>
                        <span className="font-bold text-[#4ca771]">
                          Thời gian bắt đầu:
                        </span>{" "}
                        {date(voucher.ReleaseTime)}
                      </p>
                      <p>
                        <span className="font-bold text-[#4ca771]">
                          Thời gian hết hạn:
                        </span>{" "}
                        {date(voucher.ExpiredTime)}
                      </p>
                    </div>
                    <div className="col-span-4 grid grid-rows-2 gap-2">
                      <Link
                        to={`/Partner/DetailVoucherPN/${voucher._id}`}
                        className="bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] px-4 py-2 rounded-lg flex items-center"
                      >
                        <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                        Detail
                      </Link>
                      <button
                        onClick={() => handleDeleteVoucher(voucher._id)}
                        className="bg-[#2F4F4F] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg flex items-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            : vouchers.map((voucher) =>
                voucher.haveVouchers.find(
                  (x) => x.Service_ID == selectedServices._id
                ) != undefined ? (
                  <div
                    key={voucher._id}
                    className=" w-full rounded-lg p-4 bg-[#c0e6b3] text-[#2F4F4F]"
                  >
                    <h2 className="text-2xl font-bold mb-3">{voucher.Name}</h2>
                    <div className="grid grid-cols-12">
                      <div className="col-span-8">
                        <p>{voucher.Description}</p>
                        <p>
                          <span className="font-bold text-[#4ca771]">
                            Số lượng còn lại:
                          </span>{" "}
                          {voucher.RemainQuantity}
                        </p>
                        <p>
                          <span className="font-bold text-[#4ca771]">
                            Thời gian bắt đầu:
                          </span>{" "}
                          {date(voucher.ReleaseTime)}
                        </p>
                        <p>
                          <span className="font-bold text-[#4ca771]">
                            Thời gian hết hạn:
                          </span>{" "}
                          {date(voucher.ExpiredTime)}
                        </p>
                      </div>
                      <div className="col-span-4 grid grid-rows-2 gap-2">
                        <Link
                          to={`/Partner/DetailVoucherPN/${voucher._id}`}
                          className="bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] px-4 py-2 rounded-lg flex items-center"
                        >
                          <FontAwesomeIcon
                            className="mr-2"
                            icon={faCircleInfo}
                          />
                          Detail
                        </Link>
                        <button
                          onClick={() => handleDeleteVoucher(voucher._id)}
                          className="bg-[#2F4F4F] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg flex items-center"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  console.log(voucher)
                )
              )}
        </div>
      </div>
    </div>
  );
};

export default ListVoucher;
