import { requestClient } from "../../helper/request";

export class HomeAPI {
  static getAllSanPham = () => {
    return requestClient({
      method: "GET",
      url: `/home`,
    });
  };

  static timMang = (data) => {
    return requestClient({
      method: "POST",
      url: `/home/searchMang`,
      data: data,
    });
  };

  static timKiemDashboard = (tenTim) => {
    return requestClient({
      method: "GET",
      url: `/home-tim-kiem/${tenTim}`,
    });
  };
  static getAll = (attribute) => {
    return requestClient({
      method: "GET",
      url: `/home/${attribute}`,
    });
  };

  // sản phẩm
  static getProductDetailByCtsp = (ctspId) => {
    return requestClient({
      method: "GET",
      url: `/home/san-pham-detail/${ctspId}`,
    });
  };

  //Get hãng
  static getAllHang = () => {
    return requestClient({
      method: "GET",
      url: `/home/hang`,
    });
  };
  //Get màu sắc
  static getAllMauSac = () => {
    return requestClient({
      method: "GET",
      url: `/home/mau-sac`,
    });
  };
  //Get kích thước
  static getAllKichThuoc = () => {
    return requestClient({
      method: "GET",
      url: `/home/kich-thuoc`,
    });
  };
  //Tìm kiếm theo tên
  static timKiem = (tenTim) => {
    return requestClient({
      method: "GET",
      url: `/home/tim-kiem/${tenTim}`,
    });
  };
  // địa chỉ khách h

  static getDiaChiByKHClient = (id) => {
    return requestClient({
      method: "GET",
      url: `home/khach-hang/dia-chi/${id}`,
    });
  };
  static getDiaChiMacDinhKHClient = (id) => {
    return requestClient({
      method: "GET",
      url: `home/khach-hang/dia-chi-mac-dinh/${id}`,
    });
  };
  static updateDiaChiMacDinhKHClient = (id) => {
    return requestClient({
      method: "POST",
      url: `home/khach-hang/update-dia-chi-mac-dinh/${id}`,
    });
  };

  static updateDiaChiByIDKHClient = (id, data) => {
    return requestClient({
      method: "POST",
      url: `home/khach-hang/update-dia-chi/${id}`,
      data: data,
    });
  };

  static addDCKHClient = (data) => {
    return requestClient({
      method: "POST",
      url: `home/khach-hang/add-dia-chi`,
      data: data,
    });
  };
} 