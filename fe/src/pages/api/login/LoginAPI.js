import { requestAdmin } from "../../helper/request";

export class LoginAPI {
  //Đăng nhập
  static login = (dataLogin) => {
    return requestAdmin({
      method: "POST",
      url: `/api/dang-nhap`,
      data: dataLogin,
    });
  };
  static signUp = (data) => {
    return requestAdmin({
      method: "POST",
      url: `/api/dang-ky`,
      data: data,
    });
  };
  static forgotPass = (data) => {
    return requestAdmin({
      method: "POST",
      url: `/api/quen-mat-khau`,
      data: data,
    });
  };
  static getAll = () => {
    return requestAdmin({
      method: "GET",
      url: `/api/get-all`,
    });
  };
}
