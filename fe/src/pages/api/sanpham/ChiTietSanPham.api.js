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

  static getAllSanPham = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham/getAll`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createSanPham = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/san-pham/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAllKichThuoc = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/kich-thuoc`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createKichThuoc = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/kich-thuoc/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAllMauSac = () => {
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

  static createMauSac = (data) => {
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

  static getAllChatLieu = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/chat-lieu`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createChatLieu = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/chat-lieu/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAllDeGiay = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/de-giay`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createDeGiay = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/de-giay/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAllDanhMuc = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/danh-muc`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createDanhMuc = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/danh-muc/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAllHang = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/hang`,
      headers: {
        Authorization: getToken,
      },
      //   params: filter,
    });
  };

  static createHang = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `/admin/hang/add`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };
}