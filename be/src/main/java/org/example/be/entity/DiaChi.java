
package org.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntity;

@Entity
@Table(name = "dia_chi")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@SuperBuilder
public class DiaChi extends BaseEntity {
    private String tenNguoiNhan;
    private String soDienThoai;
    private String diaChi;
    private String idXa;
    private Integer idHuyen;
    private Integer idThanhPho;
    private int idQuocGia;
    private String tenXa;
    private String tenHuyen;
    private String tenThanhPho;
    private String quocGia;
    private int trangThai;
    @ManyToOne
    @JoinColumn(name = "nguoi_dung_id",referencedColumnName = "id")
    private NguoiDung nguoiDung;
}
