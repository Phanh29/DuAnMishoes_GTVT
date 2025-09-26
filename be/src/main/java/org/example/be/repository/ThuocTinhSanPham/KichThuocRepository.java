package org.example.be.repository.ThuocTinhSanPham;


import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.KichThuoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface KichThuocRepository extends JpaRepository<KichThuoc, String> {
    @Query(value = """
    SELECT o.id as id,o.ma as ma ,o.ten as ten, o.trang_thai as trangThai FROM kich_thuoc o ORDER BY o.ngay_tao DESC
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLKT();


    @Query("""
        SELECT DISTINCT kt
        FROM ChiTietSanPham ctsp
        JOIN ctsp.kichThuoc kt
        WHERE ctsp.sanPham.id = :idSanPham
    """)
    List<KichThuoc> findBySanPhamId(@Param("idSanPham") String idSanPham);

}
