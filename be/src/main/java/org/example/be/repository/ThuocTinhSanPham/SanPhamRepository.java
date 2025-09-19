package org.example.be.repository.ThuocTinhSanPham;

import org.example.be.dto.respon.SanPhamRespone;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SanPhamRepository extends JpaRepository<SanPham, String> {

    @Query(value = """
            select
            	a.id as idSP,
            	a.ma as ma ,
            	a.ten as ten,
            	case
            		when SUM(coalesce(o.so_luong, 0)) is null then N'0'
            		else SUM(coalesce(o.so_luong, 0))
            	end as soLuong,
            	a.trang_thai as trangThai
            from
            	san_pham a
            left join chi_tiet_san_pham o on
            	o.san_pham_id = a.id
            group by
            	ma,
            	ten,
            	a.trang_thai,
            	a.id
            having SUM(coalesce(o.so_luong, 0))> 0
            order by
            	a.ngay_tao desc
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLSP();

    @Query(value = "select san_pham.id from san_pham join chi_tiet_san_pham on san_pham.id = chi_tiet_san_pham.san_pham_id where chi_tiet_san_pham.id = ?1", nativeQuery = true)
    List<String> getIDSPbyCTSP(String id);


    @Query(value = """
            select distinct ms.ma  from mau_sac ms
            join chi_tiet_san_pham ctsp on ms.id = ctsp.mau_sac_id
            join san_pham sp on sp.id = ctsp.san_pham_id
            where sp.id =:id order by ms.ma ASC 
           """, nativeQuery = true)
    List<String> getListMauSacBySanPhamId(String id);

    @Query(value = """
           select distinct kt.ten  from kich_thuoc kt
            join chi_tiet_san_pham ctsp on kt.id = ctsp.kich_thuoc_id
            join san_pham sp on sp.id = ctsp.san_pham_id
            where sp.id =:id order by kt.ten ASC 
            """, nativeQuery = true)
    List<String> getListKichThuocBySanPhamId(String id);
}
