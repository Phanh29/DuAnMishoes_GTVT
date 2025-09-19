import { requestAdress } from "../../helper/request";

export class AddressApi {
  static fetchAllProvince = () => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
    });
  };

  static fetchAllProvinceDistricts = (codeProvince) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
      params: { province_id: codeProvince },
    });
  };

  static fetchAllProvinceWard = (codeDistrict) => {
    return requestAdress({
      method: "GET",
      headers: {
        token: "d73043b1-2777-11ee-b394-8ac29577e80e",
      },
      url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
      params: { district_id: codeDistrict },
    });
  };
}
