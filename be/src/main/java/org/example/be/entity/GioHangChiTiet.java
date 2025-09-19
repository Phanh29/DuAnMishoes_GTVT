package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntity;

import java.math.BigDecimal;

@Entity
@Table(name = "gio_hang_chi_tiet")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class GioHangChiTiet extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "chi_tiet_sp_id")
    private ChiTietSanPham chiTietSanPham;
    @ManyToOne
    @JoinColumn(name = "gio_hang_id")
    private GioHang gioHang;
    private int soLuong;
    private BigDecimal thanhTien;
    private int trangThai;
}
