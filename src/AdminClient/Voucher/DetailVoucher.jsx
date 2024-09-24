import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DetailVoucher = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const URL = "http://localhost:3000/api";

  const handlestate = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, {
        method: "POST",
      });
      const voucher = await res.json();
      if (res.status === 400) {
        alert("Error: " + (voucher.message || "Failed to update state"));
      } else {
        navigate(`/Editvoucher/${id}`);
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

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/DetailVoucher/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Dữ liệu nhận được:", data);
      setVoucher(data[0]);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("voucher updated:", voucher);
  }, [voucher]);

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const handleDeleteVoucher = async (id) => {
    try {
      const res = await fetch(`${URL}/deleteVoucher/${id}`, {
        method: "DELETE",
      });
      const voucher = await res.json();
      if (res.status === 200) {
        alert("Xóa voucher thành công");
        DetailFetch();
      } else {
        alert("Error: " + (voucher.message || "Failed to delete voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };
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
    <div className="w-full h-full bg-white p-4">
      <h1 className="text-black text-4xl mb-4">Chi tiết voucher</h1>
      <div className="grid sm:grid-cols-2 grid-cols-1">
        <img
          className="w-auto rounded-xl h-auto object-cover"
          src={voucher.Image}
          alt="Voucher"
        />
        <div className="w-full ml-4">
          <h1 className="text-2xl font-bold ">{voucher.Name}</h1>
          <div className="w-full border-b-2">
            <span className="text-2xl">{voucher._id}</span>
            <span
              className={`float-right text-xl text-black ${
                voucher.States === "enable" ? "text-green-500" : "text-red-500"
              }`}
            >
              Trạng thái: {voucher.States}
            </span>
          </div>
          <div>
            <p className="text-xl my-2">
              <span className="font-bold mr-1">Ngày phát hành:</span>
              {voucher.ReleaseTime ? date(voucher.ReleaseTime) : "N/A"}
            </p>
            <p className="text-xl my-2">
              <span className="font-bold mr-1">Ngày hết hạn:</span>
              {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
            </p>
            <p className="text-xl my-2">
              <span className="font-bold mr-1">Mô tả:</span>
              {voucher.Description || "N/A"}
            </p>
            <p className="text-xl my-2">
              <span className="font-bold mr-1">Số lượng còn lại:</span>
              {voucher.RemainQuantity || "N/A"}
            </p>
            <div className="my-4">
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
            </div>
            <div className="my-4">
              {voucher.haveVouchers && voucher.haveVouchers.length > 0 ? (
                voucher.haveVouchers.map((haveVoucher) => (
                  <div
                    key={haveVoucher._id}
                    className="border border-gray-200 rounded-lg p-2 mb-2"
                  >
                    <p>Service: {haveVoucher.Service_ID}</p>
                  </div>
                ))
              ) : (
                <p>toàn bộ service</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full justify-center space-x-4 m-2">
        <button
          onClick={() => handlestate(id)}
          className="bg-yellow-500 px-4 py-2 hover:bg-yellow-700 text-white font-bold rounded"
        >
          <FontAwesomeIcon icon={faEdit} /> Sửa
        </button>
        <button
          className="bg-red-500 px-4 py-2 hover:bg-red-700 text-white font-bold rounded"
          onClick={() => handleDeleteVoucher(id)}
        >
          <FontAwesomeIcon icon={faTrash} /> Xóa
        </button>
        <Link to={`/Listvoucher`}>
          <button className="bg-blue-500 px-4 py-2 hover:bg-blue-700 text-white font-bold rounded">
            <FontAwesomeIcon icon={faXmark} /> Cancel
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DetailVoucher;
