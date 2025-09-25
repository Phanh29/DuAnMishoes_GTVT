package org.example.be.repository.hoadon;

import org.example.be.entity.HoaDonChiTiet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonChiTietRepository extends JpaRepository<HoaDonChiTiet, String> {
    @Query(value = "select * from hoa_don_chi_tiet where chi_tiet_san_pham_id =:id",nativeQuery = true)
    List<HoaDonChiTiet> getAllHDCTByCTSP(String id);
}
