package org.example.be.dto.request.login;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ChiTietSanPhamSearch {
    String tenCT;
    String idKT;
    String idMS;
    String idDM;
    String idDC;
    String idCL;
    String idH;
    int trangThaiCT;
    int soLuongBatDau;
    int soLuongKetThuc;
    int giaBanBatDau;
    int giaBanKetThuc;
}
