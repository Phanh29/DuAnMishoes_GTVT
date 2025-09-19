package org.example.be.dto.respon;

import java.time.LocalDateTime;

public interface ThuocTinhRepo {
    public String getId();
    public String getMa();
    public String getTen();
    public LocalDateTime getNgayTao();
    public LocalDateTime getNgaySua();
    public String getNguoiTao();
    public String getNguoiSua();
    public int getTrangThai();
}
