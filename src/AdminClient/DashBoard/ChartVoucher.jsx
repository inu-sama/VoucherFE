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

const ChartVoucher = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [service, setService] = useState([]);
  const [listService, setListService] = useState([]);
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
    const r = Math.floor(Math.random() * 128 + 127);
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

    setNoDataFound(voucher.length === 0);
    // setShowPopup(true);
  };
  
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${URL}/Statistical_VoucherAdmin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        setError("You currently do not have data to display");
        return;
      }
      const data = await res.json();
      setHistory(data);
      console.log("his", data);
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
        return data.name; // Return the name directly
      } else {
        throw new Error("Failed to fetch service name");
      }
    } catch (error) {
      console.error("Error fetching service name:", error);
      return "Unknown Service"; // Default value in case of error
    }
  };

  useEffect(() => {
    const fetchServiceNames = async () => {
      const names = {};
      for (let i = 0; i < history.length; i++) {
        for (let j = 0; j < history[i].haveVouchers.length; j++) {
          const serviceID = history[i].haveVouchers[j].Service_ID;
          names[serviceID] = await fetchServiceID(serviceID);
        }
      }
      setServiceNames(names);
    };

    if (history.length > 0) {
      fetchServiceNames();
    }
  }, [history]);

  const fetchService = async () => {
    try {
      const response = await fetch(`${URL}/getServices`);
      if (response.ok) {
        const data = await response.json();
        setService(data);
        setListService(data);
        console.log("service", data);
      } else {
        throw new Error("Failed to fetch service name");
      }
    } catch (error) {
      console.error("Error fetching service name:", error);
      return "Unknown Service";
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

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
        console.log("item: " + item);
      } else {
        voucherStats[Voucher_ID].totalDiscount += validTotalDiscount;
        voucherStats[Voucher_ID].totalUsed += 1;
      }
    });

    setVoucherStatistics(voucherStats);
  };

  console.log("voucherStatistics", voucherStatistics);

  const aggregateDataByDate = (data) => {
    return data.reduce((acc, item) => {
      const { Date: dateString, TotalDiscount, Voucher_ID } = item;

      // Chuyển đổi ngày về dạng 'YYYY-MM-DD'
      const date = new Date(dateString).toISOString().split("T")[0];

      // Tìm xem đã có một entry với mã voucher này trong `acc` chưa
      let voucherEntry = acc.find((entry) => entry.voucherIDs === Voucher_ID);

      if (!voucherEntry) {
        // Nếu chưa có, tạo mới `voucherEntry` và thêm vào `acc`
        voucherEntry = { voucherIDs: Voucher_ID, dataByDate: [] };
        acc.push(voucherEntry);
      }

      // Tìm xem trong `voucherEntry.dataByDate` đã có entry cho ngày này chưa
      let dateEntry = voucherEntry.dataByDate.find(
        (entry) => entry.date === date
      );

      if (dateEntry) {
        // Nếu đã có entry cho ngày, cộng thêm `TotalDiscount`
        dateEntry.totalDiscount += TotalDiscount;
      } else {
        // Nếu chưa có, thêm mới một entry cho ngày với `TotalDiscount`
        voucherEntry.dataByDate.push({
          date: date,
          totalDiscount: TotalDiscount,
        });
      }

      return acc;
    }, []);
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

  const createDataset = ({ data }) => {
    const aggregatedData = aggregateDataByDate(data);
    const labels = [
      ...new Set(
        aggregatedData.flatMap((entry) =>
          entry.dataByDate.map((item) => item.date)
        )
      ),
    ];

    // Tạo datasets cho từng voucher ID
    const datasets = aggregatedData.map((entry) => ({
      label: entry.voucherIDs,
      data: labels.map((date) => {
        const dateEntry = entry.dataByDate.find((item) => item.date === date);
        return dateEntry ? dateEntry.totalDiscount : 0;
      }),
      borderColor: "#" + Math.floor(Math.random() * 16777215).toString(16), // Màu ngẫu nhiên cho mỗi chuỗi
      fill: false,
    }));
  };

  const dataset = createDataset({ data: filteredData });

  const lineData = {
    labels: Object.keys(voucherStatistics),
    datasets: [
      {
        label: "Total Discount",
        data: Object.values(voucherStatistics).map(
          (voucher) => voucher.totalDiscount
        ),
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "#000000",
        },
      },
      y: {
        beginAtZero: true,
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
      <div className="bg-gradient-to-bl to-[#75e087] from-[#eeeeee] h-full flex items-center justify-center">
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
    <div className="lg:bg-[#EAF8E6]  h-full bg-[#EAF8E6]">
      <div className="ww-full grid grid-cols-3 p-2 lg:p-6 lg:gap-6 gap-2">
        <div className="col-span-1 w-full line-clamp-1">
          <div
            id="service"
            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            tabIndex={0}
            role="button"
            className="font-semibold bg-[#4BA771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4BA771] border-2 border-[#4BA771] outline-none px-4 py-2 rounded-lg cursor-pointer"
          >
            All Service
          </div>
          {showServiceDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-[300px] w-[200px] p-2 shadow-inner shadow-[#4BA771] mt-2"
            >
              <li className="flex items-center w-full text-[#2E4F4F] text-lg">
                <p
                  onClick={() => {
                    document.getElementById("service").innerText =
                      "All services";
                    setSelectedService(null), setShowServiceDropdown(false);
                  }}
                  className="w-[180px] lg:w-full hover:bg-[#4BA771] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                >
                  All services
                </p>
              </li>
              {listService.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center text-[#2E4F4F] text-lg"
                >
                  <p
                    onClick={() => {
                      document.getElementById("service").innerText =
                        service.name;
                      setSelectedService(service.id),
                        setShowServiceDropdown(false);
                    }}
                    className="w-[180px] lg:w-full line-clamp-1 hover:bg-[#4BA771] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {service.name}
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
            className="font-semibold bg-[#4BA771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4BA771] border-2 border-[#4BA771] outline-none px-4 py-2 rounded-lg cursor-pointer"
          >
            Tháng {selectedMonth}
          </div>
          {showMonthDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-52 w-[130px]  p-2 shadow-inner shadow-[#4BA771] mt-2"
            >
              {months.map((month) => (
                <li
                  key={month}
                  className="flex items-center text-[#2E4F4F] text-lg"
                >
                  <p
                    onClick={() => {
                      // document.getElementById("month").innerText = month;
                      setSelectedMonth(month.toString()),
                        setShowMonthDropdown(false);
                    }}
                    className="text-center w-full hover:bg-[#4BA771] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {month}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-1 w-full line-clamp-1">
          <div
            id="year"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="font-semibold bg-[#4BA771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4BA771] border-2 border-[#4BA771] outline-none px-4 py-2 rounded-lg cursor-pointer"
          >
            Năm {selectedYear}
          </div>
          {showYearDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] lg:w-52 w-[120px] p-2 shadow-inner shadow-[#4BA771] mt-2"
            >
              {year.map((yr) => (
                <li
                  key={yr}
                  className="flex items-center text-[#4BA771] text-lg"
                >
                  <a
                    onClick={() => {
                      // document.getElementById("year").innerText = yr;
                      setSelectedYear(yr.toString()),
                        setShowYearDropdown(false);
                      console.log("year: " + yr);
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
            Can not find data, please choose another service, month or year
          </p>
        </div>
      )}
      <div className="p-6 mt-4 w-screen overflow-x-auto lg:hidden block">
        {filteredData.length > 0 && (
          <div className="relative p-4 w-[1232px] shadow-md rounded-lg text-lg text-[#2F4F4F]">
            <div className="w-full grid grid-cols-12 font-bold py-3 px-2 bg-[#4ca771] rounded-t-md text-[#fff]">
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
                className="w-full grid grid-cols-12  py-3 px-2 odd:bg-[#C9E9CC] odd:dark:bg-[#a5e0ab] even:bg-gray-50 even:dark:bg-[#DAEAD8]"
              >
                <div className="col-span-2 font-semibold flex items-center justify-center">
                  {voucherId}
                </div>
                <div className="col-span-3 text-center">
                  {(Array.isArray(voucherStatistics[voucherId]?.serviceIDs)
                    ? voucherStatistics[voucherId].serviceIDs
                    : voucherStatistics[voucherId]?.serviceIDs?.split(",")
                  )
                    ?.map((id) => serviceNames[id.trim()] || "Unknown Service")
                    .join(", ")}
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  {voucherStatistics[voucherId].totalUsed}
                </div>
                <div className="col-span-3 flex items-center justify-center">
                  {formattedPrice(voucherStatistics[voucherId].totalDiscount)}
                </div>
                <div className="col-span-2 flex items-center justify-center">
                  {voucherStatistics[voucherId].date}
                </div>
                <div className="col-span-1 flex items-center justify-center">
                  <Link
                    to={`/Admin/DetailDashBoard/${voucherId}/${selectedMonth}/${selectedYear}`}
                    className="font-medium text-[#2F4F4F]"
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
        )}
      </div>
      <div className="grid grid-cols-12">
        <div id="pie" className="lg:col-span-4 col-span-12 w-full">
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <div className="w-full h-[400px]">
              <div className="w-full h-full flex items-center justify-center">
                <Pie className="w-full h-full" data={pieData} />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-8 lg:block hidden">
          <div className="p-6">
            {filteredData.length > 0 && (
              <div className="relative p-4 shadow-md rounded-lg text-lg text-[#2F4F4F]">
                <div className="w-full grid grid-cols-12 font-bold py-3 px-2 bg-[#4ca771] rounded-t-md text-[#fff]">
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
                    className="w-full grid grid-cols-12  py-3 px-2 odd:bg-[#C9E9CC] odd:dark:bg-[#a5e0ab] even:bg-gray-50 even:dark:bg-[#DAEAD8]"
                  >
                    <div className="col-span-2 font-semibold flex items-center justify-center">
                      {voucherId}
                    </div>
                    <div className="col-span-3 text-center">
                      {(Array.isArray(voucherStatistics[voucherId]?.serviceIDs)
                        ? voucherStatistics[voucherId].serviceIDs
                        : voucherStatistics[voucherId]?.serviceIDs?.split(",")
                      )
                        ?.map(
                          (id) => serviceNames[id.trim()] || "Unknown Service"
                        )
                        .join(", ")}
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
                        to={`/Admin/DetailDashBoard/${voucherId}/${selectedMonth}/${selectedYear}`}
                        className="font-medium text-[#2F4F4F]"
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
            )}
          </div>
        </div>
      </div>

      {filteredData.length > 0 && !noDataFound && !noFilterData && (
        <div className="w-full p-8 h-full">
          <div className="w-full h-full   ">
            <Line data={lineData} options={options} />
          </div>
        </div>
      )}
      {/* {showPopup && <Popup />} */}
    </div>
  );
};

export default memo(ChartVoucher);
