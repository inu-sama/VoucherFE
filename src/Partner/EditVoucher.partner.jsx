import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar } from "react-calendar";
import { AuthContext } from "../Router/ProtectedRoute";
import "react-calendar/dist/Calendar.css";

const EditVoucherPN = () => {
  const { id } = useParams();
  const URL = "http://localhost:3000/api";
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Voucher, setVoucher] = useState({});
  const [ExpiredTime, setExpiredDate] = useState(null);
  const [ReleaseTime, setReleaseDate] = useState(null);
  const [showExpiredCalendar, setShowExpiredCalendar] = useState(false);
  const [showReleaseCalendar, setShowReleaseCalendar] = useState(false);
  const [updatedConditions, setUpdatedConditions] = useState([]);
  const navigate = useNavigate();

  const OnChangeMinValue = (idCondition, e) => {
    let { value } = e.target;
    value =
      value && !isNaN(value) && value >= 0
        ? parseInt(value)
        : data.conditions.find((item) => item.idCondition === idCondition)
            ?.MinValue;

    setUpdatedConditions((prev) =>
      prev.map((item) =>
        item.idCondition === idCondition ? { ...item, MinValue: value } : item
      )
    );
  };

  const OnChangeMaxValue = (e, idCondition) => {
    let { value } = e.target;
    console.log("checkmax", value);
    value =
      value && !isNaN(value) && value >= 0
        ? parseInt(value)
        : data.conditions.find((item) => item.idCondition === idCondition)
            ?.MaxValue;

    setUpdatedConditions((prev) =>
      prev.map((item) =>
        item.idCondition === idCondition ? { ...item, MaxValue: value } : item
      )
    );
  };

  useEffect(() => {
    if (data.conditions && data.conditions.length > 0) {
      const initialConditions = data.conditions.map((condition) => ({
        idCondition: condition._id,
        MinValue: condition.MinValue,
        MaxValue: condition.MaxValue,
      }));
      setUpdatedConditions(initialConditions);
    }
  }, [data.conditions]);

  const updateConditions = async () => {
    try {
      updatedConditions.forEach((condition) => {
        const { idCondition, MinValue, MaxValue } = condition;
        console.log(idCondition, MinValue, MaxValue);
      });

      const updatePromises = updatedConditions.map((condition) => {
        const { idCondition, MinValue, MaxValue } = condition;
        return fetch(`${URL}/updateCondition/${idCondition}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ MinValue, MaxValue }),
        });
      });

      const results = await Promise.all(updatePromises);

      results.forEach((res) => {
        if (!res.ok) {
          throw new Error("Failed to update some conditions");
        }
      });
      console.log("Cập nhật điều kiện thành công");
    } catch (error) {
      setError("Error: " + (error.message || "Failed to update conditions"));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateConditions();

    const updatedVoucher = {
      PercentDiscount: Voucher.PercentDiscount || data.PercentDiscount,
      Description: Voucher.Description || data.Description,
      ExpiredTime: ExpiredTime || Voucher.ExpiredTime || data.ExpiredTime,
      ReleaseTime: ReleaseTime || Voucher.ReleaseTime || data.ReleaseTime,
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
        alert("Cập nhật voucher thành công");
        navigate(`/Partner/DetailvoucherPN/${id}`);
      }
    } catch (err) {
      alert("Error: " + (err.message || "Failed to update voucher"));
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-bl to-[#75bde0] from-[#eeeeee] h-full flex items-center justify-center">
        <span className="font-extrabold text-4xl text-black text-center">
          Loading...
        </span>
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
        <p className="p-4 text-[#3F5F89] w-full text-xl mb-10">
          <span className="font-bold">Chú ý:</span> Sửa những trường voucher mà
          bạn muốn
        </p>
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div className="w-full px-4 col-span-8">
            <h1 className="text-3xl font-bold text-[#2F4F4F] mb-5">
              {data.Name}
            </h1>
            <div className="w-full border-b-2">
              <span className="text-xl text-[#3F5F89]">{data._id}</span>
              <span className="float-right font-bold text-xl text-[#3F5F89]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    data.States === "Enable" ? "text-green-500" : "text-red-500"
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
                        <div
                          className="absolute mt-6 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4 w-fit"
                          onClick={(e) => e.stopPropagation()}
                        >
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
                        <div
                          className="absolute mt-6 w-fit right-40 z-50 bg-[#ffffff] rounded-lg shadow-xl shadow-[#75bde0] p-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Calendar
                            onChange={handExpiredDateChange}
                            value={ExpiredTime}
                            minDate={nextDate(ReleaseTime)}
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
                      onChange={(e) => {
                        const value = e.target.value;

                        if (value.length <= 5) {
                          setVoucher({
                            ...Voucher,
                            RemainQuantity: Number(e.target.value),
                          });
                        }
                      }}
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
                      max={99}
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
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="p-10 mt-20 lg:col-span-4">
            <img
              className="w-auto rounded-xl h-auto object-cover"
              src={data.Image}
              alt="Car"
            />
          </div>
        </div>
        <div className="my-4">
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-center rtl:text-center text-lg text-white dark:text-[#2a5879]">
              <thead className="text-sm text-gray-700 uppercase  dark:bg-[#8AC5E2] dark:text-[#2a5879]">
                <tr className="text-lg">
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Min Value
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Max DisCount
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Update Min Value
                  </th>
                  <th scope="col" className="px-6 py-3 whitespace-nowrap">
                    Update Max Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.conditions && data.conditions.length > 0 ? (
                  data.conditions
                    .slice(0, data.conditions.length)
                    .map((condition) => {
                      const updatedCondition = updatedConditions.find(
                        (item) => item.idCondition === condition._id
                      );
                      return (
                        <tr
                          key={condition._id}
                          className="odd:bg-[#D9E6EB] odd:dark:bg-[#D9E6EB] even:bg-gray-50 even:dark:bg-[#C9DEE9] border-b dark:border-[#baccd6] text-md"
                        >
                          <td className="px-6 py-4">
                            {formattedPrice(condition.MinValue)}
                          </td>
                          <td className="px-6 py-4">
                            {formattedPrice(condition.MaxValue)}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              placeholder={condition.MinValue}
                              onChange={(e) => {
                                if (
                                  e.target.value < 0 ||
                                  isNaN(e.target.value) ||
                                  e.target.value.length > 8
                                )
                                  e.target.value = 0;
                                OnChangeMinValue(condition._id, e);
                              }}
                              className="border-2 bg-white border-[#4c86a7] outline-none text-[#3F5F89] px-4 rounded-lg"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              placeholder={condition.MaxValue}
                              onChange={(e) => {
                                if (
                                  e.target.value < 0 ||
                                  isNaN(e.target.value) ||
                                  e.target.value.length > 8
                                )
                                  e.target.value = 0;
                                OnChangeMaxValue(e, condition._id);
                              }}
                              className="border-2 bg-white border-[#4c86a7] outline-none text-[#3F5F89] px-4 rounded-lg"
                            />
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      Không có điều kiện
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-10 w-full justify-center px-4">
          <div className="col-span-6">
            <button
              onClick={handleSubmit}
              className="bg-[#4c84a7] hover:bg-[#e7ebf9] font-bold text-lg text-[#eaf9e7] hover:text-[#3F5F89] border-2 border-[#4c86a7] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} /> Sửa
            </button>
          </div>
          <div className="col-span-6">
            <Link
              to={`/Partner/DetailvoucherPN/${id}`}
              className="bg-[#2f464f] hover:bg-[#e7f4f9] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-2" /> Cancel Edit
            </Link>
          </div>
          ∂{" "}
        </div>
      </div>
    </div>
  );
};

export default EditVoucherPN;
