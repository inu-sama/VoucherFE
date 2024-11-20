import { memo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

const DashBoardPartner = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [service, setService] = useState([]);
  const [year, setYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [selectedService, setSelectedService] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [voucherStatistics, setVoucherStatistics] = useState({});
  const [noFilterData, setNoFilterData] = useState(false);
  const [serviceNames, setServiceNames] = useState({});
  // const [showPopup, setShowPopup] = useState(false);
  const [filterDetail, setFilterDetail] = useState([]);
  const [voucherName, setVoucherName] = useState("");

  const URL = "https://server-voucher.vercel.app/api";

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 128 + 127); // Tạo giá trị từ 127 đến 255 (tương đối sáng)
    const g = Math.floor(Math.random() * 128 + 127);
    const b = Math.floor(Math.random() * 128 + 127);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const filterDetailData = (voucherId) => {
    const voucher = history.filter((item) => {
      const voucherDate = new Date(item.Date);
      const matchesMonthYear =
        (!selectedMonth ||
          voucherDate.getMonth() + 1 === parseInt(selectedMonth)) &&
        (!selectedYear || voucherDate.getFullYear() === parseInt(selectedYear));
      const matchVoucherId = item.Voucher_ID === voucherId;
      return matchesMonthYear && matchVoucherId;
    });

    if (voucher.length > 0) {
      setFilterDetail(voucher);
      // setVoucherName(voucher.vouchers.Name); // Lưu tên voucher vào state
    }

    setNoDataFound(voucher.length === 0);
    // setShowPopup(true); // Hiển thị popup
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${URL}/Statistical_PartnerService`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });
      if (!res.ok) {
        setError("You currently do not have data to display");
        return;
      }
      const data = await res.json();
      setHistory(data);

      if (data.length === 0) {
        setError("You currently do not have data to display");
      }

      const serviceIds = data.flatMap((item) =>
        item.haveVouchers.map((voucher) => voucher.Service_ID)
      );
      setService([...new Set(serviceIds)]);

      const uniqueYears = [
        ...new Set(data.map((item) => new Date(item.Date).getFullYear())),
      ];
      setYear(uniqueYears);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchServiceID = async (serviceId) => {
    try {
      const response = await fetch(`${URL}/getServiceID/${serviceId}`);
      if (response.ok) {
        const data = await response.json();
        return data.name;
      } else {
        throw new Error("Failed to fetch service name");
      }
    } catch (error) {
      console.error("Error fetching service name:", error);
      return "Unknown Service";
    }
  };

  useEffect(() => {
    const fetchServiceNames = async () => {
      const names = {};
      for (const haveVoucher of history.flatMap((item) => item.haveVouchers)) {
        const name = await fetchServiceID(haveVoucher.Service_ID);
        names[haveVoucher.Service_ID] = name;
      }
      setServiceNames(names);
    };

    if (history?.length > 0) {
      fetchServiceNames();
    }
  }, [history]);

  const filterData = () => {
    if (history.length === 0) return;

    const filtered = history.filter((item) => {
      const voucherDate = new Date(item.Date);
      const matchesMonthYear =
        (!selectedMonth ||
          voucherDate.getMonth() + 1 === parseInt(selectedMonth)) &&
        (!selectedYear || voucherDate.getFullYear() === parseInt(selectedYear));

      const matchesService =
        !selectedService ||
        item.haveVouchers.some(
          (voucher) => voucher.Service_ID === selectedService
        );

      return matchesMonthYear && matchesService;
    });

    setFilteredData(filtered);
    updateVoucherStatistics(filtered);
    setNoDataFound(filtered.length === 0);
    setNoFilterData(
      filtered.length === 0 &&
        !selectedMonth &&
        !selectedYear &&
        !selectedService
    );
  };

  useEffect(() => {
    if (!selectedMonth || !selectedYear || !selectedService) {
      filterData();
    }
    filterData();
  }, [selectedMonth, selectedYear, selectedService, history]);

  const updateVoucherStatistics = (filteredData) => {
    const voucherStats = {};

    filteredData.forEach((item) => {
      const { Voucher_ID, TotalDiscount } = item;
      const validTotalDiscount = Number(TotalDiscount) || 0;

      if (!voucherStats[Voucher_ID]) {
        voucherStats[Voucher_ID] = {
          totalDiscount: validTotalDiscount,
          totalUsed: 1,
          partnerID: item.Partner_ID,
          serviceIDs: item.haveVouchers.map((v) => v.Service_ID).join(", "),
          date: new Date(item.Date).toLocaleDateString(),
        };
      } else {
        voucherStats[Voucher_ID].totalDiscount += validTotalDiscount;
        voucherStats[Voucher_ID].totalUsed += 1;
      }
    });

    setVoucherStatistics(voucherStats);
  };

  const pieData = {
    labels: Object.keys(voucherStatistics),
    datasets: [
      {
        label: "Total Used",
        data: Object.values(voucherStatistics).map(
          (voucher) => voucher.totalUsed
        ),
        backgroundColor: Object.keys(voucherStatistics).map(() =>
          generateRandomColor()
        ),
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels: Object.keys(voucherStatistics),
    datasets: [
      {
        label: "Total Discount",
        data: Object.values(voucherStatistics).map(
          (voucher) => voucher.totalDiscount
        ),
        fill: false,
        borderColor: Object.keys(voucherStatistics).map(() =>
          generateRandomColor()
        ), // Viền màu ngẫu nhiên
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        ticks: {
          color: "#000000",
        },
      },
      y: {
        ticks: {
          color: "#000000",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#000000",
        },
      },
    },
  };

  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  if (isLoading) {
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
      <div className="text-center text-4xl text-black translate-y-1/2 h-full font-extrabold">
        {error}
      </div>
    );
  }

  return (
    <div className="text-[#2F4F4F] w-full h-full bg-gradient-to-bl to-[#75bde0] from-30%  from-[#eeeeee]">
      <div className="w-full grid grid-cols-3 p-2 lg:p-6 lg:gap-6 gap-2">
        <div className="col-span-1 w-full line-clamp-1">
          <div
            id="service"
            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            tabIndex={0}
            role="button"
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-2 lg:px-4 py-2 rounded-lg cursor-pointer"
          >
            All services
          </div>
          {showServiceDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-[300px] w-[200px]  shadow-inner shadow-[#3775A2] mt-2"
            >
              <li className="flex items-center w-full text-[#3775A2] text-lg">
                <p
                  onClick={() => {
                    setSelectedService(null), setShowServiceDropdown(false);
                  }}
                  className="w-[180px] lg:w-full hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                >
                  All services
                </p>
              </li>
              {/* {console.log("sv: " + service)} */}
              {service.map((service) => (
                <li
                  key={service}
                  className="flex items-center text-[#3775A2] text-lg"
                >
                  <p
                    onClick={() => {
                      document.getElementById("service").innerText =
                        serviceNames[service];
                      setSelectedService(service),
                        setShowServiceDropdown(false);
                    }}
                    className="w-[180px] lg:w-full line-clamp-1 hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {serviceNames[service]}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-1 w-full line-clamp-1">
          <div
            id="month"
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg cursor-pointer"
          >
            Tháng: {selectedMonth}
          </div>
          {showMonthDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-52 w-[120px]  p-2 shadow-inner shadow-[#3775A2] mt-2"
            >
              {months.map((month) => (
                <li
                  key={month}
                  className="flex items-center text-[#3775A2] text-lg"
                >
                  <a
                    onClick={() => {
                      setSelectedMonth(month.toString()),
                        setShowMonthDropdown(false);
                    }}
                    className="w-full hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {month}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-1 w-full line-clamp-1">
          <div
            id="year"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg cursor-pointer"
          >
            Năm: {selectedYear}
          </div>
          {showYearDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-52 w-[120px]  p-2 shadow-inner shadow-[#3775A2] mt-2"
            >
              {year.map((yr) => (
                <li
                  key={yr}
                  className="flex items-center text-[#3775A2] text-lg"
                >
                  <a
                    onClick={() => {
                      setSelectedYear(yr.toString()),
                        setShowYearDropdown(false);
                    }}
                    className="w-full hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {yr}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {noDataFound && !noFilterData && (
        <div className=" h-full flex items-center justify-center">
          <p className="font-extrabold text-4xl text-center">
            Can not find data, please choose another
          </p>
        </div>
      )}
      <div className="p-6 mt-4 w-screen overflow-x-auto lg:hidden block">
        {filteredData.length > 0 && (
          <div className="relative p-4 rounded-2xl text-lg text-[#4c83a7] shadow-xl">
            <div className="lg:w-full  w-[330px] rounded-xl shadow-xl shadow-[#fff]">
              <div className="lg:w-full w-[330px] grid grid-cols-12 font-bold py-3 px-2 text-[#4c83a7]">
                <div className="lg:col-span-2 col-span-4 text-center">
                  Voucher ID
                </div>
                <div className="col-span-3 text-center lg:block hidden">
                  Services
                </div>
                <div className="col-span-1 text-center lg:block hidden">
                  Used
                </div>
                <div className="col-span-3 text-center lg:block hidden">
                  Total Discount
                </div>
                <div className="lg:col-span-2 col-span-6  text-center">
                  Date
                </div>
                <div className="lg:col-span-1 col-span-2 text-right">
                  Detail
                </div>
              </div>
              {Object.keys(voucherStatistics).map((voucherId) => (
                <div
                  key={voucherId}
                  className="lg:w-full w-[330px] grid grid-cols-12 py-3 px-2 bg-[#73B9EA] text-[#fff] border border-[#fff]"
                >
                  <div className="lg:col-span-2 col-span-4 font-bold flex items-center justify-center">
                    {voucherId}
                  </div>
                  <div className="col-span-3 text-center lg:block hidden">
                    {(Array.isArray(voucherStatistics[voucherId]?.serviceIDs)
                      ? voucherStatistics[voucherId].serviceIDs
                      : voucherStatistics[voucherId]?.serviceIDs?.split(",")
                    )
                      ?.map(
                        (id) => serviceNames[id.trim()] || "Unknown Service"
                      )
                      .join(", ")}
                  </div>
                  <div className="col-span-1 items-center justify-center lg:flex hidden">
                    {voucherStatistics[voucherId].totalUsed}
                  </div>
                  <div className="col-span-3 items-center justify-center lg:flex hidden">
                    {formattedPrice(voucherStatistics[voucherId].totalDiscount)}
                  </div>
                  <div className="lg:col-span-2 col-span-6 flex items-center justify-center">
                    {voucherStatistics[voucherId].date}
                  </div>
                  <div className="lg:col-span-1 col-span-2 flex items-center justify-center">
                    <Link
                      to={`/Partner/DetailDashBoard/${voucherId}/${selectedMonth}/${selectedYear}`}
                      className="font-medium text-[#fff]"
                    >
                      <FontAwesomeIcon
                        className=""
                        icon={faCircleInfo}
                        onClick={() => filterDetailData(voucherId)}
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-12">
        <div className="lg:col-span-4 col-span-12  w-full">
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <div className="w-full h-[400px]">
              <div className="w-full h-full flex items-center justify-center">
                <Pie className="w-full h-full" data={pieData} />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-8">
          <div className="p-6 lg:block hidden">
            {filteredData.length > 0 && (
              <div className="relative p-4 rounded-2xl text-lg text-[#4c83a7] shadow-xl">
                <div className="rounded-xl overflow-hidden shadow-xl shadow-[#fff]">
                  <div className="w-full grid grid-cols-12 font-bold py-3 px-2 text-[#4c83a7]">
                    <div className="col-span-2 text-center">Voucher ID</div>
                    <div className="col-span-3 text-center">Services</div>
                    <div className="col-span-1 text-center">Used</div>
                    <div className="col-span-3 text-center">Total Discount</div>
                    <div className="col-span-2 text-center">Date</div>
                    <div className="col-span-1 text-center">Detail</div>
                  </div>
                  {Object.keys(voucherStatistics).map((voucherId) => (
                    <div
                      key={voucherId}
                      className="w-full grid grid-cols-12 py-3 px-2 bg-[#73B9EA] text-[#fff] border border-[#fff]"
                    >
                      <div className="col-span-2 font-bold flex items-center justify-center">
                        {voucherId}
                      </div>
                      <div className="col-span-3 text-center">
                        {(Array.isArray(
                          voucherStatistics[voucherId]?.serviceIDs
                        )
                          ? voucherStatistics[voucherId].serviceIDs
                          : voucherStatistics[voucherId]?.serviceIDs?.split(",")
                        )
                          ?.map(
                            (id) => serviceNames[id.trim()] || "Unknown Service"
                          )
                          .join(", ")}
                        {/* {serviceNames[voucherStatistics[voucherId].serviceIDs] ||
                        "Unknown Service"} */}
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        {voucherStatistics[voucherId].totalUsed}
                      </div>
                      <div className="col-span-3 flex items-center justify-center">
                        {formattedPrice(
                          voucherStatistics[voucherId].totalDiscount
                        )}
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        {voucherStatistics[voucherId].date}
                      </div>
                      <div className="col-span-1 flex items-center justify-center">
                        <Link
                          to={`/Partner/DetailDashBoard/${voucherId}/${selectedMonth}/${selectedYear}`}
                          className="font-medium text-[#fff]"
                        >
                          <FontAwesomeIcon
                            className=""
                            icon={faCircleInfo}
                            onClick={() => filterDetailData(voucherId)}
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {filteredData.length > 0 && !noDataFound && !noFilterData && (
        <div className="w-full h-full p-8">
          <div className="w-full">
            <Line data={lineData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DashBoardPartner);
