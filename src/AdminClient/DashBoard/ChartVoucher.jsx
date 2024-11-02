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

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "https://server-voucher.vercel.app/api/Statistical_VoucherFindPartner_Service"
        );
        // const res = await fetch(
        //   "https://servervoucher.vercel.app/api/Statistical_VoucherFindPartner_Service"
        // );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        console.log(data);
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
            <option value="">All Services</option>
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
            <>
              {/* Pie Chart - Voucher ID vs Total Used */}
              <div style={{ width: "400px", margin: "50px auto" }}>
                <Pie data={pieData} />
              </div>
            </>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {filteredData.length > 0 && !noDataFound && !noFilterData && (
            <>
              {/* Line Chart - Voucher ID vs Total Discount */}
              <div className="w-[600px] my-[50px] mx-auto">
                <Line data={lineData} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Chỉ hiển thị biểu đồ nếu có dữ liệu được lọc */}
    </div>
  );
};

export default memo(ChartVoucher);
