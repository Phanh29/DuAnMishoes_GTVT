package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntityThuocTinh;

import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@SuperBuilder
public class NguoiDung extends BaseEntityThuocTinh {

    private Long ngaySinh;
    private String soDienThoai;
    private Date ngayThamGia;
    private String canCuocCongDan;
    private Boolean gioiTinh;
    private String anh;
    private String email;
    private String matKhau;
    private String chucVu;
    private String hangKhachHang;
    private int diem;
}
