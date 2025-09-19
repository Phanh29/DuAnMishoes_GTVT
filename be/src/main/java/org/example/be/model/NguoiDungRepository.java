package org.example.be.model;

import org.springframework.beans.factory.annotation.Value;

public interface NguoiDungRepository {
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

}
