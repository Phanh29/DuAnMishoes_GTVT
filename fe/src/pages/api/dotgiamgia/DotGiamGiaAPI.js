import { getHeader, requestAdmin } from "../../helper/request";

export class DotGiamGiaAPI {
  static getAll = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/dot-giam-gia/hien-thi`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static create = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: "/admin/dot-giam-gia/add",
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
      url: `/admin/dot-giam-gia/update/${id}`,
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
      url: `/admin/dot-giam-gia/detail/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateAutoClose = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/dot-giam-gia/updateTrangThai/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateAutoStart = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/dot-giam-gia/updateTrangThai1/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateClosePromotion = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/dot-giam-gia/updateTrangThai2/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateOpenPromotion = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/dot-giam-gia/updateTrangThai3/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static search = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/dot-giam-gia/search-khuyen-mai`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateSanPhamKhuyenMai = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/ctsp/updateKM/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showProductByPromotion = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/showKM/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static deletePromotion = (id, idKM) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/ctsp/deleteKM/${id}/${idKM}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showSPByProduct = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham/showSP/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static loadCTSPBySP = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/showct/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static loadSP = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham`,
      headers: {
        Authorization: getToken,
      },
    });
  };
}
