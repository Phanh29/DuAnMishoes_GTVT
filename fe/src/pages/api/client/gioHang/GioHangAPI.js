import { requestClient } from "../../../helper/request";

export class GioHangAPI {
  static getByIDKH = (idKH) => {
    return requestClient({
      method: "GET",
      url: `gio-hang/detailGH/${idKH}`,
    });
  };
  static getByID = (id) => {
    return requestClient({
      method: "GET",
      url: `gio-hang/detailGHByID/${id}`,
    });
  };
  static addGH = (data) => {
    return requestClient({
      method: "POST",
      url: "gio-hang/addGH",
      data: data,
    });
  };
  static getAllGHCTByIDGH = (id) => {
    return requestClient({
      method: "GET",
      url: `gio-hang-chi-tiet/getAll/${id}`,
    });
  };
  static addGHCT = (data) => {
    return requestClient({
      method: "POST",
      url: "gio-hang-chi-tiet/addGHCT",
      data: data,
    });
  };
  static updateSLGHCT = (data) => {
    return requestClient({
      method: "POST",
      url: "gio-hang-chi-tiet/updateSLGHCT",
      data: data,
    });
  };
  static updateGHCT = (data) => {
    return requestClient({
      method: "POST",
      url: "gio-hang-chi-tiet/updateGHCT",
      data: data,
    });
  };
  static detailCTSP = (idCT) => {
    return requestClient({
      method: "GET",
      url: `gio-hang-chi-tiet/detailCTSP/${idCT}`,
    });
  };
  static deleteGHCT = (id) => {
    return requestClient({
      method: "DELETE",
      url: `gio-hang-chi-tiet/deleteGHCT/${id}`,
    });
  };

  static soLuongTrongGioHang = (idGH) => {
    return requestClient({
      method: "GET",
      url: `gio-hang-chi-tiet/so-luong-san-pham-trong-gio-hang/${idGH}`,
    });
  };
}
