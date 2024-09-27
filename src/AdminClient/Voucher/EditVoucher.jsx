import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const EditVoucher = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Voucher, setVoucher] = useState({});
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
        navigate("/Listvoucher");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/Detailvoucher/${id}`);
      const data = await res.json();
      setData(data[0]);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVoucher = {
      PercentDiscount: Voucher.PercentDiscount || data.PercentDiscount,
      Description: Voucher.Description || data.Description,
      ExpiredTime: Voucher.ExpiredTime || data.ExpiredTime,
      ReleaseTime: Voucher.ReleaseTime || data.ReleaseTime,
      Image: Voucher.Image || data.Image,
      RemainQuantity: Voucher.RemainQuantity || data.RemainQuantity,
      MinValue: Voucher.MinValue || data.MinValue,
      MaxValue: Voucher.MaxValue || data.MaxValue,
    };

    try {
      const res = await fetch(`${URL}/updateVoucher/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVoucher),
      });
      const result = await res.json();
      if (!res.ok) {
        alert("Error: " + (result.message || "Failed to update voucher"));
      } else {
        const res1 = await fetch(`${URL}/updateState/${id}`, {
          method: "POST",
        });
        const data = await res1.json();
        if (res.status === 400) {
          alert("Error: " + (data?.message || "Failed to update state"));
        }
        alert("Voucher updated successfully");
        navigate("/Listvoucher");
      }
    } catch (err) {
      alert("Error: " + (err.message || "Failed to update voucher"));
      console.log(err);
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
      <div className="w-auto h-full bg-[#eaf9e7] p-4">
        <h1 className="text-4xl text-[#2F4F4F] mb-10 mt-4 w-full text-left font-bold">
          Sửa voucher
        </h1>
        <p className="my-4 text-red-500 w-full text-xl ">
          Chú ý: Sửa những trường voucher mà bạn muốn
        </p>
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div className=" w-full ml-4 col-span-8">
            <h1 className="text-2xl font-bold ">{data.Name}</h1>
            <div className="w-full border-b-2">
              <span className="text-2xl">{data._id}</span>
              <span
                className={`float-right text-xl text-black ${
                  data.States === "enable" ? "text-green-500" : "text-red-500"
                }`}
              >
                Trạng thái: {data.States}
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 my-2 gap-4">
                <div className="flex items-center">
                  <label className="mr-2">Description:</label>
                  <input
                    className="border border-gray-300 outline-none px-2 h-full w-3/4 rounded-lg ml-auto"
                    type="text"
                    placeholder={data.Description}
                    onChange={(e) =>
                      setVoucher({ ...Voucher, Description: e.target.value })
                    }
                  ></input>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="mr-2">Release Time:</label>
                  <input
                    className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                    type="date"
                    onChange={(e) =>
                      setVoucher({ ...Voucher, ReleaseTime: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Expired Time:</label>
                  <input
                    className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                    type="date"
                    onChange={(e) =>
                      setVoucher({ ...Voucher, ExpiredTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <label className="mr-2">Image</label>
                  <input
                    placeholder={data.Image}
                    className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                    type="text"
                    onChange={(e) =>
                      setVoucher({ ...Voucher, Image: e.target.value })
                    }
                  ></input>
                </div>
                <div className="flex items-center">
                  <label className="mr-2">Quantity:</label>
                  <input
                    placeholder={`Số lượng còn lại: ${data.RemainQuantity}`}
                    className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                    type="number"
                    onChange={(e) =>
                      setVoucher({ ...Voucher, RemainQuantity: e.target.value })
                    }
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="p-10 lg:col-span-4">
            <img
              className="w-auto rounded-xl h-auto object-cover"
              src={data.Image}
              alt="Car"
            />
          </div>
        </div>
        <div className="flex w-full justify-center space-x-4 m-2">
          <button
            onClick={handleSubmit}
            className="bg-yellow-500 my-8 px-4 py-2 hover:bg-yellow-700 text-white font-bold rounded"
          >
            <FontAwesomeIcon icon={faEdit} /> Sửa
          </button>
          <button
            onClick={() => handleState(id)}
            className="my-8 mx-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            <FontAwesomeIcon icon={faXmark} className="mr-2" /> Cancel Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditVoucher;
