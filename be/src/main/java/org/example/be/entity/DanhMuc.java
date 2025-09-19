package org.example.be.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.example.be.entity.base.BaseEntityThuocTinh;

import java.time.LocalDateTime;

@Entity
@Table(name = "danh_muc")
@Getter
@Setter
@ToString
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@SuperBuilder


public class DanhMuc extends BaseEntityThuocTinh {
}
