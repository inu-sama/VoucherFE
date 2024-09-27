import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ListVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const URL = "http://localhost:3000/api";
  const URL = "https://servervoucher.vercel.app/api";
  const navigate = useNavigate();

  const handleState = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status === 400) {
        alert("Error: " + (data?.message || "Failed to update state"));
      } else {
        navigate(`/Editvoucher/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${URL}/getVoucherByAdmin`);
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
      const res = await fetch(`${URL}/deleteVoucher/${id}`, {
        method: "DELETE",
      });
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
        <div className="float-right m-2 h-fit w-full">
          <Link
            to="/Createvoucher"
            className="float-right font-semibold bg-[#2F4F4F] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg"
          >
            Create Voucher
          </Link>
        </div>
        <div className="grid mx-2 grid-cols-1 lg:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
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
                    to={`/Detailvoucher/${voucher._id}`}
                    className="bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                    Detail
                  </Link>
                  {/* <button
                onClick={() => handleState(voucher._id)}
                className="bg-[#c6ac8e] text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FontAwesomeIcon className="mr-2" icon={faEdit} />
                Edit
              </button> */}
                  <button
                    onClick={() => handleDeleteVoucher(voucher._id)}
                    className="bg-[#2F4F4F] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
              {/* <div className="my-4">
              {voucher.conditions && voucher.conditions.length > 0 ? (
                voucher.conditions.map((condition) => (
                  <div
                    key={condition._id}
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                  >
                    <p>Giá trị tối thiểu: {condition.MinValue}đ</p>
                    <p>Giá trị tối đa: {condition.MaxValue}đ</p>
                    <p>Giảm giá: {condition.PercentDiscount}%</p>
                  </div>
                ))
              ) : (
                <p>Không có điều kiện áp dụng.</p>
              )}
            </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListVoucher;
