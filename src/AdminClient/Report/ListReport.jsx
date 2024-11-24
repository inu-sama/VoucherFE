import { useState, useEffect } from "react";

const ListReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListReport = async () => {
    try {
      const res = await fetch(
        "https://server-voucher.vercel.app/api/getReport",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("Token")}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await res.json();
      setReport(data);
      console.log("Dữ liệu nhận được:", data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListReport();
  }, []);

  if (loading) {
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Danh sách báo cáo
      </h1>
      <div className="w-full max-w-4xl space-y-4">
        {report.map((report) => (
          
          <div
            key={report._id}
            className="bg-white p-6 rounded-lg shadow-lg border border-gray-200"
          >
            <div>
              <div className=" bg-blue-600 text-center text-2xl font-bold py-2 mb-2"> Mã báo cáo {report._id}</div>
              <div className="grid grid-cols-2 gap-2">
                <span className="font-medium text-gray-600">Voucher ID:</span>
                <span className="text-gray-800">{report.Voucher_ID}</span>

                <span className="font-medium text-gray-600">
                  Người báo cáo:
                </span>
                <span className="text-gray-800">{report.ReportedBy}</span>

                <span className="font-medium text-gray-600">Trạng thái:</span>
                <span className="text-gray-800">{report.StateReport}</span>

                <span className="font-medium text-gray-600">Ngày báo cáo:</span>
                <span className="text-gray-800">
                  {new Date(report.DayReport).toLocaleString()}
                </span>
              </div>
              <div className="mt-4">
                <span className="block font-medium text-gray-600">
                  Nội dung:
                </span>
                <p className="text-gray-800 mt-1">{report.Content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListReport;
