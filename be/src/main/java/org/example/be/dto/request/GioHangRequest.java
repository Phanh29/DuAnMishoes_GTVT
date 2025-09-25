package org.example.be.dto.request;


import lombok.*;
import org.example.be.entity.GioHang;
import org.example.be.entity.NguoiDung;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class GioHangRequest {
    private String id;
    private String ma;
    private String khachHang;
    private String nhanVien;
    private String nguoiTao;
    private String nguoiSua;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private int trangThai;

    public GioHang map(GioHang gioHang) {
        gioHang.setId(this.id);
        gioHang.setMa(this.ma);
        if (this.khachHang != null) {
            gioHang.setKhachHang(NguoiDung.builder().id(this.khachHang).build());
        }
        return gioHang;
    }
}
