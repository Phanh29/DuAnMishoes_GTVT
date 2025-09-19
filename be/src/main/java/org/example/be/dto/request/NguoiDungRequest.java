package org.example.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDungRequest {
    private String id;
    private String ten;
    private Long ngaySinh;
    private String soDienThoai;
    private String email;
    private Boolean gioiTinh;
    private String canCuocCongDan;
    private String anh;
    private String matKhau;
    private int trangThai;
    private int idThanhPho;
    private String tenThanhPho;
    private int idHuyen;
    private String tenHuyen;
    private String idXa;
    private String tenXa;
    private String diaChi;
}
