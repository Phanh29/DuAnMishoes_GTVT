package org.example.be.dto.respon;


import java.math.BigDecimal;

public interface GioHangChiTietRespone {
    public String getId();
    public String getGioHang();
    public String getChiTietSanPham();
    public int getSoLuong();
    public BigDecimal getThanhTien();
    public int getTrangThai();
}
