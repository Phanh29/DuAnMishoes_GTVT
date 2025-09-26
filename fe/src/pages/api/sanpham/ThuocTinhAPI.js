import { getHeader, requestAdmin } from "../../helper/request";

export class ThuocTinhAPI {
  
static getAll = (attribute) => {
  const getToken = getHeader();
  return requestAdmin({
    method: "GET",
    url: `/admin/${attribute}`,
    headers: {
      Authorization: getToken,
    },
  });
};

  static create = (attribute, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/${attribute}/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static update = (attribute, id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/${attribute}/update/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static detail = (attribute, id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/${attribute}/detail/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

    static getAllSanPhamForAdd = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham/getAll`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getListMauSacBySanPhamId = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham/listMS/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getListKichThuocBySanPhamId = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham/listKT/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };
}
