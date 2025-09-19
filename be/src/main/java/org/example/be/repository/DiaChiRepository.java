package org.example.be.repository;

import org.example.be.dto.respon.DiaChiKhachHangRepon;
import org.example.be.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiRepository extends JpaRepository<DiaChi, String> {
    @Query(value = "SELECT * FROM dia_chi a WHERE a.trang_thai = 0 AND a.nguoi_dung_id =:id", nativeQuery = true)
    DiaChi findByUserAndStatus(@Param("id") String user);

    @Query(value = "SELECT id , nguoi_dung_id as nguoiDung,id_thanh_pho as idThanhPho,id_huyen as idHuyen,id_xa as idXa, ten_nguoi_nhan as tenNguoiNhan, so_dien_thoai as soDienThoai,dia_chi as diaChi,ten_xa as tenXa,ten_huyen as tenHuyen,ten_thanh_pho as tenThanhPho, trang_thai as trangThai from dia_chi where nguoi_dung_id =:id", nativeQuery = true)
    List<DiaChiKhachHangRepon> findDiaChiByKH(@Param("id") String user);

    @Query(value = "SELECT id , nguoi_dung_id as nguoiDung,id_thanh_pho as idThanhPho,id_huyen as idHuyen,id_xa as idXa, ten_nguoi_nhan as tenNguoiNhan, so_dien_thoai as soDienThoai,dia_chi as diaChi,ten_xa as tenXa,ten_huyen as tenHuyen,ten_thanh_pho as tenThanhPho, trang_thai as trangThai from dia_chi where nguoi_dung_id=:id and trang_thai=0", nativeQuery = true)
    DiaChiKhachHangRepon findDiaChiMacDinh(@Param("id") String user);
}
