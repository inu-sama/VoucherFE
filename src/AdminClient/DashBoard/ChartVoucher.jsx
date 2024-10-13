import { memo, useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const ChartVoucher = () => {
  const [selectedMonth, setSelectedMonth] = useState(""); // Lưu tháng được chọn
  const [selectedYear, setSelectedYear] = useState(""); // Lưu năm được chọn
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc

  // Hàm fetch dữ liệu từ API
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        "https://server-voucher.vercel.app/api/Statistical_Voucher"
      );
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setHistory(data);
      console.log(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Xử lý sự kiện thay đổi tháng
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // Xử lý sự kiện thay đổi năm
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  // Lọc dữ liệu dựa trên tháng và năm
  const filterDataByMonthAndYear = () => {
    if (!selectedMonth || !selectedYear || !history.length) return;

    const filtered = history.filter((item) => {
      const voucherDate = new Date(item.Date);
      return (
        voucherDate.getMonth() + 1 === parseInt(selectedMonth) && // Lọc theo tháng
        voucherDate.getFullYear() === parseInt(selectedYear) // Lọc theo năm
      );
    });
    setFilteredData(filtered);
  };

  // Khi người dùng nhấn nút tìm kiếm
  const handleSearch = () => {
    filterDataByMonthAndYear(); // Lọc dữ liệu dựa vào tháng và năm
  };

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

  if (!history || history.length === 0) return <div>No data available.</div>;

  // Chuẩn bị dữ liệu cho biểu đồ
  const voucherTotalDiscount = {}; // Tổng tiền giảm giá của mỗi voucher
  const pieChartData = {
    labels: [], // Nhãn cho Pie chart
    datasets: [
      {
        label: "Tổng tiền giảm giá của Voucher",
        data: [], // Dữ liệu cho Pie chart (tổng tiền giảm giá)
        backgroundColor: [
          "rgba(75,192,192,0.4)",
          "rgba(255,99,132,0.4)",
          "rgba(255,206,86,0.4)",
          "rgba(54,162,235,0.4)",
          "rgba(153,102,255,0.4)",
          "rgba(255,159,64,0.4)",
        ],
        borderColor: [
          "rgba(75,192,192,1)",
          "rgba(255,99,132,1)",
          "rgba(255,206,86,1)",
          "rgba(54,162,235,1)",
          "rgba(153,102,255,1)",
          "rgba(255,159,64,1)",
        ],
        borderWidth: 1,
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  filteredData.forEach((item) => {
    const { Voucher_ID, TotalDiscount } = item;

    if (voucherTotalDiscount[Voucher_ID]) {
      voucherTotalDiscount[Voucher_ID] += TotalDiscount; // Tính tổng tiền giảm giá
    } else {
      voucherTotalDiscount[Voucher_ID] = TotalDiscount; // Khởi tạo tổng tiền giảm giá
    }
  });

  // Cập nhật dữ liệu cho Pie chart
  Object.keys(voucherTotalDiscount).forEach((Voucher_ID) => {
    pieChartData.labels.push(Voucher_ID);
    pieChartData.datasets[0].data.push(voucherTotalDiscount[Voucher_ID]);
  });

  const lineChartData = {
    labels: pieChartData.labels, // Dùng chung nhãn với Pie chart
    datasets: [
      {
        label: "Tổng tiền giảm giá của Voucher",
        data: pieChartData.datasets[0].data, // Dữ liệu dùng chung (tổng tiền giảm giá)
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true, // Bắt đầu trục Y từ 0 cho Line chart
      },
    },
    maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ cố định, cho phép thay đổi kích thước
  };

  // Tùy chọn cho Pie chart để tắt đường gạch
  const pieChartOptions = {
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false, // Vô hiệu hóa tỷ lệ cố định
  };

  return (
    <div className="xl:w-full h-[300px]">
      {" "}
      {/* Điều chỉnh kích thước container */}
      <select value={selectedMonth} onChange={handleMonthChange}>
        <option value="">Chọn tháng muốn thống kê</option>
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>
            Tháng {i + 1}
          </option>
        ))}
      </select>
      <select value={selectedYear} onChange={handleYearChange}>
        <option value="">Chọn năm</option>
        {[2021, 2022, 2023, 2024].map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <button onClick={handleSearch} disabled={!selectedMonth || !selectedYear}>
        Tìm kiếm
      </button>
      <Line data={lineChartData} options={chartOptions} />
      <Pie data={pieChartData} options={pieChartOptions} />
    </div>
  );
};

export default memo(ChartVoucher);
