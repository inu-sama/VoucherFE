import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CreateVoucher = () => {
  const [Voucher, setVoucher] = useState({});
  const nagative = useNavigate();
  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (
      !Voucher.Name ||
      !Voucher.ExpiredTime ||
      !Voucher.ReleaseTime ||
      !Voucher.Description ||
      !Voucher.Image ||
      !Voucher.RemainQuantity ||
      !Voucher.MinValue ||
      !Voucher.MaxValue ||
      !Voucher.PercentDiscount
    ) {
      alert("Please fill all the fields");
    }
    try {
      const response = await fetch(
        "http://localhost:3000/api/createVoucherByAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(Voucher),
        }
      );

      const data = await response.json();
      if (response.status === 201 || response.status === 200) {
        alert("Voucher created successfully");
        nagative("/");
      } else {
        alert("Error: " + (data?.message || "Failed to create voucher"));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="w-full px-4">
      <div className="w-full">
        <h1 className=" text-3xl my-4 w-full text-center font-bold">
          Create Voucher
        </h1>
        <form onSubmit={HandleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="mr-2">Name:</label>
              <input
                className="border border-gray-300 outline-none px-2 h-full py-2 w-3/4 rounded-lg ml-auto"
                type="text"
                placeholder="Nhập tên voucher"
                onChange={(e) =>
                  setVoucher({ ...Voucher, Name: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">Description:</label>
              <input
                className="border border-gray-300 outline-none px-2 h-full w-3/4 rounded-lg ml-auto"
                type="text"
                placeholder="Nhập mô tả"
                onChange={(e) =>
                  setVoucher({ ...Voucher, Description: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="mr-2">Image</label>
              <input
                placeholder="Nhập link ảnh"
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="text"
                onChange={(e) =>
                  setVoucher({ ...Voucher, Image: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">Quantity:</label>
              <input
                placeholder="Nhập số lượng"
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="number"
                onChange={(e) =>
                  setVoucher({ ...Voucher, RemainQuantity: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="mr-2">Giá tiền tối thiểu sử dụng voucher</label>
              <input
                placeholder="Nhập số lượng tiền tối thiểu để áp dụng voucher"
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="number"
                onChange={(e) =>
                  setVoucher({ ...Voucher, MinValue: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">Mức giảm giá tối đa:</label>
              <input
                placeholder="Nhập số lượng tiền tối đa để áp dụng voucher"
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="number"
                onChange={(e) =>
                  setVoucher({ ...Voucher, MaxValue: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex mt-8 items-center">
            <label className="mr-2">PercentDiscount:</label>
            <input
              placeholder="Nhập phần trăm giảm giá"
              className="border border-gray-300 outline-none px-2 py-2 h-full w-full rounded-lg"
              type="number"
              onChange={(e) =>
                setVoucher({ ...Voucher, PercentDiscount: e.target.value })
              }
            />
          </div>
          <div className=" w-full flex justify-center">
            <button className="my-8 bg-blue-500 text-white px-4 py-2 rounded-lg">
              CreateVoucher
            </button>
            <Link
              to="/Listvoucher"
              className=" bg-yellow-500 my-8 text-white px-4 py-2 ml-2  rounded-lg"
            >
              Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucher;
