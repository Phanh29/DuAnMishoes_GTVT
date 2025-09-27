package org.example.be.repository;

import org.example.be.dto.respon.CtspKmViewRespone;
import org.example.be.entity.KhuyenMaiSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Repository
public interface KhuyenMaiSanPhamRepository extends JpaRepository<KhuyenMaiSanPham, String> {
    @Query(value = "select chi_tiet_sp_id from chitietsp_khuyenmai where khuyen_mai_id =:id", nativeQuery = true)
    List<String> getAllProductByPromotion(String id);

    @Query(value = "select * from chitietsp_khuyenmai where khuyen_mai_id =:idKM and chi_tiet_sp_id =:idCTSP", nativeQuery = true)
    KhuyenMaiSanPham findKhuyenMaiSanPham(String idKM, String idCTSP);

    @Query(value = "select * from chitietsp_khuyenmai", nativeQuery = true)
    List<KhuyenMaiSanPham> getAll();

    @Query(value = "select * from chitietsp_khuyenmai where chi_tiet_sp_id =:id", nativeQuery = true)
    List<KhuyenMaiSanPham> getListCTSPByKM(String id);

    @Query("""
        SELECT ctkm.chiTietSanPham.id AS ctspId,
               km.loai               AS loai,
               km.gia_tri_khuyen_mai    AS giaTri
        FROM KhuyenMaiSanPham ctkm
        JOIN ctkm.khuyenMai km
        WHERE ctkm.chiTietSanPham.id IN :ctspIds
          AND km.trangThai = 1
          AND CURRENT_DATE BETWEEN km.ngay_bat_dau AND km.ngay_ket_thuc
    """)
    List<CtspKmViewRespone> findActiveKmByCtspIds(@Param("ctspIds") Collection<String> ctspIds, LocalDate today);
}
