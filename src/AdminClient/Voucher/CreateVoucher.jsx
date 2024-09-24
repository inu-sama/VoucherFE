import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreateVoucher = () => {
  const URL = "http://localhost:3000/api";

  const [Voucher, setVoucher] = useState({
    Name: "",
    ReleaseTime: "",
    ExpiredTime: "",
    Description: "",
    Image: "",
    RemainQuantity: 0,
    MinValue: 0,
    MaxValue: 0,
    PercentDiscount: 0,
    Conditions: [],
    HaveVouchers: [],
  });

  const [condition, setCondition] = useState({
    MinValue: "",
    MaxValue: "",
    PercentDiscount: "",
  });

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

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

  const handleConditionChange = (e) => {
    const { name, value } = e.target;
    setCondition((prev) => ({ ...prev, [name]: value }));
  };

  const addCondition = () => {
    if (Voucher.Conditions.length >= 3) {
      alert("You can't add more than 3 conditions");
      return;
    }

    if (
      !condition.MinValue ||
      !condition.MaxValue ||
      !condition.PercentDiscount
    ) {
      alert("Please fill all the condition fields");
      return;
    }

    setVoucher((prev) => ({
      ...prev,
      Conditions: [...prev.Conditions, condition],
    }));

    setCondition({ MinValue: "", MaxValue: "", PercentDiscount: "" });
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setSelectedServices((prev) =>
      checked ? [...prev, value] : prev.filter((id) => id !== value)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !Voucher.Name ||
      !Voucher.ExpiredTime ||
      !Voucher.ReleaseTime ||
      !Voucher.Description ||
      !Voucher.Image ||
      !Voucher.RemainQuantity ||
      !Voucher.Conditions.length ||
      !selectedServices.length
    ) {
      alert(
        "Please fill all the fields, add at least one condition, and select at least one service"
      );
      return;
    }

    try {
      const response = await fetch(`${URL}/createVoucherByAdmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...Voucher,
          HaveVouchers: selectedServices.map((serviceId) => ({
            Service_ID: serviceId,
          })),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Voucher created successfully");
        navigate("/Listvoucher");
      } else {
        alert("Error: " + (data?.message || "Failed to create voucher"));
      }
    } catch (err) {
      console.error("Error creating voucher:", err);
      alert("An error occurred while creating the voucher");
    }
  };

  return (
    <div className="w-full px-4">
      <div className="w-full">
        <h1 className="text-3xl my-4 w-full text-center font-bold">
          Create Voucher
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center">
              <label className="mr-2">Name:</label>
              <input
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="text"
                placeholder="Nhập tên voucher"
                value={Voucher.Name}
                onChange={(e) =>
                  setVoucher({ ...Voucher, Name: e.target.value })
                }
              />
            </div>
            <div className="flex items-center">
              <label className="mr-2">Description:</label>
              <input
                className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                type="text"
                placeholder="Nhập mô tả"
                value={Voucher.Description}
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
                value={Voucher.ExpiredTime}
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
                value={Voucher.ReleaseTime}
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
                value={Voucher.Image}
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
                value={Voucher.RemainQuantity}
                onChange={(e) =>
                  setVoucher({ ...Voucher, RemainQuantity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="items-center">
              <div className="flex">
                <label className="mr-2">Min Value:</label>
                <input
                  placeholder="Nhập giá trị tối thiểu"
                  className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                  type="number"
                  name="MinValue"
                  value={condition.MinValue}
                  onChange={handleConditionChange}
                />
              </div>
              <p className="text-red-500">*bỏ trống nếu áp dụng mọi giá</p>
            </div>
            <div className="items-center">
              <div className="flex">
                <label className="mr-2">Max Value:</label>
                <input
                  placeholder="Nhập giá trị tối đa"
                  className="border border-gray-300 outline-none px-2 py-2 h-full w-3/4 rounded-lg ml-auto"
                  type="number"
                  name="MaxValue"
                  value={condition.MaxValue}
                  onChange={handleConditionChange}
                />
              </div>
              <p className="text-red-500">*bỏ trống nếu áp dụng mọi giá</p>
            </div>
          </div>

          <div className="flex mt-8 items-center">
            <label className="mr-2">Percent Discount:</label>
            <input
              placeholder="Nhập phần trăm giảm giá"
              className="border border-gray-300 outline-none px-2 py-2 h-full w-full rounded-lg"
              type="number"
              name="PercentDiscount"
              value={condition.PercentDiscount}
              onChange={handleConditionChange}
            />
            <button
              type="button"
              className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg"
              onClick={addCondition}
            >
              Add Condition
            </button>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-semibold">Conditions:</h2>
            <ul>
              {Voucher.Conditions.map((cond, index) => (
                <li key={index} className="mb-2">
                  Min: {cond.MinValue} | Max: {cond.MaxValue} | Discount:{" "}
                  {cond.PercentDiscount}%
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold">Select Services:</h2>
            {services.map((service) => (
              <div key={service._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={service._id}
                  value={service._id}
                  checked={selectedServices.includes(service._id)}
                  onChange={handleServiceChange}
                />
                <label htmlFor={service._id} className="ml-2">
                  {service.ServiceName}
                </label>
              </div>
            ))}
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
