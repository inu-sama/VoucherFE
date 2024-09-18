import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ListVoucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Url = "http://localhost:3000/api";
  const navigate = useNavigate();

  const handleState = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/updateState/${id}`, {
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
      const res = await fetch(`${Url}/getVoucherByAdmin`);
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
      const res = await fetch(`${Url}/deleteVoucher/${id}`, {
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-auto my-2">
      <h1 className=" text-3xl my-4 w-full text-center font-bold">
        Danh sách voucher
      </h1>
      <div className=" float-right m-2 h-fit w-full">
        <Link
          to="/Createvoucher"
          className=" float-right bg-green-500 text-white px-4 py-2  rounded-lg"
        >
          CreateVoucher
        </Link>
      </div>
      <div className="grid mx-2 grid-cols-1 sm:grid-cols-2 gap-4">
        {vouchers.map((voucher) => (
          <div
            key={voucher._id}
            className="border border-gray-300 w-full rounded-lg p-4"
          >
            <h2 className="text-2xl font-bold">{voucher.Name}</h2>
            <p>{voucher.Description}</p>
            <p>Giá trị giảm: {voucher.PercentDiscount}%</p>
            <p>Giá trị tối thiểu: {voucher.MinValue}</p>
            <p>Giá trị tối đa: {voucher.MaxValue}</p>
            <p>Số lượng còn lại: {voucher.RemainQuantity}</p>
            <p>
              Thời gian hết hạn:
              {date(voucher.ExpiredTime)}
            </p>
            <div className="grid sm:grid-cols-3 grid-cols-2">
              <button className="my-8 bg-blue-500 text-white px-4 py-2 rounded-lg">
                <Link to={`/Detailvoucher/${voucher._id}`}>
                  <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                  Detail
                </Link>
              </button>
              <button
                onClick={() => handleState(voucher._id)}
                className="my-8 mx-4 bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                <FontAwesomeIcon className="mr-2" icon={faEdit} />
                Edit
              </button>
              <button
                onClick={() => handleDeleteVoucher(voucher._id)}
                className="my-8 bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListVoucher;
