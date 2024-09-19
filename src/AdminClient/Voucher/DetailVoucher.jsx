import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const DetailVoucher = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handlestate = async (id) => {
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

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/Detailvoucher/${id}`);
      const data = await res.json();
      setData(data);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    DetailFetch();
  }, [id]);

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
  if (loading) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="w-auto h-full bg-white p-4">
        <h1 className="text-black text-4xl mb-4">Chi tiết voucher</h1>
        <div className="grid sm:grid-cols-2 grid-cols-1">
          <img
            className="w-auto rounded-xl h-auto object-cover"
            src={data.Image}
            alt="Car"
          />

          <div className=" w-full ml-4">
            <h1 className="text-2xl font-bold ">{data.Name}</h1>
            <div className="w-full border-b-2">
              <span className="text-2xl">{data._id}</span>
              <span
                className={`float-right text-xl text-black ${
                  data.Status === "enable" ? "text-green-500" : "text-red-500"
                }`}
              >
                Trạng thái: {data.Status}
              </span>
            </div>
            <div>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Ngày phát hành:</span>
                {date(data.ReleaseTime)}
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Ngày hết hạn:</span>
                {date(data.ExpiredTime)}
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Mô tả:</span>
                {data.Description}
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Số lượng còn lại:</span>
                {data.RemainQuantity}
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">
                  Giá trị tối thiểu để áp dụng voucher:{" "}
                </span>
                {data.MinValue}đ
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Giá trị giảm tối đa: </span>
                {data.MaxValue}đ
              </p>
              <p className="text-xl my-2">
                <span className="font-bold mr-1">Phần trăm giảm: </span>
                {data.PercentDiscount}%
              </p>
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
    </div>
  );
};

export default DetailVoucher;
