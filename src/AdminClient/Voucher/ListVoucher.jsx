import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const ListVoucher = () => {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedPage, setSelectedPage] = useState(1);
  const URL = "https://server-voucher.vercel.app/api";

  const fetchServices = async () => {
    try {
      const response = await fetch(`${URL}/getServices`);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const toggleshow = () => {
    setShow(!show);
  };

  const fetchChooseService = async () => {
    try {
      const response = await fetch(
        `${URL}/GetVoucherWithService/${selectedServices}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setVouchers(data);
      } else {
        setVouchers([]);
      }
    } catch (error) {
      console.error("Error fetching choose service:", error);
    }
  };

  useEffect(() => {
    if (selectedServices) {
      fetchChooseService();
    } else {
      fetchVouchers();
    }
  }, [selectedServices]);

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${URL}/  `);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setVouchers(data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteVoucher = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa voucher?");
    if (confirmDelete) {
      try {
        const res = await fetch(`${URL}/deleteVoucher/${id}`);
        const data = await res.json();
        if (res.status === 200) {
          alert("Xóa voucher thành công");
          selectedServices ? fetchChooseService() : fetchVouchers();
          window.location.reload();
        } else {
          alert("Error: " + (data?.message || "Failed to delete voucher"));
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      return;
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-bl to-[#75e093] from-[#eeeeee] h-full flex items-center justify-center">
        <span className="font-extrabold text-black text-4xl text-center">
          Loading...
        </span>
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
  // for (let i = 0; i < 50; i++) {
  //   pages.push(i + 1);
  // }
  for (let i = 0; i < Math.ceil(vouchers.length / 6); i++) {
    pages.push(i + 1);
  }

  return (
    <div className="lg:bg-[#EAF8E6] h-full  bg-[#EAF8E6]">
      <div className="w-full  to-[#d8ffce] from-30% h-full from-[#ffffff]  p-4">
        <h1 className="text-4xl text-[#16233B] mb-4 w-full text-center font-bold">
          Danh sách voucher
        </h1>
        <div className="flex justify-between my-2 h-fit w-full p-2">
          <div className="">
            <div
              onClick={toggleshow}
              tabIndex={0}
              role="button"
              className="font-semibold bg-[#4BA771] hover:bg-[#e8f9e7] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#4BA771] outline-none px-4 py-2 rounded-lg"
            >
              Sort by Service
            </div>
            {show && (
              <ul
                tabIndex={0}
                className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] w-52 p-2 shadow-inner shadow-[#4BA771] mt-2"
              >
                <li className="flex items-center text-[#16233B] text-lg">
                  <p
                    onClick={() => {
                      setSelectedServices(null),
                        setShow(false),
                        fetchVouchers();
                    }}
                    className="w-full hover:bg-[#2E4F4F] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    All services
                  </p>
                </li>
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center text-[#16233B] text-lg"
                  >
                    <p
                      onClick={() => {
                        setSelectedServices(service.id), setShow(false);
                      }}
                      className="w-full hover:bg-[#2E4F4F] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                    >
                      {service.name}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            to="/Admin/CreateVoucher"
            className="font-semibold bg-[#4BA771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#4BA771] px-4 py-2 rounded-lg"
          >
            Create Voucher
          </Link>
        </div>
        <div className="grid mx-2 grid-cols-1 lg:grid-cols-2 gap-4">
          {vouchers.map((voucher, index) => {
            while (index >= selectedPage * 6 - 6 && index < selectedPage * 6) {
              return (
                <div
                  key={voucher._id}
                  className=" w-full rounded-lg p-4 bg-[#BFE6B3] text-[#16233B]"
                >
                  <div className="flex w-full">
                    <div className="w-3/4">
                      <h2 className="text-2xl font-bold mb-3 line-clamp-1 w-[73%]">
                        {voucher.Name}
                      </h2>
                    </div>
                    <div className="w-1/4 ">
                      {" "}
                      <span
                        className={`font-bold text-[#e4e4e4] float-right w-fit py-2 rounded-lg flex items-center ${
                          voucher.States === "Enable"
                            ? "bg-[#4ca771] px-4"
                            : "bg-[#cf3a3a] px-[0.9rem]"
                        } `}
                      >
                        {voucher.States}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12">
                    <div className="col-span-8 ">
                      <p className="line-clamp-1">{voucher.Description}</p>
                      <p>
                        <span className="font-bold text-[#4BA771]">
                          Số lượng còn lại:
                        </span>{" "}
                        {voucher.RemainQuantity}
                      </p>
                      <p>
                        <span className="font-bold text-[#4BA771]">
                          Thời gian bắt đầu:
                        </span>
                        {date(voucher.ReleaseTime)}
                      </p>
                      <p>
                        <span className="font-bold text-[#4BA771]">
                          Thời gian hết hạn:
                        </span>
                        {date(voucher.ExpiredTime)}
                      </p>
                    </div>
                    <div className="col-span-4 grid  gap-2">
                      <Link
                        to={`/Admin/DetailVoucher/${voucher._id}`}
                        className="bg-[#4BA771] hover:bg-[#BFE6B3] text-[#eaf9e7] hover:text-[#4BA771] border-2 border-[#4BA771] lg:px-4 px-2 lg:ml-0 ml-[1.6rem] lg:w-full w-fit py-2 rounded-lg flex items-center"
                      >
                        <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                        Detail
                      </Link>
                      <button
                        // onClick={() => handleDeleteVoucher(voucher._id)}
                        className="bg-[#2f414f] hover:bg-[#BFE6B3] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#2F4F4F] lg:px-4 px-2 lg:ml-0 ml-[1.6rem] lg:w-full w-fit py-2 rounded-lg flex items-center"
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          })}
        </div>
        {pages.length >= 2 && (
          <div className="w-full flex justify-center mt-4">
            <div className="w-1/3 flex justify-between">
              {pages.map((page) => {
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
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListVoucher;
