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

  const fetchService = async (serviceId) => {
    try {
      const res = await fetch(`${Url}/getServiceID/${serviceId}`);
      const data = await res.json();
      setService(data);
    } catch (error) {
      alert("Error: " + (error?.message || "Failed to get service"));
      setError("Không thể lấy dữ liệu từ máy chủ");
    }
  };

  useEffect(() => {
    fetchPartner();
  }, []);

  useEffect(() => {
    if (partner.length > 0) {
      fetchService(partner[0]?.Service_ID);
    }
  }, [partner]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      {partner.map((item) => (
        <div className="w-full my-4 grid grid-cols-4" key={item._id}>
          <span className="text-black text-xl">ID: {item._id}</span>
          <span className="text-black mx-4 text-xl">Name: {item.Name}</span>
          <span className="text-black mx-4 text-xl">
            Service: {service?.ServiceName || "Loading..."}
          </span>
          <span className="text-xl mx-4">
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Partner;
