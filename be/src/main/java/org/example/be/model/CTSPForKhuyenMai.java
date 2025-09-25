package org.example.be.model;

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface CTSPForKhuyenMai {


    String getIdCTSP();


    String getTenSP();


    String getTenKT();


    String getTenMS();

    String getTenCL();


    String getTenDG();


    String getTenDM();


    String getTenH();

    int getSoLuong();


    BigDecimal getGiaBan();


    String getMoTa();


    String getTrangThai();
}
