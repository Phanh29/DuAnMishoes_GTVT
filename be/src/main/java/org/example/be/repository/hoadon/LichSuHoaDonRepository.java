package org.example.be.repository.hoadon;

import org.example.be.dto.respon.HoaDonTimeLineRespon;
import org.example.be.entity.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon, String> {
    @Query(value = """
SELECT mo_ta_hoat_dong AS moTaHoatDong,trang_thai AS trangThai,nguoi_tao AS nguoiTao,ngay_tao AS ngayTao
 FROM lich_su_hoa_don WHERE  hoa_don_id=:idHD ORDER BY ngayTao ASC""",nativeQuery = true)
    List<HoaDonTimeLineRespon> detailLichSuHoaDon(String  idHD);
}
