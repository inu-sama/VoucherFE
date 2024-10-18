import React, { useEffect, useState } from "react";

const DetailVoucherCus = ({ id }) => {
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const URL = "https://servervoucher.vercel.app/api";

  const date = (a) => {
    return new Date(a).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/DetailVoucher/${id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      console.log("Dữ liệu nhận được:", data);
      setVoucher(data[0]);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
      console.error("Lỗi fetch:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("voucher updated:", voucher);
  }, [voucher]);

  useEffect(() => {
    DetailFetch();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center w-full text-4xl translate-y-1/2 h-full font-extrabold">
        Loading...
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
    <div className="lg:bg-[#eaf9e7] bg-[#4ca771]">
      <div className="w-full bg-[#eaf9e7] p-4 rounded-t-xl">
        <div className="grid lg:grid-cols-2 grid-cols-1">
          <div className="p-10">
            <img
              className="w-full rounded-xl h-auto object-cover"
              src={voucher.Image}
              alt="Voucher"
            />
          </div>
          <div className="w-full text-[#2F4F4F]">
            <h1 className="text-3xl font-bold mb-2">{voucher.Name}</h1>
            <div className="w-full border-b border-[#4ca771] mb-10">
              <span className="text-xl text-[#4ca771]">{voucher._id}</span>
            </div>
            <div>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">Ngày hết hạn: </span>
                {voucher.ExpiredTime ? date(voucher.ExpiredTime) : "N/A"}
              </p>
              <p className="text-xl my-2 flex justify-between pr-10">
                <span className="font-bold text-[#4ca771]">Mô tả: </span>
                {voucher.Description || "N/A"}
              </p>
              <div className="">
                {voucher.conditions && voucher.conditions.length > 0 ? (
                  voucher.conditions.map((condition, index) => (
                    <div
                      key={condition._id}
                      className="font-semibold border-y-2"
                    >
                      <h1>
                        Điều kiện: {index + 1} {condition.index}
                      </h1>{" "}
                      <p className="text-xl my-2 flex justify-between pr-10">
                        <span className="font-bold text-[#4ca771]">
                          Giá trị tối thiểu:{" "}
                        </span>
                        {condition.MinValue || "N/A"}đ
                      </p>
                      <p className="text-xl my-2 flex justify-between pr-10">
                        <span className="font-bold text-[#4ca771]">
                          Giá trị tối đa:
                        </span>
                        {condition.MaxValue}đ
                      </p>
                      <p className="text-xl my-2 flex justify-between pr-10">
                        <span className="font-bold text-[#4ca771]">
                          Giảm giá:
                        </span>
                        {condition.PercentDiscount}%
                      </p>
                    </div>
                  ))
                ) : (
                  <p>Không có điều kiện áp dụng.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailVoucherCus;
