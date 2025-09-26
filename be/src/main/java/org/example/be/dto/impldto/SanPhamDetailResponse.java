package org.example.be.dto.impldto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamDetailResponse {
    private String idSanPham;
    private String ten;
    private String moTa;
    private String tenHang;
    private String tenDanhMuc;
    private String tenChatLieu;
    private String tenDeGiay;

    private List<ColorResponse> colors;
    private List<SizeResponse> sizes;
    private List<VariantResponse> variants;

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ColorResponse {
        private String id;
        private String ten;
        private String ma;          // mã màu (hex/name)
        private List<String> images;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class SizeResponse {
        private String id;
        private String ten;
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class VariantResponse {
        private String id;          // id CTSP
        private String mauSacId;
        private String sizeId;
        private BigDecimal giaBan;
        private Integer soLuong;
        private KhuyenMaiResponse khuyenMai; // null nếu không có
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class KhuyenMaiResponse {
        private String loai;        // "Tiền mặt"/"Phần trăm"
        private BigDecimal giaTri;  // số tiền hoặc %
    }
}
