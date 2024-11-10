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
  const URL = "https://server-voucher.vercel.app/api";
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
        console.log(data);
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

  // const handleState = async (id) => {
  //   try {
  //     const res = await fetch(`${URL}/updateState/${id}`, {
  //       method: "POST",
  //     });
  //     const data = await res.json();
  //     if (res.status === 400) {
  //       alert("Error: " + (data?.message || "Failed to update state"));
  //     } else {
  //       navigate(`/Partner/Editvoucher/${id}`);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const fetchVouchers = async () => {
    try {
      const res = await fetch(`${URL}/getvoucherManagerbyPartner`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setVouchers(data);
      console.log("Dữ liệu nhận được:", data);
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
      <div className="bg-gradient-to-bl to-[#75bde0] from-[#eeeeee] h-full flex items-center justify-center">
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

  return (
    <div className="lg:bg-[#e7f3f9] h-full bg-[#4c98a7]">
      <div className="w-full bg-gradient-to-bl to-[#75bde0] from-30% h-full from-[#eeeeee]  p-4">
        <h1 className="text-4xl text-[#16233B] mb-4 w-full text-center font-bold">
          Danh sách voucher
        </h1>
        <div className="flex justify-between my-2 h-fit w-full p-2">
          <div className="">
            <div
              onClick={toggleshow}
              tabIndex={0}
              role="button"
              className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg"
            >
              Sort by Service
            </div>
            {show && (
              <ul
                tabIndex={0}
                className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] w-52 p-2 shadow-inner shadow-[#3775A2] mt-2"
              >
                <li className="flex items-center text-[#16233B] text-lg">
                  <a
                    onClick={() => {
                      setSelectedServices(null),
                        setShow(false),
                        fetchVouchers();
                    }}
                    className="w-full hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    All services
                  </a>
                </li>
                {services.map((service) => (
                  <li
                    key={service.id}
                    className="flex items-center text-[#16233B] text-lg"
                  >
                    <a
                      onClick={() => {
                        setSelectedServices(service.id), setShow(false);
                      }}
                      className="w-full hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                    >
                      {service.name}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Link
            to="/Partner/CreatevoucherPN"
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#3775A2] px-4 py-2 rounded-lg"
          >
            Create Voucher
          </Link>
        </div>
        <div className="grid mx-2 grid-cols-1 lg:grid-cols-2 gap-4">
          {vouchers.map((voucher) => (
            <div
              key={voucher._id}
              className=" w-full rounded-lg p-4 bg-[#a8d9e4] text-[#16233B]"
            >
              <div className="flex w-full">
                <h2 className="text-2xl font-bold mb-3 line-clamp-1 w-3/4">
                  {voucher.Name}
                </h2>
                <div className="w-1/4 ">
                  {" "}
                  <span
                    className={`font-bold text-[#e4e4e4] float-right w-fit px-4 py-2 rounded-lg flex items-center ${
                      voucher.States === "Enable"
                        ? "bg-[#4ca771]"
                        : "bg-[#cf3a3a]"
                    } `}
                  >
                    {voucher.States}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12">
                <div className="col-span-8">
                  <p>{voucher.Description}</p>
                  <p>
                    <span className="font-bold text-[#3f5f89]">
                      Số lượng còn lại:
                    </span>{" "}
                    {voucher.RemainQuantity}
                  </p>
                  <p>
                    <span className="font-bold text-[#3f5f89]">
                      Thời gian bắt đầu:
                    </span>{" "}
                    {date(voucher.ReleaseTime)}
                  </p>
                  <p>
                    <span className="font-bold text-[#3f5f89]">
                      Thời gian hết hạn:
                    </span>{" "}
                    {date(voucher.ExpiredTime)}
                  </p>
                </div>
                <div className="col-span-4 grid  gap-2">
                  <Link
                    to={`/Partner/DetailVoucherPN/${voucher._id}`}
                    className="bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3f5f89] border-2 border-[#3775A2] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                    Detail
                  </Link>
                  <button
                    onClick={() => handleDeleteVoucher(voucher._id)}
                    className="bg-[#2f414f] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#16233B] border-2 border-[#2F4F4F] px-4 py-2 rounded-lg flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListVoucher;
