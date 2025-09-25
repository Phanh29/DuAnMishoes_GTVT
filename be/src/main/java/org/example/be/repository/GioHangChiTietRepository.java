package org.example.be.repository;

import org.example.be.dto.respon.GioHangChiTietRespone;
import org.example.be.entity.GioHangChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<GioHangChiTiet, String> {
    @Query(value = """
            SELECT gh.id,gh.gio_hang_id as gioHang,gh.chi_tiet_sp_id as chiTietSanPham,gh.so_luong as soLuong,gh.thanh_tien as thanhTien,gh.trang_thai as trangThai  from gio_hang_chi_tiet gh  join gio_hang on gh.gio_hang_id=gio_hang.id where gh.gio_hang_id=:idGH and gh.trang_thai=0
            """, nativeQuery = true)
    List<GioHangChiTietRespone> getAllGioHangChiTiet(String idGH);

    @Query(value = "select sum(so_luong) from gio_hang_chi_tiet where trang_thai = 0 and gio_hang_id =:idGH", nativeQuery = true)
    Integer soLuongSanPhamTrongGioHang(String idGH);

    @Query("Select pt from GioHangChiTiet pt where pt.gioHang.khachHang.id=:id and pt.chiTietSanPham.id=:idctsp")
    GioHangChiTiet listGHCTByID(String id, String idctsp);

    @Query("Select pt from GioHangChiTiet pt where pt.gioHang.id=:id and pt.chiTietSanPham.id=:idctsp")
    GioHangChiTiet listGHCTByIdGioHangAndSanPham(String id, String idctsp);

    @Query(value = "select * from gio_hang_chi_tiet where chi_tiet_sp_id =:id", nativeQuery = true)
    List<GioHangChiTiet> getAllGHCTByCTSP(String id);
}
