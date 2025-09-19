package org.example.be.repository.ThuocTinhSanPham;


import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.DeGiay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DeGiayRepository extends JpaRepository<DeGiay, String> {
    @Query(value = """
    SELECT o.id as id,o.ma as ma ,o.ten as ten, o.trang_thai as trangThai FROM de_giay o ORDER BY o.ngay_tao DESC
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLDeGiay();

}
