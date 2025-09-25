package org.example.be.repository;

import org.example.be.entity.KhuyenMai;
import org.example.be.model.KhuyenMaiRespon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai,String> {
    @Query(value = "select khuyen_mai.id as idKM , khuyen_mai.ma as maKM, khuyen_mai.ten as tenKM , khuyen_mai.khuyen_mai_toi_da as ToiDaKM, \n" +
            "khuyen_mai.ngay_bat_dau as ngayBD , khuyen_mai.ngay_ket_thuc as ngayKT , khuyen_mai.loai as loaiKM , \n" +
            "khuyen_mai.trang_thai as trangThai , khuyen_mai.nguoi_tao as nguoiTao , khuyen_mai.nguoi_sua as nguoiSua,\n" +
            "khuyen_mai.ngay_tao as ngayTao , khuyen_mai.ngay_sua as ngaySua , chi_tiet_san_pham.id as idCTSP\n" +
            "from khuyen_mai join chi_tiet_san_pham on khuyen_mai.id = chi_tiet_san_pham.khuyen_mai_id order by khuyen_mai.ma DESC",nativeQuery = true)
    public List<KhuyenMaiRespon> getAll();
}
