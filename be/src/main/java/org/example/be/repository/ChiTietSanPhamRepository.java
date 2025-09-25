package org.example.be.repository;

import org.example.be.dto.respon.ChiTietSanPhamRespone;
import org.example.be.dto.respon.DetailChiTietSanPhamRepo;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.model.CTSPForKhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, String> {
    @Query(value = """
            SELECT o.id AS id,o.mo_ta AS moTa ,o.ghi_chu as ghiChu,sp.id AS sanPham,sp.ten AS tenSP ,kt.id AS kichThuoc,ms.id AS mauSac,cl.id AS chatLieu,dc.id AS deGiay,dm.id AS danhMuc
            ,h.id AS hang,o.so_luong AS soLuong,o.gia_ban AS giaBan,o.trang_thai AS trangThai
            FROM chi_tiet_san_pham o
            JOIN san_pham sp  on o.san_pham_id=sp.id
            JOIN kich_thuoc kt  on o.kich_thuoc_id=kt.id
            JOIN mau_sac ms  on o.mau_sac_id=ms.id
            JOIN chat_lieu cl  on o.chat_lieu_id=cl.id
            JOIN de_giay dc  on o.de_giay_id=dc.id
            JOIN danh_muc dm  on o.danh_muc_id=dm.id
            JOIN hang h  on o.hang_id=h.id
                     """, nativeQuery = true)
    List<DetailChiTietSanPhamRepo> detail();

    @Query(value = """
             SELECT o.id AS idCTSP,o.mo_ta AS moTa\s
             ,CASE WHEN MIN(o.ghi_chu) IS NULL THEN N'Chưa có ảnh' ELSE MIN(o.ghi_chu) END AS linkAnh\s
             ,sp.ten AS tenSP ,kt.ten AS tenKT,ms.ten AS tenMS,ms.ma AS maMS,cl.ten AS tenCL,dg.ten AS tenDG,dm.ten AS tenDM
               ,h.ten AS tenH
             ,CASE WHEN o.so_luong IS NULL THEN N'0' ELSE o.so_luong END AS soLuong
             ,CASE WHEN o.so_luong_tra IS NULL THEN N'0' ELSE o.so_luong_tra END AS soLuongTra
             ,o.gia_ban AS giaBan,o.trang_thai AS trangThai
             FROM chi_tiet_san_pham o
             JOIN san_pham sp  on o.san_pham_id=sp.id
             JOIN kich_thuoc kt  on o.kich_thuoc_id=kt.id
             JOIN mau_sac ms  on o.mau_sac_id=ms.id
             JOIN hinh_anh ha on o.id=ha.chi_tiet_san_pham_id \s
              LEFT JOIN chat_lieu cl  on o.chat_lieu_id=cl.id
              LEFT JOIN de_giay dg  on o.de_giay_id=dg.id
             LEFT  JOIN danh_muc dm  on o.danh_muc_id=dm.id
              LEFT JOIN hang h  on o.hang_id=h.id
            group by o.id
                    """, nativeQuery = true)
    List<ChiTietSanPhamRespone> getALLCTSP(@Param("idSP") String idSP);

}
