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
      url: `/home/tim-kiem/${tenTim}`,
    });
  };
  static getAll = (attribute) => {
    return requestClient({
      method: "GET",
      url: `/home/${attribute}`,
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
      url: `home/khach-hang/update-tt-dc/${id}`,
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