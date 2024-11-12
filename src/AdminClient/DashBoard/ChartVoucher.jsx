import { memo, useState, useEffect } from "react";
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
  const [year, setYear] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [voucherStatistics, setVoucherStatistics] = useState({});
  const [noFilterData, setNoFilterData] = useState(false);
  const [colors, setColors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [filterDetail, setFilterDetail] = useState([]);

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const Popup = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl relative">
          {/* Nút đóng */}
          <button
            className="absolute top-4 right-4 text-xl font-bold text-gray-700"
            onClick={() => setShowPopup(false)} // Đóng popup khi nhấn nút
          >
            &times; {/* Biểu tượng đóng (X) */}
          </button>
  
          <h3 className="text-2xl font-semibold mb-4">Voucher Detail</h3>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Voucher ID</th>
                <th className="px-4 py-2 text-left border-b">Partner ID</th>
                <th className="px-4 py-2 text-left border-b">Service ID</th>
                <th className="px-4 py-2 text-left border-b">Discount</th>
              </tr>
            </thead>
            <tbody>
              {filterDetail.map((voucher) => (
                <tr key={voucher.Voucher_ID}>
                  <td className="px-4 py-2 border-b">{voucher.Voucher_ID}</td>
                  <td className="px-4 py-2 border-b">{voucher.Partner_ID}</td>
                  <td className="px-4 py-2 border-b">{voucher.haveVouchers.map((v) => v.Service_ID).join(", ")}</td>
                  <td className="px-4 py-2 border-b">{voucher.TotalDiscount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "https://server-voucher.vercel.app/api/Statistical_VoucherAdmin"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setHistory(data);

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

    fetchHistory();
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
    setFilterDetail(voucher);
    setNoDataFound(voucher.length === 0);
    setShowPopup(true); // Show the popup when a voucher is selected
  };

  useEffect(() => {
    filterData();
  }, []);

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

  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  if (isLoading) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-4xl translate-y-1/2 h-full font-extrabold">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="text-[#2F4F4F]">
      <div className="w-full grid grid-cols-3 p-6 gap-6">
        <div className="col-span-1">
          <p className="text-lg font-semibold">Service:</p>
          <select
            value={selectedService}
            onChange={(e) => {
              setSelectedService(e.target.value);
              filterData();
            }}
            className="w-full"
          >
            <option value="">Select Service</option>
            {service.map((serviceId, index) => (
              <option key={index} value={serviceId}>
                {serviceId}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <p className="text-lg font-semibold">Month:</p>
          <select
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value);
              filterData();
            }}
            className="w-full"
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-1">
          <p className="text-lg font-semibold">Year:</p>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              filterData();
            }}
            className="w-full"
          >
            <option value="">Select Year</option>
            {year.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {noDataFound && !noFilterData && (
        <p>Không tìm thấy dữ liệu, vui lòng chọn lại</p>
      )}

      <div className="grid lg:grid-cols-12">
        <div className="lg:col-span-4">
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <div style={{ width: "400px", margin: "50px auto" }}>
              <Pie data={pieData} />
            </div>
          )}
        </div>
        <div className="lg:col-span-8">
          <div className="p-6">
            {filteredData.length > 0 && (
              <table className="">
                <thead>
                  <tr>
                    <th>Voucher ID</th>
                    <th>Partner ID</th>
                    <th>Service IDs</th>
                    <th>Total Used</th>
                    <th>Total Discount</th>
                    <th>Date</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(voucherStatistics).map((voucherId) => (
                    <tr key={voucherId}>
                      <td>{voucherId}</td>
                      <td>{voucherStatistics[voucherId].partnerID}</td>
                      <td>{voucherStatistics[voucherId].serviceIDs}</td>
                      <td>{voucherStatistics[voucherId].totalUsed}</td>
                      <td>{voucherStatistics[voucherId].totalDiscount}</td>
                      <td>{voucherStatistics[voucherId].date}</td>
                      <td>
                        <button
                          className="border-2 rounded"
                          onClick={() => filterDetailData(voucherId)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <div className="w-[600px] my-[50px] mx-auto">
              <Line data={lineData} />
            </div>
          )}
        </div>
      </div>

      {/* Show popup when data is available */}
      {showPopup && <Popup />}
    </div>
  );
};

export default memo(ChartVoucher);
