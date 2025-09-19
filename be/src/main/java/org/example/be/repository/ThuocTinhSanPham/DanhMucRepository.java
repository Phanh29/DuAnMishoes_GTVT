package org.example.be.repository.ThuocTinhSanPham;


import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DanhMucRepository extends JpaRepository<DanhMuc, String> {
    @Query(value = """
    SELECT dm.id as id,dm.ma as ma ,dm.ten as ten, dm.trang_thai as trangThai FROM danh_muc dm ORDER BY dm.ngay_tao DESC 
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLDM();
}
