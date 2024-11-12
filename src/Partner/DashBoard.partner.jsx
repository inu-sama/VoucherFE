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
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [voucherStatistics, setVoucherStatistics] = useState({});
  const [noFilterData, setNoFilterData] = useState(false);
  const [serviceNames, setServiceNames] = useState({});

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
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
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
        borderColor: "rgba(75, 192, 192, 1)",
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
      <div className="w-full grid grid-cols-3 p-6 gap-6">
        <div className="col-span-1">
          <div
            onClick={() => setShowServiceDropdown(!showServiceDropdown)}
            tabIndex={0}
            role="button"
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg"
          >
            Select Service
          </div>
          {showServiceDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] w-[300px] p-2 shadow-inner shadow-[#3775A2] mt-2"
            >
              <li className="flex items-center w-full text-[#3775A2] text-lg">
                <a
                  onClick={() => {
                    setSelectedService(null), setShowServiceDropdown(false);
                  }}
                  className="w-[275px] hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                >
                  All services
                </a>
              </li>
              {service.map((service) => (
                <li
                  key={service}
                  className="flex items-center text-[#3775A2] text-lg"
                >
                  <a
                    onClick={() => {
                      setSelectedService(service),
                        setShowServiceDropdown(false);
                    }}
                    className="w-full line-clamp-1 hover:bg-[#4c83a7] hover:text-[#eaf9e7] bg-[#eaf9e7] active:font-bold border-2 border-transparent active:border-[#4ca771]"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-1">
          <div
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg"
          >
            Select Month
          </div>
          {showMonthDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] w-52 p-2 shadow-inner shadow-[#3775A2] mt-2"
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
        <div className="col-span-1">
          <div
            onClick={() => setShowYearDropdown(!showYearDropdown)}
            className="font-semibold bg-[#3775A2] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#3775A2] border-2 border-[#3775A2] outline-none px-4 py-2 rounded-lg"
          >
            Select Year
          </div>
          {showYearDropdown && (
            <ul
              tabIndex={0}
              className="dropdown-content menu absolute bg-[#eaf9e7] rounded-box z-[1] w-52 p-2 shadow-inner shadow-[#3775A2] mt-2"
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

      <div className="grid grid-cols-12">
        <div className="col-span-4 w-full">
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <div className="w-full h-full">
              <div className="w-full">
                <Pie data={pieData} />
              </div>
            </div>
          )}
        </div>
        <div className="col-span-8">
          <div className="p-6">
            {filteredData.length > 0 && (
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-center rtl:text-center text-lg text-white dark:text-black">
                  <thead className="text-sm text-gray-700 uppercase  dark:bg-[#3775A2] dark:text-white">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Voucher ID
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Service IDs
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Total Used
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Total Discount
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 whitespace-nowrap"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(voucherStatistics).map((voucherId) => (
                      <tr
                        key={voucherId}
                        className="odd:bg-[#73B9EA] odd:dark:bg-[#73B9EA] even:bg-gray-50 even:dark:bg-[#5C97C5] border-b dark:border-[#67a1cd]"
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-black"
                        >
                          {voucherId}
                        </th>
                        <td className="px-6 py-4">
                          {serviceNames[
                            voucherStatistics[voucherId]?.serviceIDs
                          ] || "Unknown Service"}
                        </td>
                        <td className="px-6 py-4">
                          {voucherStatistics[voucherId].totalUsed}
                        </td>
                        <td className="px-6 py-4">
                          {formattedPrice(
                            voucherStatistics[voucherId].totalDiscount
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {voucherStatistics[voucherId].date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                          <Link
                            to="#"
                            className="font-medium text-black dark:text-black "
                          >
                            <FontAwesomeIcon
                              className="mr-2 mt-2"
                              icon={faCircleInfo}
                            />
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredData.length > 0 && !noDataFound && !noFilterData && (
        <div className="w-full p-8">
          <div className="w-full">
            <Line data={lineData} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(DashBoardPartner);
