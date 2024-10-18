import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Partner = () => {
  const [partner, setPartner] = useState([]);
  const [service, setService] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const Url = "http://localhost:3000/api";
  const Url = "https://servervoucher.vercel.app/api";

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
    <div className="w-full p-10">
      <div className="grid grid-cols-12 text-xl font-bold text-[#2F4F4F]">
        <div className="col-span-5 bg-[#c0e6ba] p-4 text-center rounded-tl-2xl">
          Partner ID
        </div>
        <div className="col-span-5 bg-[#c0e6ba] p-4 text-center rounded-tr-2xl">
          Partner Name
        </div>
        {/* <div className="col-span-2"></div> */}
      </div>
      <div className="rounded-b-2xl text-[#2F4F4F] text-xl rounded-tr-2xl border-4 border-[#c0e6ba] bg-[#c0e6ba] overflow-hidden">
        {partner.map((item) => (
          <div className="w-full grid grid-cols-12" key={item._id}>
            <div className="col-span-5 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center rounded-bl-xl">
              {item._id}
            </div>
            <div className="col-span-5 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center">
              {item.Mail}
            </div>
            <div className="col-span-2 border-4 border-[#c0e6ba] bg-[#eaf9e7] p-4 text-center rounded-r-xl">
              <FontAwesomeIcon icon={faCircleInfo} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Partner;
