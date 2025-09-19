import { getHeader, requestAdmin } from "../../helper/request";
export class NguoiDungAPI {
  static getAll = (role) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/${role}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static create = (role,data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/${role}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static update = (role, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/${role}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateStatus = (role,data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/${role}/update`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getOneByIdUser = (role,id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/${role}/${id}`,
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
