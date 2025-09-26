import { getHeader, requestAdmin } from "../../helper/request";

export class SanPhamAPI {

  static getAll = () => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/san-pham`,
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


  static getAnhTheoMau = (ten) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/admin/hinhanh/${ten}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static getAnhCTSPClient = (ten, idSP) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "GET",
      url: `/hinhanh/${ten}/${idSP}`,
      headers: {
        Authorization: getToken,
      },
    });
  };

  static search = (data) => {
    const getToken = getHeader();
    return requestAdmin({
      method: "POST",
      url: `admin/san-pham/tim-kiem`,
      data: data,
      headers: {
        Authorization: getToken,
      },
    });
  };

}
