package org.example.be.dto.impldto;

import lombok.Getter;
import lombok.Setter;
import org.example.be.entity.DiaChi;
import org.example.be.entity.NguoiDung;

import java.sql.Date;
import java.time.LocalDateTime;

@Getter
@Setter
public class NguoiDungResponseImplDTO {
    private Integer stt;
    private String iduser;
    private String ma;
    private String ten;
    private Long ngaySinh;
    private String soDienThoai;
    private Date ngayThamGia;
    private LocalDateTime ngaySua;
    private String cccd;
    private Boolean gioiTinh;
    private String avatar;
    private String email;
    private String nguoiTao;
    private String chucVu;
    private int trangThai;
    private String idAddress;
    private String tenThanhPho;
    private String tenHuyen;
    private String tenXa;
    private String diaChi;
    public NguoiDungResponseImplDTO(NguoiDung nguoiDung, DiaChi diaChi){
        this.iduser=nguoiDung.getId();
        this.email=nguoiDung.getEmail();
        this.ma=nguoiDung.getMa();
        this.ngayThamGia=nguoiDung.getNgayThamGia();
        this.ngaySua=nguoiDung.getNgaySua();
        this.avatar=nguoiDung.getAnh();
        this.soDienThoai=nguoiDung.getSoDienThoai();
        this.trangThai=nguoiDung.getTrangThai();
        this.ngaySinh=nguoiDung.getNgaySinh();
        this.ten=nguoiDung.getTen();
        this.gioiTinh=nguoiDung.getGioiTinh();
        this.cccd=nguoiDung.getCanCuocCongDan();
        this.idAddress=diaChi.getId();
        this.tenThanhPho=diaChi.getTenThanhPho();
        this.tenHuyen=diaChi.getTenHuyen();
        this.tenXa=diaChi.getTenXa();
        this.diaChi=diaChi.getDiaChi();
    }
}
