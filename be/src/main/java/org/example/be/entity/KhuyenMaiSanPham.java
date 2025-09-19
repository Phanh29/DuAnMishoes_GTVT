package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntity;

@Entity
@Table(name = "chitietsp_khuyenmai")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class KhuyenMaiSanPham extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "khuyen_mai_id")
    private KhuyenMai khuyenMai;
    @ManyToOne
    @JoinColumn(name = "chi_tiet_sp_id")
    private ChiTietSanPham chiTietSanPham;
    private String ma;
    private int trangThai;

}
