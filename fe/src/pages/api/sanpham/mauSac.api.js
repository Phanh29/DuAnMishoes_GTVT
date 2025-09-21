import { getHeader, requestAdmin } from "../../helper/request";

export class MauSacAPI {
  static getAll = () => {
     const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/mau-sac`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };
  static search = (data) => {
     const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/mau-sac/tim-kiem`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static create = (data) => {
     const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/mau-sac/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static update = (id, data) => {
     const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `admin/mau-sac/update/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };
  static detail = (id) => {
     const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/mau-sac/detail/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };
}
