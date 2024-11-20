import { useEffect, useContext, useState } from "react";
import Header from "../Header_Footer/HeaderCus";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Router/ProtectedRoute";

const GetListVoucher = () => {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const [vouchers, setVouchers] = useState([]);
  const [note, setNote] = useState(null);
  const [PriceDiscount, setPriceDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ServiceID, setServiceID] = useState(null);
  const URL = "https://server-voucher.vercel.app/api";
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const OrderID = localStorage.getItem("OrderID");
  useEffect(() => {
    if (!OrderID || OrderID.trim() === "") {
      setError("YOU DON'T HAVE ANY ORDER");

      let countdown = 5;
      const timer = setInterval(() => {
        setError(`YOU DON'T HAVE ANY ORDER. Redirecting in ${countdown}...`);
        countdown--;

        if (countdown < 0) {
          clearInterval(timer);
          logout();
          navigate("/login");
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, []);

  const Token = localStorage.getItem("Token");

  const FetchNote = async () => {
    try {
      const response = await fetch(`${URL}/GetNote/${OrderID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setNote(data);
      console.log("Note:", data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error("Fetch Note Error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!note) {
      FetchNote();
    }
  }, [note]);

  const fetchServicesID = async () => {
    try {
      const response = await fetch(
        `${URL}/getServiceShotID/${note.Service_ID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setServiceID(data.id);
      console.log("Service ID:", data.id);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      console.error("Fetch Service ID Error:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (note) {
      fetchServicesID();
    }
  }, [note]);

  const GetVoucher = async () => {
    try {
      const response = await fetch(`${URL}/getVoucherByCus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          Service_ID: ServiceID,
          Partner_ID: note.Partner_ID,
          Price: note.Price,
        }),
      });

      if (!response.ok) {
        setError("Now voucher disavailable for this service");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }
      console.log("Vouchers:", data);

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (note && ServiceID) {
      GetVoucher();
    }
  }, [note, ServiceID]);

  const setDiscount = async (idVoucher) => {
    try {
      const response = await fetch(`${URL}/CalculateVoucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id: idVoucher,
          Price: Number(note.Price),
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
          Authorization: `Bearer ${Token}`,
        },
        body: JSON.stringify({
          TotalDiscount: PriceDiscount,
          Price: note.Price,
          OrderID: OrderID,
        }),
      });
      if (response.status === 200) {
        alert("Áp dụng voucher thành công");
        window.location.href = `https://wowo.htilssu.id.vn/order/${OrderID}`;
        logout();
      } else {
        if (response.status === 400) {
          setError("FAIL TO APPLY VOUCHER");

          let countdown = 5;
          const timer = setInterval(() => {
            setError(`FAIL TO APPLY VOUCHER. Redirecting in ${countdown}...`);
            countdown--;

            if (countdown < 0) {
              clearInterval(timer);
              window.location.href = `https://wowo.htilssu.id.vn/order/${OrderID}`;
              logout();
            }
          }, 1000);
        }
      }
    } catch (error) {
      setError(error);
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
      <div className="bg-gradient-to-bl to-[#77e075] from-[#eeeeee] h-screen flex items-center justify-center">
        <span className="font-extrabold text-black text-4xl text-center">
          {error}
        </span>
      </div>
    );
  }
  const pages = [];
  for (let i = 0; i < Math.ceil(vouchers.length / 6); i++) {
    pages.push(i + 1);
  }
  return (
    <div>
      <Header />
      <div className="w-full bg-[#213a57] min-h-screen lg:p-10 p-4">
        <div className="w-full p-1 rounded-xl bg-gradient-to-r from-[#80ed99] to-[#0ad1c8]">
          <div className="w-full grid lg:grid-cols-3 gap-6 bg-[#fff] rounded-lg lg:p-6 p-0">
            <div className="lg:col-span-2 bg-[#fff] rounded-xl lg:p-6 p-2">
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
                    index < selectedPage * 6
                  ) {
                    return (
                      <div
                        key={voucher._id}
                        className="w-full text-[#213a57] hover:text-[#fff] bg-[#fff] hover:bg-[#213a57] border-4 border-[#213a57] rounded-xl p-4 cursor-pointer"
                        onClick={() => {
                          setSelectedVoucher(voucher);
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
              {pages.map((page) => {
                if (selectedPage === 1 || selectedPage === pages.length) {
                  while (selectedPage >= page - 2 && selectedPage <= page + 2) {
                    return (
                      <p
                        key={page}
                        className={`rounded-full w-10 h-10 text-xl font-semibold flex justify-center items-center border-4 border-[#213a57] cursor-pointer ${
                          selectedPage === page
                            ? "bg-[#213a57] hover:bg-[#213a57] text-[#fff] hover:text-[#fff] cursor-pointer"
                            : "bg-[#fff] hover:bg-[#213a57] text-[#213a57] hover:text-[#fff] cursor-pointer"
                        } `}
                        onClick={() => {
                          setSelectedPage(page);
                        }}
                      >
                        {page}
                      </p>
                    );
                  }
                } else {
                  while (selectedPage >= page - 1 && selectedPage <= page + 1) {
                    return (
                      <p
                        key={page}
                        className={`rounded-full w-10 h-10 text-xl font-semibold flex justify-center items-center border-4 border-[#213a57] cursor-pointer ${
                          selectedPage === page
                            ? "bg-[#213a57] hover:bg-[#213a57] text-[#fff] hover:text-[#fff] cursor-pointer"
                            : "bg-[#fff] hover:bg-[#213a57] text-[#213a57] hover:text-[#fff] cursor-pointer"
                        } `}
                        onClick={() => {
                          setSelectedPage(page);
                        }}
                      >
                        {page}
                      </p>
                    );
                  }
                }
              })}
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
            <div className="col-span-1 bg-[#213a57] rounded-xl lg:p-6 p-2">
              <p className="w-full font-bold text-3xl text-transparent bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] bg-clip-text my-4">
                THÔNG TIN ĐƠN HÀNG
              </p>
              <div className="w-full p-1 bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] rounded-xl">
                <div className="w-full grid grid-cols-2 bg-[#ffffff] p-4 rounded-lg text-lg">
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Đơn hàng:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">
                    {note.OrderID}
                  </div>
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Giá tiền:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">
                    {formattedPrice(note.Price)}
                  </div>
                  <div className="w-full font-bold text-[#213a57] py-2">
                    Giảm:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2">
                    {formattedPrice(PriceDiscount)}
                  </div>
                  <div className="w-full font-bold text-[#213a57] py-2 text-xl">
                    Tổng cộng:
                  </div>
                  <div className="w-full text-end text-[#213a57] py-2 text-xl">
                    {formattedPrice(note.Price - PriceDiscount)}
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
                          {formattedPrice(selectedVoucher.MinCondition)}
                        </span>
                      </p>
                      {selectedVoucher.conditions.map((condition) => (
                        <p className="text-lg" key={condition._id}>
                          Giảm tối đa{" "}
                          <span className="font-bold">
                            {formattedPrice(condition.MaxValue)}
                          </span>{" "}
                          cho đơn hàng từ{" "}
                          <span className="font-bold">
                            {formattedPrice(condition.MinValue)}
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
                  <button
                    id="applyBtn"
                    onClick={() => {
                      if (selectedVoucher) {
                        submitApplyVouhcer(selectedVoucher._id);
                      } else {
                        alert("Chưa chọn voucher");
                      }
                    }}
                    className="w-full text-center font-bold text-3xl bg-gradient-to-r from-[#80ed99] to-[#0ad1c8] text-white hover:bg-clip-text hover:text-transparent p-4 rounded-lg"
                  >
                    APPLY
                  </button>
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
