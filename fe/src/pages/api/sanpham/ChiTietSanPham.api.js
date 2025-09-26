import { getHeader, requestAdmin } from "../../helper/request";
export class ChiTietSanPhamAPI {
  static showCTSP = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/show`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showCTSPBySanPhamId = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/showct/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showCTSPKT = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/search/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showAllCTSP = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/detailsp`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static showDetailCTSP = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/detail/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAnhCTSP = (ten, idSP) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/hinhanh/${ten}/${idSP}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static addAnhTheoMau = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      data: data,
      url: `/admin/hinhanh/add-anh/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static deleteAnh = (idAnh) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "DELETE",
      url: `admin/hinhanh/delete-anh/${idAnh}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static QRCtsp = (id) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/ctsp/QR/${id}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static createCTSP = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/ctsp/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static updateCTSP = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "PUT",
      url: `/admin/ctsp/update/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static searchCTSP = (id, data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/ctsp/search-ctsp/${id}`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static searchCTSPBanHang = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/ctsp/search-ctsp-banhang`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };
}