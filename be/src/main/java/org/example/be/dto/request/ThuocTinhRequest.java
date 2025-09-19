package org.example.be.dto.request;


import lombok.*;
import org.example.be.entity.base.BaseEntityThuocTinh;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ThuocTinhRequest {
    private String id;
    private String ma;
    private String ten;
    private LocalDateTime ngayTao;
    private LocalDateTime ngaySua;
    private int trangThai;


    public <T extends BaseEntityThuocTinh> T mapToEntity(T entity) {
        entity.setId(this.id);
        entity.setMa(this.ma);
        entity.setTen(this.ten);
        entity.setNgayTao(this.ngayTao);
        entity.setNgaySua(this.ngaySua);
        entity.setTrangThai(this.trangThai);
        System.out.println(entity.getMa());
        return entity;
    }
}

