import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Partner = () => {
  const [partner, setPartner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const Url = "http://localhost:3000/api";
  const Url = "https://server-voucher.vercel.app/api";

  const fetchPartner = async () => {
    try {
      const res = await fetch(`${Url}/getPartner`);
      const data = await res.json();
      setPartner(data);
    } catch (error) {
      alert("Error: " + (error?.message || "Failed to get partner"));
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartner();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full lg:p-10 p-2">
      <div className="grid grid-cols-12 text-xl font-bold text-[#2F4F4F]">
        <div className="lg:col-span-2 col-span-4 bg-[#c0e6ba] p-4 text-center rounded-tl-2xl">
          STT
        </div>
        <div className="col-span-5 bg-[#c0e6ba] p-4 text-center lg:block hidden">
          Partner ID
        </div>
        <div className="lg:col-span-5 col-span-8 bg-[#c0e6ba] p-4 text-center rounded-tr-2xl">
          Partner Name
        </div>
      </div>
      <div className="rounded-b-2xl text-[#2F4F4F] text-xl  border-4 border-[#c0e6ba] bg-[#c0e6ba] overflow-hidden">
        {partner.map((item, index) => (
          <div className="w-full grid grid-cols-12" key={item._id}>
            <div className="lg:col-span-2 col-span-4 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center rounded-xl">
              {index + 1}
            </div>
            <div className="col-span-5 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center rounded-xl lg:block hidden">
              {item._id}
            </div>
            <div className="lg:col-span-5 col-span-8 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center rounded-xl overflow-hidden">
              {item.Mail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partner;
