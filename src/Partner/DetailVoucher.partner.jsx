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
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const Token = localStorage.getItem("Token");

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
  };

  const [report, setReport] = useState({
    Content: "",
    Voucher_ID: id,
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({
      ...report,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://server-voucher.vercel.app/api/createReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Token}`,
          },
          body: JSON.stringify(report), // Gửi dữ liệu dưới dạng JSON
        }
      );

      if (!response.ok) {
        throw new Error("Không thể tạo báo cáo, vui lòng thử lại.");
      }

      const result = await response.json();

      setReport({
        _id: result._id,
        Content: "",
        Voucher_ID: "",
        ReportedBy: "",
      }); // Reset form nếu cần
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
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
          navigate("/Partner/ListVoucherPN");
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
      <div className="bg-gradient-to-bl to-[#75bde0] from-[#eeeeee] h-full flex items-center justify-center">
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
    <div className="lg:bg-[#e7eef9] bg-[#e7eef9] h-full">
      <div className="w-full bg-gradient-to-bl to-[#75bde0] h-full from-30% from-[#eeeeee] p-4 ">
        <div className="grid grid-cols-12 text-[#3f5f89]">
          <div className="col-span-11 flex items-center">
            <h1 className="text-4xl mt-10 mb-10 w-full text-left font-bold lg:px-10 px-0">
              Chi tiết voucher
            </h1>
          </div>
          <div className="col-span-1 pr-2 flex items-center ">
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
              <span className="font-bold text-[#3f5f89] lg:block hidden ">
                Hạn sử dụng:
              </span>
              <span className="text-[#3f5f89] lg:text-left text-center lg:w-fit w-full">
                {voucher.ReleaseTime ? date(voucher.ReleaseTime) : "N/A"}
                <span> - </span>
                {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
              </span>
            </p>
          </div>
          <div className="w-full text-[#3B7097]">
            <h1 className="text-3xl font-bold mb-2">{voucher.Name}</h1>
            <div className="w-full border-b border-[#3B7097] mb-10">
              <span className="text-xl text-[#3f5f89]">{voucher._id}</span>
              <span className="float-right font-bold text-xl text-[#3f5f89]">
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
                <span className="font-bold text-[#3f5f89]">
                  Số lượng còn lại:{" "}
                </span>
                <span className=" text-[#3f5f89]">
                  {voucher.RemainQuantity || "N/A"}
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#3f5f89]">Mức giảm: </span>
                <span className=" text-[#3f5f89]">
                  {voucher.PercentDiscount || "N/A"}%
                </span>
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#3f5f89]">Mô tả: </span>
                <span className=" text-[#3f5f89]">
                  {voucher.Description || "N/A"}
                </span>
              </p>
              <div className="my-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-center rtl:text-center text-lg text-white dark:text-[#2a5879]">
                    <thead className="text-sm text-gray-700 uppercase  dark:bg-[#8AC5E2] dark:text-[#2a5879]">
                      <tr className="text-lg">
                        <th
                          scope="col"
                          className="px-6 py-3 whitespace-nowrap lg:block hidden"
                        >
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
                              className="odd:bg-[#D9E6EB] odd:dark:bg-[#D9E6EB] even:bg-gray-50 even:dark:bg-[#C9DEE9] border-b dark:border-[#baccd6] text-md"
                            >
                              <td className="px-6 py-4 lg:block hidden">
                                {index + 1}
                              </td>
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
              <div className="my-4 bg-[#c5e2eb] shadow-inner shadow-[#82C0DF] rounded-lg p-2 mb-5">
                {voucher.haveVouchers && voucher.haveVouchers.length > 0 ? (
                  voucher.haveVouchers.map((haveVoucher) => (
                    <div key={haveVoucher._id}>
                      <p>
                        <span className="text-[#3f5f89] text-xl font-semibold">
                          Service:
                        </span>{" "}
                        <span className="text-[#3f5f89] text-xl font-normal">
                          {serviceNames[haveVoucher.Service_ID] || "Loading..."}
                        </span>
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#3f5f89] font-semibold">
                    Toàn bộ service
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 grid-cols-2  lg:gap-10 gap-4 w-full mt-10">
          <div className="">
            <Link
              to={`/Partner/EditVoucherPN/${id}`}
              className="bg-[#3f5f89] hover:bg-[#daf9fe] font-bold text-lg text-[#eaf9e7] hover:text-[#3f5f89] border-2 border-[#326080] p-5 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} />
              <span className="ml-2">Edit</span>
            </Link>
          </div>
          <div className=" ">
            <button
              className="bg-[#2f434f] hover:bg-[#e7f2f9] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handleDeleteVoucher(id)}
            >
              <FontAwesomeIcon icon={faTrash} />
              <span className="ml-2">Delete</span>
            </button>
          </div>
          <div className="">
            <button
              className="bg-[#3bb0b0] hover:bg-[#e7eff9] font-bol outline-none text-lg text-[#eaf9e7] hover:text-[#3bb0b0] border-2 border-[#3bb0b0] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={() => handlestate(id)}
            >
              <FontAwesomeIcon icon={faWrench} />
              <span className="ml-2"> State</span>
            </button>
          </div>
          <div className="">
            <button
              className="bg-[#75BDDF] hover:bg-[#e7eff9] font-bol outline-none text-lg text-[#ffffff] hover:text-[#2d8585] border-2 border-[#75BDDF] p-5 rounded-lg flex items-center justify-center w-full"
              onClick={toggleOverlay}
            >
              <FontAwesomeIcon icon={faWrench} />
              <span className="ml-2"> Report</span>
            </button>
          </div>
        </div>
      </div>
      {isOverlayOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 w-full">
          <div className="relative bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <button
              onClick={toggleOverlay}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Nội dung form */}
            <div className="form-group w-full">
              <label
                htmlFor="Content"
                className="block font-medium text-gray-700 text-2xl my-2"
              >
                Nội dung:
              </label>
              <textarea
                id="Content"
                name="Content"
                value={report.Content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung báo cáo"
                required
                className="w-full bg-white max-h-80 min-h-40 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Báo cáo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailVoucher;
