package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntity;

import java.time.LocalDateTime;

@Entity
@Table(name = "lich_su_diem")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class LichSuDiem extends BaseEntity {
    @ManyToOne
    @JoinColumn(name = "tai_khoan_id")
    private NguoiDung nguoiDung;
    @ManyToOne
    @JoinColumn(name = "hoa_don_id")
    private HoaDon hoaDon;
    @ManyToOne
    @JoinColumn(name = "cong_thuc_id")
    private CongThuc congThuc;
    private int diem;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private String nguoiTao;
    private String nguoiSua;
    private int trangThai;

}
