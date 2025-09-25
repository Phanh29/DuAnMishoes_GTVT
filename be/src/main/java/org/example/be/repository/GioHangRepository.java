package org.example.be.repository;

import org.example.be.dto.respon.GioHangRespone;
import org.example.be.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface GioHangRepository extends JpaRepository<GioHang, String> {
    @Query(value = """
             SELECT gh.id,gh.ma ,gh.khach_hang_id as khachHang
             from gio_hang gh join nguoi_dung on gh.khach_hang_id=nguoi_dung.id where gh.khach_hang_id=:idKH 
            """, nativeQuery = true)
    GioHangRespone detailGioHang(String idKH);

    @Query(value = """
                SELECT gh.id ,gh.khach_hang_id as khachHang  from gio_hang gh where gh.id=:id
            """, nativeQuery = true)
    GioHangRespone detailGHByID(String id);
}
