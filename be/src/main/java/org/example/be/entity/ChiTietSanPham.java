package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_san_pham")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder

public class ChiTietSanPham extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "san_pham_id")
    private SanPham sanPham;
    @ManyToOne
    @JoinColumn(name = "khuyen_mai_id")
    private KhuyenMai khuyenMai;
    @ManyToOne
    @JoinColumn(name = "kich_thuoc_id")
    private KichThuoc kichThuoc;
    @ManyToOne
    @JoinColumn(name = "mau_sac_id", referencedColumnName = "id")
    private MauSac mauSac;
    @ManyToOne
    @JoinColumn(name = "chat_lieu_id")
    private ChatLieu chatLieu;
    @ManyToOne
    @JoinColumn(name = "de_giay_id")
    private DeGiay deGiay;
    @ManyToOne
    @JoinColumn(name = "danh_muc_id")
    private DanhMuc danhMuc;
    @ManyToOne
    @JoinColumn(name = "hang_id")
    private Hang hang;
    private String tenCt;
    private String ghiChu;
    private boolean gioiTinh;
    private BigDecimal giaBan;
    private BigDecimal giaNhap;
    private String qrCode;
    private String moTa;
    private int soLuong;
    private int soLuongTra;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
    private int trangThai;
}
