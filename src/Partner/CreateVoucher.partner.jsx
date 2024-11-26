import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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
  });

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const Token = localStorage.getItem("Token");
  const navigate = useNavigate();

  const [ExpiredTime, setExpiredDate] = useState(null);
  const [ReleaseTime, setReleaseDate] = useState(null);
  const [showExpiredCalendar, setShowExpiredCalendar] = useState(false);
  const [showReleaseCalendar, setShowReleaseCalendar] = useState(false);

  const formatDate = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const nextDate = (a) => {
    const result = new Date(a);
    result.setDate(a.getDate() + 1);
    return result;
  };

  const toggleExpiredCalendar = (e) => {
    e.preventDefault();
    setShowExpiredCalendar(!showExpiredCalendar);
  };

  const toggleReleaseCalendar = (e) => {
    e.preventDefault();
    setShowReleaseCalendar(!showReleaseCalendar);
  };

  const handExpiredDateChange = (date) => {
    setExpiredDate(date);
    setShowExpiredCalendar(!showExpiredCalendar);
  };

  const handleReleaseDateChange = (date) => {
    setReleaseDate(date);
    setShowReleaseCalendar(!showReleaseCalendar);
    setShowExpiredCalendar(!showExpiredCalendar);
  };

  const fetchServices = async () => {
    try {
      const response1 = await fetch(`${URL}/readtoken`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      if (!response1.ok) {
        throw new Error(
          `Error fetching token: ${response1.status} ${response1.statusText}`
        );
      }

      const dataToken = await response1.json();
      const serviceId = dataToken.PartnerService[0].serviceId;

      const response = await fetch(`${URL}/getServiceID/${serviceId}`);

      if (!response.ok) {
        throw new Error(
          `Error fetching services: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const deleteCondition = (indexToDelete) => {
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      Conditions: prevVoucher.Conditions.filter((_, i) => i !== indexToDelete),
    }));
  };

  const formatPriceInput = (price) => {
    const numericPrice = parseInt(price, 10) || 0;
    return numericPrice.toLocaleString("vi-VN");
  };

  const handleConditionChange = (e) => {
    let { name, value } = e.target;
    const numericValue = value.replace(/[^\d]/g, "");

    if (value === null || value < 0) {
      value = 0;
    } else if (parseInt(numericValue, 10) > 99999999) {
      return;
    }
    setCondition((prev) => ({ ...prev, [name]: numericValue }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setCondition((prev) => ({
      ...prev,
      [name]: value.replace(/[^\d]/g, ""),
    }));
  };

  const handleKeyPress = (e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const addCondition = () => {
    if (Voucher.Conditions.length >= 3) {
      alert("You can't add more than 3 conditions");
      return;
    }

    if (!condition.MaxValue) {
      alert("Please fill all the condition fields");
      return;
    }

    setVoucher((prev) => ({
      ...prev,
      Conditions: [...prev.Conditions, condition],
    }));

    setCondition({ MinValue: "", MaxValue: "" });
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
      !Voucher.Image ||
      !Voucher.Name ||
      !Voucher.Description ||
      !Voucher.PercentDiscount ||
      !Voucher.RemainQuantity ||
      !Voucher.Conditions ||
      !selectedServices ||
      !ReleaseTime ||
      !ExpiredTime
    ) {
      alert("Please fill in all fields");
    }
    if (!Voucher._id) {
      Voucher._id = Math.random().toString(36).substring(5);
    }

    const formdata = new FormData();
    const imageFile = Voucher.Image;
    formdata.append("voucher", imageFile);
    formdata.append("_id", Voucher._id);
    formdata.append("Name", Voucher.Name);
    formdata.append("ReleaseTime", ReleaseTime);
    formdata.append("ExpiredTime", ExpiredTime);
    formdata.append("Description", Voucher.Description);
    formdata.append("RemainQuantity", Number(Voucher.RemainQuantity));
    formdata.append("PercentDiscount", Number(Voucher.PercentDiscount));

    Voucher.Conditions.forEach((cond, index) => {
      formdata.append(`Conditions[${index}][MinValue]`, Number(cond.MinValue));
      formdata.append(`Conditions[${index}][MaxValue]`, Number(cond.MaxValue));
    });

    selectedServices.forEach((serviceId, index) => {
      formdata.append(`HaveVouchers[${index}][Service_ID]`, serviceId);
    });

    try {
      const response = await fetch(`${URL}/createVoucherByPartner`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
        body: formdata,
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
    <div className="lg:bg-[#e7eef9] bg-[#e7eef9]">
      <div className="w-full bg-[#e7eef9] p-4 px-10 bg-gradient-to-bl to-[#75bde0] from-30% from-[#eeeeee]">
        <h1 className="text-4xl text-[#274f6c] mb-10 mt-4 w-full text-center font-bold">
          Tạo voucher
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold text-[#3775A2]">Mã Voucher</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 placeholder-[#5b91de] border-[#bad3e6] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
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
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12 my-2">
              <div className="col-span-12">
                <label className="font-bold text-[#3775A2]">Name</label>
              </div>
              <div className="col-span-12">
                <input
                  className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="text"
                  placeholder="Nhập tên voucher"
                  value={Voucher.Name}
                  onChange={(e) =>
                    setVoucher({ ...Voucher, Name: e.target.value })
                  }
                />
                {!Voucher.Name && (
                  <p className="text-red-500 text-sm font-bold">
                    Please enter a name
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12 ">
            <div className="col-span-12">
              <label className="font-bold text-[#3775A2]">Description</label>
            </div>
            <div className="col-span-12">
              <input
                className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                type="text"
                placeholder="Nhập mô tả"
                value={Voucher.Description}
                onChange={(e) =>
                  setVoucher({ ...Voucher, Description: e.target.value })
                }
              />
              {!Voucher.Description && (
                <p className="text-red-500 text-sm font-bold">
                  Please enter a description
                </p>
              )}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold text-[#3775A2]">Release Time</label>
              </div>
              <div
                className="col-span-12 w-full"
                onClick={toggleReleaseCalendar}>
                <span className="block border-2 border-[#75bde0] outline-none text-[#3b7097] placeholder:text-[#75bde0] py-[0.65rem] px-2 h-full w-full rounded-lg bg-[#ffffff]">
                  {ReleaseTime ? (
                    <span>{formatDate(ReleaseTime)}</span>
                  ) : (
                    <span>Chọn ngày </span>
                  )}
                  {showReleaseCalendar && (
                    <div
                      className="absolute mt-6 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4 w-fit"
                      onClick={(e) => e.stopPropagation()}>
                      <Calendar
                        onChange={handleReleaseDateChange}
                        value={ReleaseTime}
                        minDate={nextDate(new Date())}
                      />
                    </div>
                  )}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-12">
                <label className="font-bold text-[#3775A2]">Expired Time</label>
              </div>
              <div
                className="col-span-12 w-full"
                onClick={toggleExpiredCalendar}>
                <span className="block border-2 border-[#75bde0] outline-none text-[#3b7097] placeholder:text-[#75bde0] py-[0.65rem] px-2 h-full w-full rounded-lg bg-[#ffffff]">
                  {ExpiredTime ? (
                    <span>
                      {ReleaseTime > ExpiredTime
                        ? "Chọn ngày"
                        : formatDate(ExpiredTime)}
                    </span>
                  ) : (
                    <span>Chọn ngày</span>
                  )}
                  {showExpiredCalendar && (
                    <div
                      className="absolute mt-6 w-fit right-40 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4"
                      onClick={(e) => e.stopPropagation()}>
                      <Calendar
                        onChange={handExpiredDateChange}
                        value={ExpiredTime}
                        minDate={nextDate(ReleaseTime || new Date())}
                      />
                    </div>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] pl-4 rounded-lg h-12 my-2">
              <div className="col-span-5">
                <label className="font-bold text-[#3775A2] line-clamp-1">
                  Discount Percentage
                </label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder={
                    Voucher.PercentDiscount === 0
                      ? "Nhập phần trăm giảm giá"
                      : Voucher.PercentDiscount
                  }
                  className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  max={99}
                  name="PercentDiscount"
                  value={Voucher.PercentDiscount || "Nhập phần trăm giảm giá"}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value.length <= 2) {
                      setVoucher({
                        ...Voucher,
                        PercentDiscount: Number(value),
                      });
                    }
                  }}
                />

                {!Voucher.PercentDiscount && (
                  <p className="text-red-500 text-sm font-bold">
                    Please enter a discount percentage
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] pl-4 rounded-lg h-12 my-2">
              <div className="col-span-5">
                <label className="font-bold text-[#3775A2] line-clamp-1">
                  Quantity
                </label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder={
                    Voucher.RemainQuantity == 0
                      ? "Nhập phần số lượng voucher"
                      : Voucher.RemainQuantity
                  }
                  className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="number"
                  name="RemainQuantity"
                  value={Voucher.RemainQuantity || "Nhập số lượng voucher"}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value.length <= 5) {
                      setVoucher({
                        ...Voucher,
                        RemainQuantity: Number(e.target.value),
                      });
                    }
                  }}
                  onInput={(e) => {
                    e.target.value = Math.round(e.target.value);
                  }}
                />
                {!Voucher.RemainQuantity && (
                  <p className="text-red-500 text-sm font-bold">
                    Please enter a quantity
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
            <div className="col-span-12">
              <label className="font-bold text-[#3775A2]">Image</label>
            </div>
            <div className="col-span-12">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setVoucher({ ...Voucher, Image: e.target.files[0] })
                }
                className="file-input outline-none file:border-0 file:rounded-full file:shadow-md file:shadow-[#ffffff] file:text-[#5b91de] file:bg-[#ffffff] w-full bg-[#ffffff] shadow-md shadow-[#ffffff] text-[#5b91de] placeholder-[#5b91de] text-lg rounded-full"
              />
              {!Voucher.Image && (
                <p className="text-red-500 text-sm my-2 font-bold">
                  Please upload an image
                </p>
              )}
            </div>
          </div>
          <div className="mt-12 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-10 item-center">
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-4">
                <label className="font-bold w-full text-[#3775A2] line-clamp-1">
                  Số tiền tối thiểu
                </label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập giá trị đơn hàng tối thiểu để giám giá"
                  className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="text"
                  name="MinValue"
                  value={formatPriceInput(condition.MinValue)}
                  onKeyPress={handleKeyPress}
                  onChange={handleConditionChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
              <div className="col-span-4">
                <label className="font-bold text-[#3775A2] line-clamp-1">
                  Số tiền tối đa giảm
                </label>
              </div>
              <div className="col-span-12">
                <input
                  placeholder="Nhập giá trị tối đa được giảm"
                  className="border-2 placeholder-[#5b91de] border-[#c6d6ff] outline-none px-2 py-2 h-full w-full rounded-lg bg-white"
                  type="text"
                  name="MaxValue"
                  value={formatPriceInput(condition.MaxValue)}
                  onKeyPress={handleKeyPress}
                  onChange={handleConditionChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 item-center">
            <div className="border-8 border-[#4c89a7] rounded-lg h-fit">
              <div className="grid grid-cols-2 items-center">
                <div>
                  <h2 className="text-xl font-bold text-[#3775A2] ml-4">
                    Conditions:
                  </h2>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="lg:col-span-2 border-2 border-[#4c83a7] bg-[#4c84a7] hover:bg-[#e7f3f9] text-[#e7f1f9] hover:text-[#4c83a7] px-4 py-2 rounded-bl-lg"
                    onClick={addCondition}>
                    Add Condition
                  </button>
                </div>
              </div>
              <div className="mt-5 px-4">
                <span className="mb-2 text-xl text-[#4c84a7] font-semibold">
                  <span className=" font-bold text-xl text-black">•</span> Giảm
                  giá {Voucher.PercentDiscount}%
                </span>
                <ul>
                  {Voucher.Conditions.map((cond, index) => (
                    <li
                      key={index}
                      className="mb-2 text-xl text-[#4c84a7] font-semibold">
                      <span className="text-[#2F4F4F] font-bold text-xl">
                        •{" "}
                      </span>
                      Tối đa {formattedPrice(cond.MaxValue)} cho đơn hàng từ{" "}
                      {formattedPrice(cond.MinValue)}
                      <button
                        className="float-right"
                        onClick={() => deleteCondition(index)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <div className="collapse">
                <input type="checkbox" />
                <div className="collapse-title text-lg text-[#eaf9e7] font-bold bg-[#4c84a7] w-fit rounded-t-2xl px-10">
                  Select Services:
                </div>
                <div className="collapse-content bg-[#4c84a7] rounded-r-2xl">
                  <div className="bg-gradient-to-r from-[#eaf9e7] to-[#5ca0ca] p-4 rounded-xl text-lg mt-4 max-h-36 overflow-scroll">
                    <div className="flex items-center text-[#2F4F4F]">
                      <input
                        type="checkbox"
                        id={services.id}
                        value={services.id}
                        checked={selectedServices.includes(services.id)}
                        onChange={handleServiceChange}
                        className="accent-[#4ac771]"
                      />
                      <label
                        htmlFor={services.id}
                        className="ml-2 text-[#2e6bb1]">
                        {services.name}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex gap-10 w-full justify-center">
            {/* <div className="col-span-1"></div> */}
            <div className="w-1/2">
              <button className="bg-[#3B7097] hover:bg-[#e7eef9] font-bold text-lg text-[#e7eef9] hover:text-[#3B7097] border-2 border-[#3B7097] p-2 rounded-lg flex items-center justify-center w-full">
                Create
              </button>
            </div>
            <div className="w-1/2">
              <Link
                to="/Partner/ListVoucherPN"
                className="bg-[#2f414f] hover:bg-[#e7eef9] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-2 rounded-lg flex items-center justify-center w-full">
                Back
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateVoucher;
