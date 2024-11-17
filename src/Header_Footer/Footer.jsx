import logo from "../assets/logo-2da.png";

const Footer = () => {
  return (
    <div className="w-full bg-[#75bde0]  grid lg:grid-cols-12 grid-cols-6  shadow-inner shadow-[#ffffff] py-10 px-20 text-[#16233b] text-xl">
      <div className="lg:col-span-4 col-span-6 w-full">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-28 h-28 rounded-full" />
          <span className="ml-2 text-6xl font-bold">Voucher4u</span>
        </div>
        <p className="font-bold mt-5">Hotline 24/7:</p>
        <p>1900 0091</p>
        <p className="font-bold mt-5">Contact us:</p>
        <p>voucher4u@gmail.com</p>
      </div>
      <div className="col-span-2 grid grid-rows-5">
        <p className="font-bold">Chính sách</p>
        <p>Chính sách và quy định</p>
        <p>Quy chế hoạt động</p>
        <p>Bảo mật thông tin</p>
        <p>Giải quyết tranh chấp</p>
      </div>
      <div className="col-span-2 grid grid-rows-5">
        <p className="font-bold">Tìm hiểu thêm</p>
        <p>Hướng dẫn chung</p>
        <p>Hướng dẫn voucher</p>
        <p>Hướng dẫn thanh toán</p>
        <p>Hỏi và trả lời</p>
      </div>
      <div className="col-span-2 grid grid-rows-5">
        <p></p>
        <p>Về Voucher4u</p>
        <p>Voucher4u blog</p>
        <p>Tuyển dụng</p>
      </div>
      <div className="col-span-2 grid grid-rows-5">
        <p className="font-bold">Đối tác</p>
        <p>Đăng ký voucher</p>
        <p>Đăng ký Service</p>
        <p>Đăng ký Ví</p>
      </div>
    </div>
  );
};

export default Footer;
