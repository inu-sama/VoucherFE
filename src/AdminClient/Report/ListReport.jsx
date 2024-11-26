import { useState, useEffect } from "react";

const ListReport = () => {
  const [reports, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedState, setSelectedState] = useState("All");

  const solveReport = async (reportID) => {
    try {
      const res = await fetch(
        "https://server-voucher.vercel.app/api/SolveReport/" + reportID,
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
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

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
      setSelectedReport(data[0]);
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 text-[#2F4F4F] text-lg">
      <div className="w-full grid grid-cols-2">
        <h1 className="w-full text-center text-3xl font-bold mb-6">
          Danh sách báo cáo
        </h1>
        <div className="w-full flex items-center justify-center">
          <select
            name=""
            id="reportSort"
            onChange={() => {
              setSelectedState(document.getElementById("reportSort").value);
            }}
            className="font-semibold bg-[#4BA771] hover:bg-[#e8f9e7] text-[#eaf9e7] hover:text-[#4BA771] border-2 border-[#4BA771] outline-none px-4 py-2 rounded-lg">
            <option value="All">All reports</option>
            <option value="Solve">Solved</option>
            <option value="UnSolve">Unsolved</option>
          </select>
        </div>
      </div>
      <div className="w-full max-w-4xl space-y-4">
        {reports.map((report) => {
          if (
            selectedState == "All" ? true : report.StateReport == selectedState
          )
            return (
              <div
                key={report._id}
                className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <div>
                  <div className="bg-[#4ca771] text-[#fff] text-center text-2xl font-bold py-2 rounded-t-lg rounded-r-lg">
                    {" "}
                    Mã báo cáo {report._id}
                  </div>
                  <div className="grid grid-cols-12">
                    <div className="col-span-8 grid grid-cols-12">
                      <span className="col-span-4 py-2 px-6 bg-[#4ca771] font-bold text-[#fff]">
                        Voucher ID:
                      </span>
                      <span className="col-span-8 py-2 pr-20 text-right">
                        {report.Voucher_ID}
                      </span>

                      <span className="col-span-5 py-2 px-6 bg-[#4ca771] font-bold text-[#fff] rounded-tr-lg">
                        Người báo cáo:
                      </span>
                      <span className="col-span-7 py-2 pr-20 text-right">
                        {report.ReportedBy}
                      </span>

                      <span className="col-span-6 py-2 px-6 bg-[#4ca771] font-bold text-[#fff] rounded-tr-lg">
                        Trạng thái:
                      </span>
                      <span className="col-span-6 py-2 pr-20 text-right">
                        {report.StateReport}
                      </span>

                      <span className="col-span-7 py-2 px-6 bg-[#4ca771] font-bold text-[#fff] rounded-r-lg rounded-b-lg">
                        Ngày báo cáo:
                      </span>
                      <span className="col-span-5 py-2 pr-20 text-right">
                        {new Date(report.DayReport).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="col-span-4 flex items-center justify-center text-2xl font-extrabold pl-10 py-4">
                      {report.StateReport == "UnSolve" ? (
                        <p
                          onClick={() => {
                            solveReport(report._id);
                            location.reload();
                          }}
                          className="cursor-pointer w-full h-full border-8 border-[#4ca771] bg-[#4ca771] text-[#fff] hover:bg-[#fff] hover:text-[#4ca771] flex items-center justify-center rounded-lg">
                          Solve
                        </p>
                      ) : (
                        <p className="w-full h-full border-8 border-[#4ca771] bg-[#eaf9e7] text-[#4ca771] flex items-center justify-center rounded-lg">
                          Already Solved
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="block font-bold px-6">Nội dung: </span>
                    <p className="text-gray-800 mt-1 line-clamp-2">
                      {report.Content}
                    </p>
                    <p
                      onClick={() => {
                        document.getElementById("reportContent").showModal();
                        setSelectedReport(report);
                      }}
                      className="w-full text-right cursor-pointer hover:text-[#4ca771]">
                      ...xem thêm.
                    </p>
                    <dialog id="reportContent" className="modal">
                      <div className="modal-box">
                        <form method="dialog">
                          {/* if there is a button in form, it will close the modal */}
                          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                          </button>
                        </form>
                        <h3 className="font-bold text-lg">
                          Nội dung báo cáo {selectedReport._id}
                        </h3>
                        <p className="py-4">{selectedReport.Content}</p>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default ListReport;
