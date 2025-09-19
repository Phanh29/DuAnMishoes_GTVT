package org.example.be.repository.hoadon;

import org.example.be.entity.HoaDon;
import org.example.be.model.HoaDonResponn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {
    @Query(value = """
     SELECT hd.ghi_chu AS ghiChuHD, hd.id AS idHD,hd.ma AS ma, hd.nhan_vien_id AS maNV, CASE
       WHEN hd.khach_hang_id IS NULL  THEN N'Khách lẻ' ELSE kh.ten END  as tenKH ,CASE WHEN hd.so_dien_thoai
       is  NULL THEN N''ELSE hd.so_dien_thoai END  as sdt,CASE WHEN hd.dia_chi IS  NULL THEN N''else hd.dia_chi
       end as diaChi,ngay_mua as ngayMua,hd.thanh_tien as thanhTien,hd.trang_thai as trangThai,hd.loai_hoa_don
       AS loaiHD, hd.tien_van_chuyen as tienVanChuyen,hd.tra_sau as traSau,
       hd.voucher_id as voucher,hd.gia_giam_gia as giaGiam, hd.khach_hang_id as nguoiDung,
       hd.gia_goc as giaGoc , hd.ten_nguoi_nhan as tenNguoiNhan
       FROM  hoa_don hd
       LEFT JOIN nguoi_dung kh ON kh.id = hd.khach_hang_id ORDER BY ngayMua desc
                     """, nativeQuery = true)
    List<HoaDonResponn> getALLHD();
}
