package org.example.be.dto.respon;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ChiTietSanPhamRespone {
    @Value("#{target.idCTSP}")
    String getIdCTSP();

    @Value("#{target.linkAnh}")
    String getLinkAnh();

    @Value("#{target.tenSP}")
    String getTenSP();

    @Value("#{target.tenKT}")
    String getTenKT();

    @Value("#{target.tenMS}")
    String getTenMS();

    @Value("#{target.maMS}")
    String getMaMS();
    String getTenCL();


    String getTenDG();


    String getTenDM();


    String getTenH();
    @Value("#{target.soLuong}")
    int getSoLuong();

    @Value("#{target.soLuongTra}")
    int getSoLuongTra();

    @Value("#{target.giaBan}")
    BigDecimal getGiaBan();
    String getMoTa();
    @Value("#{target.trangThai}")
    int getTrangThai();
}
