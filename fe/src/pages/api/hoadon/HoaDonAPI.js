import { getHeader, requestAdmin } from "../../helper/request";
export class HoaDonAPI {
  static getAllbyTT = (trangThai) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/hoa-don`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static detailHD = (id) => {
    return requestAdmin({
      method: "GET",
      url: `/admin/hoa-don/detail-hoa-don/${id}`,
      headers: {
        Authorization: this.getToken,
      },
    });
  };
  static updateTTHoaDon = (idHD, data) => {
    return requestAdmin({
      method: "PUT",
      url: `/admin/hoa-don/updateTT/${idHD}`,
      data: data,
      headers: {
        Authorization: this.getToken,
      },
    });
  };
  static detailSanPham = (id) => {
    return requestAdmin({
      method: "GET",
      url: `/admin/hoa-don/san-pham/${id}`,
      headers: {
        Authorization: this.getToken,
      },
    });
  };
}
