package org.example.be.dto.respon;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface ChiTietSanPhamSearchRespone {
    @Value("#{target.idCTSP}")
    String getIdCTSP();

    @Value("#{target.tenSP}")
    String getTenSP();

    @Value("#{target.linkAnh}")
    String getLinkAnh();

    @Value("#{target.maMS}")
    String getMaMS();

    @Value("#{target.tenKT}")
    String getTenKT();

    @Value("#{target.tenMS}")
    String getTenMS();

    @Value("#{target.tenCL}")
    String getTenCL();

    @Value("#{target.tenDC}")
    String getTenDC();

    @Value("#{target.tenDM}")
    String getTenDM();

    @Value("#{target.tenH}")
    String getTenH();

    @Value("#{target.soLuong}")
    int getSoLuong();

    @Value("#{target.giaBan}")
    BigDecimal getGiaBan();

    @Value("#{target.moTa}")
    String getMoTa();

    @Value("#{target.trangThai}")
    String getTrangThai();
}
