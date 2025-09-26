package org.example.be.repository.ThuocTinhSanPham;

import org.example.be.entity.HinhAnh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface HinhAnhRepository extends JpaRepository<HinhAnh, String> {
    @Query(value = """
            SELECT * FROM hinh_anh where ten=:tenAnh AND
            chi_tiet_san_pham_id=:idSP order by ngay_tao DESC;
            """, nativeQuery = true)
    List<HinhAnh> getAnhCTSP(String tenAnh, String idSP);

    @Modifying
    @Transactional
    @Query(value = """
            delete from hinh_anh where id=:idCTSP
                """, nativeQuery = true)
    int deleteAnhCTSP(String idCTSP);


    // Lấy gộp theo nhiều ctsp_id (để gom ảnh cho 1 màu – vì màu có nhiều biến thể size)
    @Query(value = "SELECT url FROM hinh_anh WHERE chi_tiet_san_pham_id IN (:ctspIds)", nativeQuery = true)
    List<String> findUrlsByCtspIds(@Param("ctspIds") List<String> ctspIds);
}
