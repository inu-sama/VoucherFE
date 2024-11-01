import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const CreateVoucher = () => {
  const URL = "https://server-voucher.vercel.app/api";

  const [Voucher, setVoucher] = useState({
    _id: "",
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

    if (!condition.MinValue || !condition.MaxValue) {
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
      !Voucher._id ||
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
      const response = await fetch(`${URL}/createVoucherByPartner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
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
        navigate("/Partner/ListvoucherPN");
      } else {
        alert("Error: " + (data?.message || "Failed to create voucher"));
      }
    } catch (err) {
      console.error("Error creating voucher:", err);
      alert("An error occurred while creating the voucher");
    }
  };

  return (
    <div className="lg:bg-[#eaf9e7] bg-[#4ca771]">
      <div className="w-full bg-[#eaf9e7] p-4 px-10 rounded-t-xl">
        <h1 className="text-4xl text-[#2F4F4F] mb-10 mt-4 w-full text-center font-bold">
          Tạo voucher
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold">ID</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="text"
                  placeholder="Nhập mã voucher"
                  value={Voucher._id}
                  maxLength={10}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, _id: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold">Name</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="text"
                  placeholder="Nhập tên voucher"
                  value={Voucher.Name}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, Name: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
            <div className="col-span-12">
              <label className="font-bold">Description</label>
            </div>
            <div className="col-span-12">
              <input
                className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                type="text"
                placeholder="Nhập mô tả"
                value={Voucher.Description}
                onChange={(e) =>
                  setVoucher({ ...Voucher, Description: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold">Release Time</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="date"
                  value={Voucher.ReleaseTime}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, ReleaseTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold">Expired Time</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="date"
                  value={Voucher.ExpiredTime}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, ExpiredTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-5">
                <label className="font-bold line-clamp-1">
                  Discount Percentage
                </label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập phần trăm giảm giá"
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  name="PercentDiscount"
                  value={Voucher.PercentDiscount}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, PercentDiscount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] pl-4 rounded-lg h-12">
              <div className="col-span-5">
                <label className="font-bold">Quantity</label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập số lượng"
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  value={Voucher.RemainQuantity}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, RemainQuantity: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
            <div className="col-span-12">
              <label className="font-bold">Image</label>
            </div>
            <div className="col-span-12">
              <input
                placeholder="Nhập link ảnh"
                className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                type="text"
                value={Voucher.Image}
                onChange={(e) =>
                  setVoucher({ ...Voucher, Image: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mt-10 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-10 item-center border border-transparent border-t-[#c0e6ba]">
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-4">
                <label className="font-bold line-clamp-1">Min Value</label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập giá trị đơn hàng tối thiểu"
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  name="MinValue"
                  value={condition.MinValue}
                  onChange={handleConditionChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-4">
                <label className="font-bold line-clamp-1">Max Discount</label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập giá trị tối đa được giảm"
                  className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  name="MaxValue"
                  value={condition.MaxValue}
                  onChange={handleConditionChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 item-center">
            <div className="border-8 border-[#4ca771] rounded-lg h-fit">
              <div className="grid grid-cols-2 items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#2F4F4F] ml-4">
                    Conditions:
                  </h2>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="lg:col-span-2 border-2 border-[#4ca771] bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] px-4 py-2 rounded-bl-lg"
                    onClick={addCondition}
                  >
                    Add Condition
                  </button>
                </div>
              </div>
              <div className="mt-5 px-4">
                <ul>
                  {Voucher.Conditions.map((cond, index) => (
                    <li
                      key={index}
                      className="mb-2 text-[#4ca771] font-semibold"
                    >
                      <span className="text-[#2F4F4F] font-bold text-xl">
                        •{" "}
                      </span>
                      Giảm {Voucher.PercentDiscount}%, tối đa {cond.MaxValue}đ
                      cho đơn hàng từ {cond.MinValue}đ
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title text-lg text-[#eaf9e7] font-bold bg-[#4ca771] w-fit rounded-t-2xl px-10">
                  Select Services:
                </div>
                <div className="collapse-content bg-[#4ca771] rounded-r-2xl">
                  <div className="bg-gradient-to-r from-[#eaf9e7] to-[#4ca771] p-4 rounded-xl text-lg mt-4 max-h-36 overflow-scroll">
                    {services.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center text-[#2F4F4F]"
                      >
                        <input
                          type="checkbox"
                          id={service._id}
                          value={service._id}
                          checked={selectedServices.includes(service._id)}
                          onChange={handleServiceChange}
                          className="accent-[#4ac771]"
                        />
                        <label htmlFor={service._id} className="ml-2">
                          {service.ServiceName}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-12 gap-10 w-full justify-center">
            {/* <div className="col-span-1"></div> */}
            <div className="col-span-6">
              <button className="bg-[#4ca771] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] p-2 rounded-lg flex items-center justify-center w-full">
                Create
              </button>
            </div>
            <div className="col-span-3">
              <Link
                to="/Partner/Listvoucher"
                className="bg-[#2F4F4F] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-2 rounded-lg flex items-center justify-center w-full"
              >
                Back
              </Link>
            </div>
            <div className="col-span-3">
              <div>
                <div
                  className="hover:bg-[#c0e6ba] bg-[#eaf9e7] font-bold text-lg hover:text-[#eaf9e7] text-[#c0e6ba] border-2 border-[#c0e6ba] p-2 rounded-lg flex items-center justify-center w-full"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  {/* <FontAwesomeIcon icon={faBug} /> */}
                  <span className="ml-2">Report</span>
                </div>
                <dialog id="my_modal_1" className="modal">
                  <div className="modal-box bg-[#2F4F4F]">
                    <h3 className="font-bold text-xl text-[#eaf9e7]">
                      What's wrong?
                    </h3>
                    <div className="grid grid-cols-4 items-center bg-gradient-to-r from-[#eaf9e7] from-10% to-[#2F4F4F] text-[#2F4F4F] py-1 pl-4 rounded-lg h-12">
                      <div className="col-span-4">
                        <label className="font-bold">Lỗi gặp phải</label>
                      </div>
                      <div className="col-span-2 h-24">
                        <textarea
                          className="border-l-4 border-[#2F4F4F] bg-[#eaf9e7] outline-none px-2 py-2 h-full w-full rounded-2xl text-wrap resize-none"
                          placeholder="Mô tả vấn đề"
                          rows={5}
                          onChange={() => {}}
                        />
                      </div>
                    </div>
                    <div className="modal-action mt-7">
                      <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn bg-[#eaf9e7] hover:bg-[#2F4F4F] border-2 border-[#eaf9e7] text-[#2F4F4F] hover:text-[#eaf9e7]">
                          Close
                        </button>
                      </form>
                    </div>
                  </div>
                </dialog>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucher;
