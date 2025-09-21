package org.example.be.dto.respon;

import java.math.BigDecimal;

public interface DetailChiTietSanPhamRepo {
    String getSanPham();
    String getId();
    String getGhiChu();
    String getTenSP();

    String getKichThuoc();

    String getMauSac();

    String getChatLieu();

    String getDeGiay();

    String getDanhMuc();

    String getHang();

    int getSoLuong();

    BigDecimal getGiaBan();

    String getMoTa();

    int getTrangThai();

    String getLoaiKM();
    BigDecimal getGiaTriKhuyenMai();
}
