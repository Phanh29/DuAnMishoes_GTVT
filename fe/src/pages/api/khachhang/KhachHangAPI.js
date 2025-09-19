import { getHeader, requestAdmin } from "../../helper/request";
export class KhachHangAPI {
  static getAll = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/khach-hang`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static create = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/khach-hang`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static update = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/khach-hang`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateStatus = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/khach-hang/update`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getOneByIdUser = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/khach-hang/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static getDiaChiByKH = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/khach-hang/dia-chi/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static getDiaChiMacDinh = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/khach-hang/dia-chi-mac-dinh/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static updateDiaChiMacDinh = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/khach-hang/update-dia-chi-mac-dinh/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateDiaChiByID = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/khach-hang/update-dia-chi/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static addDCKH = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/khach-hang/add-dia-chi`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };



  
}
