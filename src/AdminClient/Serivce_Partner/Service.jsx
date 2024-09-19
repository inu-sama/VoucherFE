import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

const Service = () => {
  const [service, setService] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Url = "http://localhost:3000/api";

  const fetchService = async () => {
    try {
      const res = await fetch(`${Url}/getService`);
      const data = await res.json();
      setService(data);
    } catch (error) {
      alert("Error: " + (error?.message || "Failed to get service"));
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      {service.map((item) => (
        <div className="w-full my-4 grid grid-cols-3" key={item._id}>
          <span className="text-black text-xl">ID:{item._id}</span>
          <span className="text-black mx-4 text-xl">
            Name:{item.ServiceName}
          </span>
          <span className="text-xl">
            <FontAwesomeIcon icon={faCircleInfo} />
          </span>
        </div>
      ))}
    </div>
  );
};

export default Service;
