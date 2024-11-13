import { useState } from 'react';

const Report = () => {
  const [report, setReport] = useState({
    _id: "",
    Content: "",
    Voucher_ID: "",
    ReportedBy: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport({
      ...report,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('https://server-voucher.vercel.app/api/createReport', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(report), // Gửi dữ liệu dưới dạng JSON
      });

      if (!response.ok) {
        throw new Error('Không thể tạo báo cáo, vui lòng thử lại.');
      }

      const result = await response.json();
      
      setSuccessMessage("Báo cáo đã được tạo thành công!");
      setReport({ _id: result._id, Content: "", Voucher_ID: "", ReportedBy: "" }); // Reset form nếu cần

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-blue-600 mb-6">Tạo Báo Cáo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="Content" className="block text-lg font-medium text-gray-700">Nội dung:</label>
            <textarea
              id="Content"
              name="Content"
              value={report.Content}
              onChange={handleInputChange}
              placeholder="Nhập nội dung báo cáo"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Voucher_ID" className="block text-lg font-medium text-gray-700">Voucher ID:</label>
            <input
              type="text"
              id="Voucher_ID"
              name="Voucher_ID"
              value={report.Voucher_ID}
              onChange={handleInputChange}
              placeholder="Nhập Voucher ID"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ReportedBy" className="block text-lg font-medium text-gray-700">Người báo cáo:</label>
            <input
              type="text"
              id="ReportedBy"
              name="ReportedBy"
              value={report.ReportedBy}
              onChange={handleInputChange}
              placeholder="Nhập tên người báo cáo"
              required
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 mt-4 text-white font-semibold rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none`}
          >
            {loading ? 'Đang gửi...' : 'Tạo Báo Cáo'}
          </button>
        </form>

        {/* Hiển thị thông báo thành công hoặc lỗi */}
        {error && <div className="mt-4 text-red-600">{error}</div>}
        {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
      </div>
    </div>
  );
};

export default Report;
