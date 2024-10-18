import React, { useRef, useState, useEffect } from "react";
import mv from "../../assets/mv.mp4";
import "./CollectPoint.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import DetailVoucherCus from "./DetailVoucherCus";
import HeaderCus from "../../Header_Footer/HeaderCus";
import { useSearchParams } from "react-router-dom";

const CollectPoint = () => {
  const [searchParams] = useSearchParams();
  // const Service_ID = searchParams.get("Service");
  const videoRef = useRef(null);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVoucherVisible, setIsVoucherVisible] = useState(false);
  const [points, setPoints] = useState(0);
  const [fullscreenMessage, setFullscreenMessage] = useState("");
  const [user, setUser] = useState(null);
  const [vouchers, setVoucher] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [id, setid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const date = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const URL = "https://servervoucher.vercel.app/api";
  const token = localStorage.getItem("accessToken");

  const fetchListVoucher = async () => {
    try {
      const response = await fetch(`${URL}/CheckVoucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Service_ID: "SVCTake A Breath",
        }),
      });
      const data = await response.json();
      setVoucher(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchListVoucher();
  }, []);

  const fetchPoints = async () => {
    try {
      const response = await fetch(`${URL}/CheckPoint`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setPoints(data.Point);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPoints();
  });

  const fetchUser = async () => {
    try {
      const response = await fetch(`${URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userdata = await response.json();
      setUser(userdata);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleReceiveVoucher = async () => {
    try {
      const response = await fetch(`${URL}/ReceiveVoucher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Service_ID: "SVCTicket4Movie",
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        setIsVideoVisible(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play();
            videoRef.current.requestFullscreen();
          }
        }, 50);
        setid(data._id);
      } else {
        alert("Error: " + (data.message || "Failed to receive voucher"));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreenMessage("Bạn đã thoát khỏi chế độ toàn màn hình.");
        setIsVideoVisible(false);
        setIsVoucherVisible(true);
      } else {
        setFullscreenMessage("Video đang phát ở chế độ toàn màn hình.");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleDetail = (Voucher_ID) => {
    setShowDetail(true);
    setid(Voucher_ID);
    useEffect(() => {
      DetailFetch();
    }, [Voucher_ID]);
  };

  const handleClose = () => {
    window.location.reload();
  };

  const handleVideoEnded = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsVideoVisible(false);
      setIsVoucherVisible(true);
    }
  };

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
    <div className="w-ful bg-[#EAF8E6]">
      <HeaderCus />
      <div className="w-full mt-4 ">
        <h1 className="w-full text-4xl text-[#4ca771] text-center font-bold">
          WELCOME TO COLLECT POINT AT VOUCHER4U
        </h1>
        <div className="flex justify-center mt-9">
          <div className="w-1/2 flex">
            <img
              src={
                "https://static.vecteezy.com/system/resources/previews/007/296/443/original/user-icon-person-icon-client-symbol-profile-icon-vector.jpg"
              }
              alt="avatar"
              className="w-14 h-14 rounded-full"
            />
            <div className="mt-1 mx-2">
              <p className="text-[#4ca771]"> {user?.Name}</p>
              <p className="text-[#2F4F4F]"> {user?.email}</p>
            </div>
          </div>

          <span className="bg-[#4ca771] p-2 mt-3 w-fit h-fit text-white rounded-lg">
            Điểm: {points}
          </span>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-1/2 border-b rounded-lg bg-gray-300 h-6 mt-4 overflow-hidden">
            {" "}
            <div
              className="bg-green-500 rounded-lg h-full"
              style={{ width: `${Math.min(points, 100)}%` }}
            />
          </div>
        </div>

        <h1 className="w-full my-2 text-2xl text-center text-[#4ca771]">
          Các voucher khả dụng
        </h1>
        <div className="w-full flex justify-center">
          <div className="w-3/4 mt-4 h-[45vh] overflow-auto">
            <div className="flex flex-col items-center w-full">
              {vouchers.map((voucher) => (
                <div
                  key={voucher._id}
                  className="w-3/4 rounded-lg p-4 mb-2 bg-[#c0e6b3] text-[#2F4F4F] flex"
                >
                  <div className="w-3/4">
                    <h2 className="text-2xl font-bold mb-3">{voucher.Name}</h2>
                    <p>{voucher.Description}</p>
                    <p>
                      <span className="font-bold text-[#4ca771]">
                        Số lượng còn lại:
                      </span>{" "}
                      {voucher.RemainQuantity}
                    </p>
                    <p>
                      <span className="font-bold text-[#4ca771]">
                        Thời gian bắt đầu:
                      </span>{" "}
                      {date(voucher.ReleaseTime)}
                    </p>
                    <p>
                      <span className="font-bold text-[#4ca771]">
                        Thời gian hết hạn:
                      </span>{" "}
                      {date(voucher.ExpiredTime)}
                    </p>
                  </div>
                  <div className="w-1/4 flex items-center justify-end">
                    <button
                      onClick={() => handleDetail(voucher._id)}
                      className="bg-[#4ca771] hover:bg-[#eaf9e7] text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] p-2 rounded-lg flex items-center"
                    >
                      <FontAwesomeIcon className="mr-2" icon={faCircleInfo} />
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isVideoVisible && (
        <video
          ref={videoRef}
          width="600"
          autoPlay
          muted
          onEnded={handleVideoEnded}
          className="hidden-controls"
        >
          <source src={mv} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <br />
      {!isVideoVisible && !isVoucherVisible && (
        <div className="w-full flex justify-center">
          <button
            className="bg-green-400 p-4 m-4 text-white rounded-xl "
            onClick={handleReceiveVoucher}
          >
            Quay voucher
          </button>
        </div>
      )}
      {isVoucherVisible && (
        <div
          className="flex w-full h-[100vh] absolute top-0 z-50 left-0 bg-white justify-center items-center"
          style={{ pointerEvents: "auto" }}
        >
          <div className="text-center bg-[#eaf9e7] w-1/2 h-fit relative z-50 opacity-100 p-4">
            <h1 className="text-3xl font-bold text-[#4ca771] ">
              Chúc mừng bạn đã trúng voucher
            </h1>
            <DetailVoucherCus id={id} />
            <button
              onClick={handleClose}
              className="bg-[#eaf9e7] hover:bg-[#4ca771] m-2 w-fit p-2 rounded-xl border-4 border-[#4ca771] hover:text-[#eaf9e7] font-bold "
            >
              Thoát
            </button>
          </div>
        </div>
      )}
      {showDetail && (
        <div
          className="flex w-full h-[100vh] absolute top-0 z-50 left-0 justify-center items-center"
          style={{ pointerEvents: "auto" }}
        >
          <div className="absolute w-full h-full bg-black opacity-50 top-0 left-0 z-40"></div>

          <div className="text-center bg-[#eaf9e7] w-1/2 h-fit relative z-50 opacity-100 p-4">
            <DetailVoucherCus id={id} />
            <button
              onClick={handleClose}
              className="bg-[#eaf9e7] hover:bg-[#4ca771] w-fit p-2 rounded-xl border-4 border-[#4ca771] hover:text-[#eaf9e7] font-bold "
            >
              Thoát
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectPoint;
