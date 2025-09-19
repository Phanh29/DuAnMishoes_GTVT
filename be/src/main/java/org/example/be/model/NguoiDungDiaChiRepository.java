package org.example.be.model;

import org.springframework.beans.factory.annotation.Value;

public interface NguoiDungDiaChiRepository {

    String getId();


    String getMa();

    String getTen();

    String getAnh();

    String getGioiTinh();

    String getNgaySinh();


    String getSoDienThoai();


    String getEmail();

    String getCCCD();

    String getTrangThai();

    // todo: address
    @Value("#{target.idDiaChi}")
    String getIdDiaChi();

    @Value("#{target.idThanhPho}")
    String getIDThanhPho();
    @Value("#{target.tenThanhPho}")
    String getTenThanhPho();

    @Value("#{target.idHuyen}")
    String getIDHuyen();
    @Value("#{target.tenhuyen}")
    String getTenHuyen();

    @Value("#{target.idXa}")
    String getIDXa();
    @Value("#{target.tenXa}")
    String getTenXa();

    @Value("#{target.diaChi}")
    String getDiaChi();
}
