package org.example.be.dto.respon;

import java.math.BigDecimal;

public interface HomeRespone {
    String getIdSanPham();

    String getIdCt();

    String getIdMS();

    String getIdKT();

    String getName();

    String getSize();

    String getColor();

    String getColorCode();

    BigDecimal getPrice();

    String getImage();

    String getHoverImage();

    String getLoaiKM();

    BigDecimal getGiaTriKhuyenMai();
}
