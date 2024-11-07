import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar } from "react-calendar";
import { AuthContext } from "../Router/ProtectedRoute";
import "react-calendar/dist/Calendar.css";

const EditVoucherPN = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Voucher, setVoucher] = useState({});
  const [ExpiredTime, setExpiredDate] = useState(null);
  const [ReleaseTime, setReleaseDate] = useState(null);
  const [showExpiredCalendar, setShowExpiredCalendar] = useState(false);
  const [showReleaseCalendar, setShowReleaseCalendar] = useState(false);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  const URL = " https://server-voucher.vercel.app/api";
  const navigate = useNavigate();

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  let nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 1);

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
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/Detailvoucher/${id}`);
      const data = await res.json();
      setData(data);
      setVoucher(data);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const updateCondition = async (conditionID) => {
    try {
      if (!minValue || !maxValue) {
        alert("Vui lòng nhập giá trị tối thiểu và tối đa");
        return;
      }
      const res = await fetch(`${URL}/updateCondition/${conditionID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MinValue: minValue,
          MaxValue: maxValue,
        }),
      });
      const data = await res.json();
      if (res.status === 400) {
        setError("Error: " + (data?.message || "Failed to update condition"));
      } else {
        setError("");
        alert("Condition updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVoucher = {
      PercentDiscount: Voucher.PercentDiscount || data.PercentDiscount,
      Description: Voucher.Description || data.Description,
      ExpiredTime: Voucher.ExpiredTime || data.ExpiredTime,
      ReleaseTime: Voucher.ReleaseTime || data.ReleaseTime,
      RemainQuantity: Voucher.RemainQuantity || data.RemainQuantity,
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
        navigate("/Partner/Listvoucher");
      }
    } catch (err) {
      alert("Error: " + (err.message || "Failed to update voucher"));
      console.log(err);
    }
  };
  if (loading) {
    return (
      <div className="bg-gradient-to-bl to-[#75bde0] from-[#eeeeee] h-full flex items-center justify-center">
        <span className="font-extrabold text-4xl text-center">Loading...</span>
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
    <div className="h-full">
      <div className="w-auto  bg-[#eaf9e7] p-4 bg-gradient-to-bl to-[#75bde0] from-30% h-full from-[#eeeeee]">
        <h1 className="text-4xl text-[#2F4F4F] px-4 mt-4 w-full text-left font-bold">
          Sửa voucher
        </h1>
        <p className="p-4 text-[#4c6fa7] w-full text-xl mb-10">
          <span className="font-bold">Chú ý:</span> Sửa những trường voucher mà
          bạn muốn
        </p>
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div className="w-full px-4 col-span-8">
            <h1 className="text-3xl font-bold text-[#2F4F4F] mb-5">
              {data.Name}
            </h1>
            <div className="w-full border-b-2">
              <span className="text-xl text-[#4c6fa7]">{data._id}</span>
              <span className="float-right font-bold text-xl text-[#4c6fa7]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    data.States === "enable" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.States}
                </span>
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="my-8 grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
                <div className="col-span-12">
                  <label className="font-bold text-[#3775A2]">
                    Description
                  </label>
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
                </div>
              </div>
              <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold text-[#3775A2]">
                      Release Time
                    </label>
                  </div>
                  <div
                    className="col-span-12 w-full"
                    onClick={toggleReleaseCalendar}
                  >
                    <span className="block border-2 border-[#75bde0] outline-none text-[#3b7097] placeholder:text-[#75bde0] py-[0.65rem] px-2 h-full w-full rounded-lg bg-[#ffffff]">
                      {ReleaseTime ? (
                        <span>{formatDate(ReleaseTime)}</span>
                      ) : (
                        <span>{formatDate(Voucher.ReleaseTime)}</span>
                      )}
                      {showReleaseCalendar && (
                        <div className="absolute mt-6 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4 w-fit">
                          <Calendar
                            onChange={handleReleaseDateChange}
                            value={ReleaseTime}
                            minDate={new Date()}
                          />
                        </div>
                      )}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold text-[#3775A2]">
                      Expired Time
                    </label>
                  </div>
                  <div
                    className="col-span-12 w-full"
                    onClick={toggleExpiredCalendar}
                  >
                    <span className="block border-2 border-[#75bde0] outline-none text-[#3b7097] placeholder:text-[#75bde0] py-[0.65rem] px-2 h-full w-full rounded-lg bg-[#ffffff]">
                      {ExpiredTime ? (
                        <span>{formatDate(ExpiredTime)}</span>
                      ) : (
                        <span>{formatDate(Voucher.ExpiredTime)}</span>
                      )}
                      {showExpiredCalendar && (
                        <div className="absolute mt-6 w-fit right-40 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4">
                          <Calendar
                            onChange={handExpiredDateChange}
                            value={ExpiredTime}
                            minDate={nextDate}
                          />
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Quantity</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      value={Voucher.RemainQuantity}
                      placeholder={`Số lượng còn lại: ${data.RemainQuantity}`}
                      className="border-2 border-[#75bde0] bg-white outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="number"
                      onChange={(e) =>
                        setVoucher({
                          ...Voucher,
                          RemainQuantity: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center bg-[#c6d6ff] text-[#3775A2] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Percent Discount</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      value={Voucher.PercentDiscount}
                      placeholder={`Phần trăm giảm giá: ${data.PercentDiscount}`}
                      className="border-2 border-[#75bde0] bg-white outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="number"
                      onChange={(e) =>
                        setVoucher({
                          ...Voucher,
                          PercentDiscount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="my-4">
                {data.conditions && data.conditions.length > 0 ? (
                  data.conditions.map((condition) => (
                    <div
                      key={condition._id}
                      className="grid grid-cols-12 shadow-inner shadow-[#bad7e6] rounded-lg py-2 px-4 mb-2 font-semibold bg-white"
                    >
                      <div className="col-span-5 grid grid-rows-2 gap-2">
                        <p className="text-[#4c6fa7] text-lg">
                          Giá trị tối thiểu:{" "}
                          <span className="text-[#4c6fa7] font-normal" id="min">
                            {formattedPrice(condition?.MinValue || 0)}
                          </span>
                        </p>
                        <p className="text-[#4c6fa7] text-lg">
                          Giá trị tối đa:{" "}
                          <span className="text-[#4c6fa7] font-normal" id="min">
                            {formattedPrice(condition?.MaxValue || 0)}
                          </span>
                        </p>
                      </div>
                      <div className="col-span-4 grid grid-rows-2 gap-2">
                        <input
                          type="number"
                          id="updateMin"
                          onChange={(e) => setMinValue(e.target.value)}
                          className="border-2 bg-white border-[#4c86a7] outline-none text-[#4c6fa7] px-4 rounded-lg"
                        />
                        <input
                          type="number"
                          id="updateMax"
                          onChange={(e) => setMaxValue(e.target.value)}
                          className="border-2 bg-white border-[#4c86a7] outline-none text-[#4c6fa7] px-4 rounded-lg"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end">
                        <div
                          id="updateCondition"
                          onClick={() => {
                            updateCondition(condition._id);
                          }}
                          className="py-4 px-8 bg-[#bad7e6] rounded-lg text-[#4c6fa7] font-bold cursor-pointer"
                        >
                          Update
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có điều kiện áp dụng.</p>
                )}
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

        <div className="mt-10 grid grid-cols-12 gap-10 w-full justify-center px-4">
          <div className="col-span-4">
            <button
              onClick={handleSubmit}
              className="bg-[#4c84a7] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#4c6fa7] border-2 border-[#4c86a7] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} /> Sửa
            </button>
          </div>
          <div className="col-span-4">
            <Link
              to={`/Partner/DetailvoucherPN/${id}`}
              className="bg-[#2f464f] hover:bg-[#e7f4f9] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-2" /> Cancel Edit
            </Link>
          </div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </div>
  );
};

export default EditVoucherPN;
