import logo from "../assets/logo-2da.png";

const Footer = () => {
  return (
    <div className="w-full h-fit bg-[#75bde0] pt-10  grid lg:grid-cols-12 grid-cols-6  shadow-inner shadow-[#ffffff] lg:py-10 lg:px-20 px-10 text-[#16233b] text-xl">
      <div className="lg:col-span-4 col-span-6 w-full">
        <div className="flex items-center">
          <img
            src={logo}
            alt="logo"
            className="lg:w-28 lg:h-28 w-16 h-16 rounded-full"
          />
          <span className="ml-2 lg:text-6xl text-4xl font-bold">Voucher4u</span>
        </div>
        <div className="lg: my-4">
          <div className=" flex lg:my-2">
            <p className="font-bold ">Hotline 24/7: </p> <p> 1900 0091</p>
          </div>
          <div className="flex">
            {" "}
            <p className="font-bold">Contact us: </p>
            <p> voucher4u@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 col-span-6  my-4 grid lg:grid-rows-8">
        <p className="font-bold">Chính sách</p>
        <p>Chính sách và quy định</p>
        <p>Quy chế hoạt động</p>
        <p>Bảo mật thông tin</p>
        <p>Giải quyết tranh chấp</p>
      </div>
      <div className="lg:col-span-2 col-span-6  my-4 grid lg:grid-rows-8">
        <p className="font-bold">Tìm hiểu thêm</p>
        <p>Hướng dẫn chung</p>
        <p>Hướng dẫn voucher</p>
        <p>Hướng dẫn thanh toán</p>
        <p>Hỏi và trả lời</p>
      </div>
      <div className="lg:col-span-2 col-span-3  my-4 grid lg:grid-rows-8">
        <p className="font-bold">Thông tin</p>
        <p>Về Voucher4u</p>
        <p>Voucher4u blog</p>
        <p>Tuyển dụng</p>
      </div>
      <div className="lg:col-span-2 col-span-3  my-4 grid lg:grid-rows-8">
        <p className="font-bold">Đối tác</p>
        <p>Đăng ký voucher</p>
        <p>Đăng ký Service</p>
        <p>Đăng ký Ví</p>
      </div>
    </div>
  );
};

export default Footer;
