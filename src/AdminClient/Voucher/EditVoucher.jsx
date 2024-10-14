import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate

const EditVoucher = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Voucher, setVoucher] = useState({});
  const [description, setDescription] = useState({
    value: Voucher.Description,
  });
  // const URL = "http://localhost:3000/api";
  const URL = "https://servervoucher.vercel.app/api";
  const navigate = useNavigate();

  const handleState = async (id) => {
    try {
      const res = await fetch(`${URL}/updateState/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.status === 400) {
        alert("Error: " + (data?.message || "Failed to update state"));
      } else {
        navigate(`/Admin/Detailvoucher/${id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const date = (a) => {
    return new Date(a).toLocaleDateString("en-CA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const DetailFetch = async () => {
    try {
      const res = await fetch(`${URL}/Detailvoucher/${id}`);
      const data = await res.json();
      setData(data[0]);
      setVoucher(data[0]);
    } catch (error) {
      setError("Không thể lấy dữ liệu từ máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    DetailFetch();
  }, [id]);

  const updateCondition = async (id) => {
    try {
      const res = await fetch(`${URL}/updateCondition/:${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          MinValue: document.getElementById("updateMin").value,
          MaxValue: document.getElementById("updateMax").value,
          PercentDiscount: document.getElementById("updatePercentage").value,
        }),
      });
      const data = await res.json();
      if (res.status === 400) {
        alert("Error: " + (data?.message || "Failed to update condition"));
      } else {
        alert("Condition updated successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedVoucher = {
      PercentDiscount: Voucher.PercentDiscount || data.PercentDiscount,
      Description: Voucher.Description || data.Description,
      ExpiredTime: Voucher.ExpiredTime || data.ExpiredTime,
      ReleaseTime: Voucher.ReleaseTime || data.ReleaseTime,
      Image: Voucher.Image || data.Image,
      RemainQuantity: Voucher.RemainQuantity || data.RemainQuantity,
      MinValue: Voucher.MinValue || data.MinValue,
      MaxValue: Voucher.MaxValue || data.MaxValue,
    };

    try {
      const res = await fetch(`${URL}/updateVoucher/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedVoucher),
      });
      const result = await res.json();
      if (!res.ok) {
        alert("Error: " + (result.message || "Failed to update voucher"));
      } else {
        const res1 = await fetch(`${URL}/updateState/${id}`, {
          method: "POST",
        });
        const data = await res1.json();
        if (res.status === 400) {
          alert("Error: " + (data?.message || "Failed to update state"));
        }
        alert("Voucher updated successfully");
        navigate("/Admin/Listvoucher");
      }
    } catch (err) {
      alert("Error: " + (err.message || "Failed to update voucher"));
      console.log(err);
    }
  };

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
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="w-auto h-full bg-[#eaf9e7] p-4">
        <h1 className="text-4xl text-[#2F4F4F] px-4 mt-4 w-full text-left font-bold">
          Sửa voucher
        </h1>
        <p className="p-4 text-[#4ca771] w-full text-xl mb-10">
          <span className="font-bold">Chú ý:</span> Sửa những trường voucher mà
          bạn muốn
        </p>
        <div className="grid lg:grid-cols-12 grid-cols-1">
          <div className="w-full px-4 col-span-8">
            <h1 className="text-3xl font-bold text-[#2F4F4F] mb-5">
              {data.Name}
            </h1>
            <div className="w-full border-b-2">
              <span className="text-xl text-[#4ca771]">{data._id}</span>
              <span className="float-right font-bold text-xl text-[#4ca771]">
                Trạng thái:{" "}
                <span
                  className={`font-normal ${
                    data.States === "enable" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {data.States}
                </span>
              </span>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="my-10 grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
                <div className="col-span-12">
                  <label className="font-bold">Description</label>
                </div>
                <div className="col-span-12">
                  <input
                    className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg"
                    type="text"
                    value={`${Voucher.Description}`}
                    // ref={input}
                    placeholder="Mô tả"
                    onChange={(e) =>
                      setVoucher({ ...Voucher, Description: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Release Time</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      value={date(Voucher.ReleaseTime)}
                      className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="date"
                      onChange={(e) =>
                        setVoucher({ ...Voucher, ReleaseTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Expired Time</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      value={date(data.ExpiredTime)}
                      className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="date"
                      onChange={(e) =>
                        setVoucher({ ...Voucher, ExpiredTime: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Image</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      placeholder="Ảnh minh họa"
                      value={Voucher.Image}
                      className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="text"
                      onChange={(e) =>
                        setVoucher({ ...Voucher, Image: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-12 items-center bg-[#c0e6ba] text-[#4ca771] py-1 pl-4 rounded-lg h-12">
                  <div className="col-span-12">
                    <label className="font-bold">Quantity</label>
                  </div>
                  <div className="col-span-12">
                    <input
                      value={Voucher.RemainQuantity}
                      placeholder={`Số lượng còn lại: ${data.RemainQuantity}`}
                      className="border-2 border-[#c0e6ba] outline-none px-2 py-2 h-full w-full rounded-lg"
                      type="number"
                      onChange={(e) =>
                        setVoucher({
                          ...Voucher,
                          RemainQuantity: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="my-4">
                {data.conditions && data.conditions.length > 0 ? (
                  data.conditions.map((condition) => (
                    <div
                      key={condition._id}
                      className="grid grid-cols-12 shadow-inner shadow-[#c0e6ba] rounded-lg py-2 px-4 mb-2 font-semibold bg-white"
                    >
                      <div className="col-span-5 grid grid-rows-3 gap-2">
                        <p>
                          Giá trị tối thiểu:{" "}
                          <span className="text-[#4ca771] font-normal" id="min">
                            {condition.MinValue}đ
                          </span>
                        </p>
                        <p>
                          Giá trị tối đa:{" "}
                          <span className="text-[#4ca771] font-normal" id="max">
                            {condition.MaxValue}đ
                          </span>
                        </p>
                        <p>
                          Giảm giá:{" "}
                          <span
                            className="text-[#4ca771] font-normal"
                            id="percentage"
                          >
                            {condition.PercentDiscount}%
                          </span>
                        </p>
                      </div>
                      <div className="col-span-4 grid grid-rows-3 gap-2">
                        <input
                          type="number"
                          id="updateMin"
                          className="border-2 border-[#4ca771] outline-none text-[#4ca771] px-4 rounded-lg"
                        />
                        <input
                          type="number"
                          id="updateMax"
                          className="border-2 border-[#4ca771] outline-none text-[#4ca771] px-4 rounded-lg"
                        />
                        <input
                          type="number"
                          id="updatePercentage"
                          className="border-2 border-[#4ca771] outline-none text-[#4ca771] px-4 rounded-lg"
                        />
                      </div>
                      <div className="col-span-3 flex items-center justify-end">
                        <div
                          id="updateCondition"
                          className="py-4 px-8 bg-[#c0e6ba] rounded-lg text-[#4ca771] font-bold cursor-pointer"
                          // onClick={() => {
                          //   document.getElementsByClassName("conditions").t;
                          //   document
                          //     .getElementById("#updateCondition")
                          //     .textContent("Lock");
                          // }}
                        >
                          Update
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có điều kiện áp dụng.</p>
                )}
              </div>
            </form>
          </div>
          <div className="p-10 lg:col-span-4">
            <img
              className="w-auto rounded-xl h-auto object-cover"
              src={data.Image}
              alt="Car"
            />
          </div>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-10 w-full justify-center px-4">
          <div className="col-span-4">
            <button
              onClick={handleSubmit}
              className="bg-[#4ca771] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#4ca771] border-2 border-[#4ca771] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faEdit} /> Sửa
            </button>
          </div>
          <div className="col-span-4">
            <button
              onClick={() => handleState(id)}
              className="bg-[#2F4F4F] hover:bg-[#eaf9e7] font-bold text-lg text-[#eaf9e7] hover:text-[#2F4F4F] border-2 border-[#2F4F4F] p-2 rounded-lg flex items-center justify-center w-full"
            >
              <FontAwesomeIcon icon={faXmark} className="mr-2" /> Cancel Edit
            </button>
          </div>
          <div className="col-span-4"></div>
        </div>
      </div>
    </div>
  );
};

export default EditVoucher;
