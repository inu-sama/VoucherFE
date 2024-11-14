import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
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

const DetailDashBoard = () => {
  const { id } = useParams();
  const { month } = useParams();
  const { year } = useParams();
  const [history, setHistory] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [totalUse, settotalUse] = useState(0);
  const [totalDiscount, settotalDiscount] = useState(0);
  const [firstdate, setfirstdate] = useState("");
  const [lastdate, setlastdate] = useState("");
  const [totalCus, settotalCus] = useState(0);
  const [customer, setCustomer] = useState([]);
  const [serviceNames, setServiceNames] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const URL = "https://server-voucher.vercel.app/api";

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const aggregateDataByDate = (data) => {
    const result = data.reduce((acc, item) => {
      const { Date: dateString, TotalDiscount } = item;

      const date = new Date(dateString).toISOString().split("T")[0];

      const existingEntry = acc.find((entry) => entry.date === date);

      if (existingEntry) {
        existingEntry.totalDiscount += TotalDiscount;
      } else {
        acc.push({
          date,
          totalDiscount: TotalDiscount,
        });
      }

      return acc;
    }, []);

    return result.map(({ date, totalDiscount }) => ({
      date,
      totalDiscount,
    }));
  };

  const aggregatedData = aggregateDataByDate(history);

  const chartData = {
    labels: aggregatedData.map((item) => item.date),
    datasets: [
      {
        label: "Total Discount",
        data: aggregatedData.map((item) => item.totalDiscount),
        fill: false,
        borderColor: "#0040ff",
        tension: 0.4,
      },
    ],
  };

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchDetailHistory = async () => {
    try {
      const response = await fetch(
        `${URL}/Statistical_ID/${id}/${month}/${year}`
      );
      const data = await response.json();
      setHistory(data.history);
      setVoucher(data.voucher);
      console.log("his", data.history);
      console.log("vou", data.voucher);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetailHistory();
  }, [id]);

  useEffect(() => {
    if (history.length > 0) {
      setfirstdate(history[0].Date);
      setlastdate(history[history.length - 1].Date);

      let discountSum = 0;
      let uniqueCustomers = new Set();

      for (let i = 0; i < history.length; i++) {
        discountSum += history[i].TotalDiscount;
        uniqueCustomers.add(history[i].CusID);
      }

      settotalDiscount(discountSum);
      settotalCus(uniqueCustomers.size);
      setCustomer(Array.from(uniqueCustomers));
      settotalUse(history.length);
    }
  }, [history]);

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
    if (voucher) {
      const fetchServiceNames = async () => {
        const names = {};
        for (const haveVoucher of voucher[0].haveVouchers) {
          names[haveVoucher.Service_ID] = await fetchServiceID(
            haveVoucher.Service_ID
          );
        }
        setServiceNames(names);
      };
      if (voucher[0].haveVouchers.length > 0) {
        fetchServiceNames();
      }
    }
  }, [voucher]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        font: { size: "20px" },
        display: true,
        text: "Biểu đồ thống kê số tiền giảm giá theo tháng",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

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
    <div className="text-[#2F4F4F] p-4 w-full h-full bg-gradient-to-bl to-[#75bde0] from-30%  from-[#d0d0d0]">
      <h1 className="text-3xl text-black font-bold text-center">
        DETAIL DASHBOARD OF VOUCHER
      </h1>
      <div className="col-span-1 float-right mr-4  flex items-center ">
        <Link to={`/Partner/DashBoardPartner`}>
          <button className="bg-[#eaf9e7] hover:bg-[#5591bc] w-10 h-10 border-4 border-[#5591bc] hover:text-[#eaf9e7] font-bold rounded-full">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </Link>
      </div>
      <p className="text-3xl text-[#517f95] font-bold text-center">{id}</p>
      <div className="grid grid-cols-4 gap-[30px] mt-[25px] pb-[15px]">
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#4E73DF] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#B589DF] text-[11px] leading-[17px] font-bold">
              TỔNG TIỀN ĐƯỢC GIẢM GIÁ
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {formattedPrice(totalDiscount)}
            </h1>
          </div>
        </div>
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#1CC88A] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              SỐ KHÁCH HÀNG SỬ DỤNG
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {totalCus}
            </h1>
          </div>
        </div>
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#36B9CC] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              NGÀY BẮT ĐẦU-NGÀY KẾT THÚC
            </h2>
            <h1 className="text-[17px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {date(firstdate)} - {date(lastdate)}
            </h1>
          </div>
        </div>
        <div className="h-[100px] rounded-[8px] bg-white border-l-[4px] border-[#F6C23E] flex items-center justify-between px-[30px] cursor-pointer hover:shadow-lg transform hover:scale-[103%] transition duration-300 ease-out">
          <div>
            <h2 className="text-[#1cc88a] text-[11px] leading-[17px] font-bold">
              SỐ LƯỢNG VOUCHER SỬ DỤNG
            </h2>
            <h1 className="text-[20px] leading-[24px] font-bold text-[#5a5c69] mt-[5px]">
              {totalUse}
            </h1>
          </div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 grid-cols-1">
        <div className="p-10">
          <img
            className="w-full rounded-xl h-auto object-cover"
            src={voucher[0].Image}
            alt="Voucher"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://www.thermaxglobal.com/wp-content/uploads/2020/05/image-not-found.jpg";
            }}
          />
        </div>
        <div className="w-full mt-9 text-[#3B7097]">
          <h1 className="text-3xl font-bold mb-2">{voucher[0].Name}</h1>
          <div className="w-full border-b border-[#3B7097] mb-10">
            <span className="text-xl text-[#3f5f89]">{voucher[0]._id}</span>
            <span className="float-right font-bold text-xl text-[#3f5f89]">
              Trạng thái:{" "}
              <span
                className={`font-normal ${
                  voucher[0].States === "Enable"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {voucher[0].States}
              </span>
            </span>
          </div>
          <div>
            <p className="text-xl my-2 flex justify-between pr-10">
              <span className="font-bold text-[#3f5f89]">
                Số lượng sử dụng:{" "}
              </span>
              <span className=" text-[#3f5f89]">
                {voucher[0].AmountUsed || totalUse}
              </span>
            </p>
            <p className="text-xl my-2 flex justify-between pr-10">
              <span className="font-bold text-[#3f5f89]">Mức giảm: </span>
              <span className=" text-[#3f5f89]">
                {voucher[0].PercentDiscount || "N/A"}%
              </span>
            </p>
            <p className="text-xl my-2 flex justify-between pr-10">
              <span className="font-bold text-[#3f5f89]">Mô tả: </span>
              <span className=" text-[#3f5f89]">
                {voucher[0].Description || "N/A"}
              </span>
            </p>
            <div className="my-4 bg-[#c5e2eb] shadow-inner shadow-[#82C0DF] rounded-lg p-2 mb-5">
              {voucher[0].haveVouchers && voucher[0].haveVouchers.length > 0 ? (
                voucher[0].haveVouchers.map((haveVoucher) => (
                  <div key={haveVoucher._id}>
                    <p>
                      <span className="text-[#3f5f89] text-xl font-semibold">
                        Service:
                      </span>{" "}
                      <span className="text-[#3f5f89] text-xl font-normal">
                        {serviceNames[haveVoucher.Service_ID] || "Loading..."}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-[#3f5f89] font-semibold">Toàn bộ service</p>
              )}
            </div>
            <div className="my-4 bg-[#c5e2eb] h-[150px] overflow-auto  shadow-inner shadow-[#82C0DF] rounded-lg p-2 mb-5">
              <h1 className="text-xl text-center py-2  font-semibold text-[#3f5f89]">
                DANH SÁCH KHÁCH HÀNG SỬ DỤNG
              </h1>
              {customer.map((cus, index) => (
                <div key={cus}>
                  <p>
                    <span className="text-[#3f5f89] text-xl font-semibold">
                      {index + 1}.
                    </span>{" "}
                    <span className="text-[#3f5f89] text-xl font-normal">
                      {cus}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <div className="relative h-[300px] overflow-auto shadow-md sm:rounded-lg">
          <table className="w-full text-center rtl:text-center text-lg text-white dark:text-[#2a5879]">
            <thead className="text-sm text-gray-700 uppercase  dark:bg-[#8AC5E2] dark:text-[#2a5879]">
              <tr className="text-lg">
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  STT
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Total Discount
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => (
                <tr
                  key={(item._id, index)}
                  className="odd:bg-[#D9E6EB] odd:dark:bg-[#D9E6EB] even:bg-gray-50 even:dark:bg-[#C9DEE9] border-b dark:border-[#baccd6] text-md"
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">
                    {formattedPrice(item.TotalDiscount)}
                  </td>
                  <td className="px-6 py-4">{item.CusID}</td>
                  <td className="px-6 py-4">{date(item.Date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <Line data={chartData} options={options}></Line>
      </div>
    </div>
  );
};

export default DetailDashBoard;
