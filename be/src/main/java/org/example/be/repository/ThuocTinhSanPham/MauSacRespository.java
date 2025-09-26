package org.example.be.repository.ThuocTinhSanPham;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MauSacRespository extends JpaRepository<MauSac, String> {
    @Query(value = """
    SELECT 
    o.id as id,
    o.ma as ma ,
         o.ten as ten,
         o.trang_thai as trangThai
      FROM mau_sac o ORDER BY o.ngay_tao DESC 
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLMS();


    @Query("""
        SELECT DISTINCT ms
        FROM ChiTietSanPham ctsp
        JOIN ctsp.mauSac ms
        WHERE ctsp.sanPham.id = :idSanPham
    """)
    List<MauSac> findBySanPhamId(@Param("idSanPham") String idSanPham);
}
