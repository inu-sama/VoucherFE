import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Header from "../Header_Footer/HeaderCus";

const GetListVoucher = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [vouchers, setVouchers] = useState([]);
  const [note, setNote] = useState(null);
  const [PriceDiscount, setPriceDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderPrice, setOrderPrice] = useState(500000);
  const URL = "https://servervoucher.vercel.app/api";
  const navigate = useNavigate();

  const FetchNote = async () => {
    try {
      const response = await fetch(`${URL}/GetNote/OD01`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log("data note", data);
      setNote(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchNote();
  }, []);

  useEffect(() => {
    if (note && note.CusID) {
      console.log("cusID ", note.CusID);
    }
  }, [note]);

  const GetVoucher = async () => {
    try {
      const response = await fetch(`${URL}/getVoucherByCus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CusID: note.CusID,
          Service_ID: note.Service_ID,
          Price: note.Price,
        }),
      });

      const data = await response.json();

      console.log("data", data);
      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (note && note.CusID && note.Service_ID && note.Price) {
      GetVoucher();
    }
  }, [note]);

  const setDiscount = async (idVoucher) => {
    try {
      const response = await fetch(`${URL}/CalculateVoucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: idVoucher,
          Price: Number(orderPrice),
        }),
      });

      if (!response.ok) {
        throw new Error("Server error: " + response.statusText);
      }

      const data = await response.json();

      setPriceDiscount(data);
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const submitApplyVouhcer = async (voucherId) => {
    try {
      const response = await fetch(`${URL}/ApplyVoucher/${voucherId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CusID: "Thanh1", //thay thế dữ liệu nha đại ca
          TotalDiscount: PriceDiscount,
          Price: 450000, //thay tiền get dữ liệu về nha
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        alert("Áp dụng voucher thành công");
        GetVoucher();
      } else {
        alert("Error: " + (data.message || "Failed to apply voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
  const pages = [];
  for (let i = 0; i < Math.ceil(vouchers.length / 4); i++) {
    pages.push(i + 1);
  }
  //bg-gradient-to-r from-[#80ed99] to-[#0ad1c8]
  return (
    <div>
      <Header />
      <div className="w-full bg-[#213a57] min-h-screen p-10">
        <div className="w-full p-1 rounded-xl bg-gradient-to-r from-[#80ed99] to-[#0ad1c8]">
          <div className="w-full grid lg:grid-cols-3 gap-6 bg-[#fff] rounded-lg p-6">
            <div className="lg:col-span-2 bg-[#fff] rounded-xl p-6">
              <p className="w-full font-bold text-3xl text-[#213a57] my-4">
                DANH SÁCH VOUCHER
              </p>
              <p className="w-full text-lg text-[#213a57] my-4">
                Chọn voucher giảm giá mà bạn muốn áp dụng
              </p>
              <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
                {vouchers.map((voucher, index) => {
                  while (
                    index >= selectedPage * 4 - 4 &&
                    index < selectedPage * 4
                  ) {
                    return (
                      <div
                        key={voucher._id}
                        className="w-full text-[#213a57] hover:text-[#fff] bg-[#fff] hover:bg-[#213a57] border-4 border-[#213a57] rounded-xl p-4 cursor-pointer"
                        onClick={() => {
                          setSelectedVoucher(voucher);
                          // setPriceDiscount(
                          //   orderPrice * (voucher.PercentDiscount / 100)
                          // );
                          setDiscount(voucher._id);
                        }}
                      >
                        <p className="text-2xl font-bold mb-4">
                          {voucher.Name}
                        </p>
                        <p className="text-xl">
                          Giảm{" "}
                          <span className="font-bold">
                            {voucher.PercentDiscount}%
                          </span>{" "}
                          trên tổng tiền
                        </p>
                        <p className="text-xl">
                          Có giá trị từ ngày{" "}
                          <span className="">
                            {formatDate(voucher.ReleaseTime)}
                          </span>{" "}
                          đến{" "}
                          <span className="">
                            {formatDate(voucher.ExpiredTime)}
                          </span>
                        </p>
                      </div>
                    );
                  }
                })}
              </div>
              <div className="w-full flex justify-center mt-4">
                <div className="w-1/3 flex justify-between">
                  {pages.map((page) => {
                    return (
                      <p
                        key={page}
                        className="rounded-full w-10 h-10 text-xl font-semibold flex justify-center items-center border-4 border-[#213a57] bg-[#fff] hover:bg-[#213a57] text-[#213a57] hover:text-[#fff] cursor-pointer"
                        onClick={() => {
                          setSelectedPage(page);
                        }}
                      >
                        {page}
                      </p>
                    );
                  })}
                  {/* <p className="rounded-full">
                    {Math.ceil(vouchers.length / 4)}
                  </p> */}
                </div>
              </div>
              <p
                className="mb-4 mt-10 w-full text-center font-bold text-xl hover:text-[#213a57] text-[#fff] hover:bg-[#fff] bg-[#213a57] border-4 border-[#213a57] p-3 rounded-xl cursor-pointer"
                onClick={() => {
                  setSelectedVoucher(null);
                  setPriceDiscount(0);
                }}
              >
                Deselect voucher
              </p>
            </div>
            <div className="col-span-1 bg-[#213a57] rounded-xl p-6">
              <p className="w-full font-bold text-3xl text-transparent bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] bg-clip-text my-4">
                THÔNG TIN ĐƠN HÀNG
              </p>
              <div className="w-full p-1 bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] rounded-xl">
                <div className="w-full grid grid-cols-2 bg-[#ffffff] p-4 rounded-lg text-lg">
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Đơn hàng:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">123</div>
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Giá tiền:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">
                    {orderPrice}đ
                  </div>
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Giảm:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">
                    {PriceDiscount}đ
                  </div>
                  <div className="w-full font-bold text-[#213a57] py-2 text-xl">
                    Tổng cộng:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2 text-xl">
                    {orderPrice - PriceDiscount}đ
                  </div>
                </div>
              </div>
              <p className="w-full font-bold text-3xl text-transparent bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] bg-clip-text mb-4 mt-10">
                VOUCHER ĐÃ CHỌN
              </p>
              {selectedVoucher ? (
                <div
                  key={selectedVoucher._id}
                  className="w-full bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] rounded-xl p-1"
                >
                  <div className="w-full bg-white p-4 rounded-lg">
                    <div className="w-full text-[#213a57]">
                      <p className="text-xl font-bold mb-4">
                        {selectedVoucher.Name}
                      </p>
                      <p className="text-lg mb-4">
                        Có giá trị từ ngày{" "}
                        <span className="">
                          {formatDate(selectedVoucher.ReleaseTime)}
                        </span>{" "}
                        đến{" "}
                        <span className="">
                          {formatDate(selectedVoucher.ExpiredTime)}
                        </span>
                      </p>
                      <p className="text-lg mb-4">
                        Giảm{" "}
                        <span className="font-bold">
                          {selectedVoucher.PercentDiscount}%
                        </span>{" "}
                        cho đơn hàng từ{" "}
                        <span className="font-bold">
                          {selectedVoucher.MinCondition}đ
                        </span>
                      </p>
                      {selectedVoucher.conditions.map((condition) => (
                        <p className="text-lg" key={condition._id}>
                          Giảm tối đa{" "}
                          <span className="font-bold">
                            {condition.MaxValue}đ
                          </span>{" "}
                          cho đơn hàng từ{" "}
                          <span className="font-bold">
                            {condition.MinValue}đ
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="w-full text-center text-2xl text-[#0ad1c8] [text-shadow:_0_0_1px_#adff2f] my-4">
                  Chưa chọn voucher!!!
                </p>
              )}
              <div className="w-full p-1 bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] mb-4 mt-10 rounded-xl cursor-pointer">
                <div className="bg-white rounded-lg">
                  <p
                    id="applyBtn"
                    className="w-full text-center font-bold text-3xl bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] text-white hover:bg-clip-text hover:text-transparent p-4 rounded-lg"
                  >
                    APPLY
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetListVoucher;
