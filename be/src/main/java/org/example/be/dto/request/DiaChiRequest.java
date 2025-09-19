package org.example.be.dto.request;


import lombok.*;
import org.example.be.entity.DiaChi;
import org.example.be.entity.NguoiDung;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class DiaChiRequest {
    private String id;
    private String idNguoiDung;
    private String tenNguoiNhan;
    private String soDienThoai;
    private String diaChi;
    private String idXa;
    private String idHuyen;
    private String idThanhPho;
    private String tenXa;
    private String tenHuyen;
    private String tenThanhPho;

    private int trangThai;
    public DiaChi map(DiaChi diaChi){
        diaChi.setId(id);
        diaChi.setNguoiDung(NguoiDung.builder().id(this.idNguoiDung).build());
        diaChi.setTenNguoiNhan(this.tenNguoiNhan);
        diaChi.setSoDienThoai(this.soDienThoai);
        diaChi.setDiaChi(this.diaChi);
        diaChi.setIdThanhPho(Integer.valueOf(this.idThanhPho));
        diaChi.setIdHuyen(Integer.valueOf(this.idHuyen));
        diaChi.setIdXa(this.idXa);
        diaChi.setTenHuyen(this.tenHuyen);
        diaChi.setTenThanhPho(this.tenThanhPho);
        diaChi.setTenXa(this.tenXa);
        diaChi.setTrangThai(this.trangThai);
        return diaChi;
    }
}
