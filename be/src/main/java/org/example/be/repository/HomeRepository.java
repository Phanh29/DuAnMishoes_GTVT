package org.example.be.repository;

import org.example.be.dto.request.TimSanPhamTheoMang;
import org.example.be.dto.respon.HomeRespone;
import org.example.be.entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HomeRepository extends JpaRepository<ChiTietSanPham, String> {
    String BASE_SELECT = """
                           SELECT  ctsp.san_pham_id AS idSanPham,
                              ctsp.id AS idCt,
                              sp.ten AS name,
                              kt.ten AS size,
                              ms.ten AS color,
                              ms.ma AS colorCode,
                              COALESCE(km.gia_tri_khuyen_mai, 0) AS giaTriKhuyenMai,
                              km.loai AS loaiKM,
                              ctsp.gia_ban AS price,
                              ctsp.ghi_chu AS image,
                              ctsp.ghi_chu AS hoverImage
                          FROM chi_tiet_san_pham ctsp
                          JOIN san_pham sp ON ctsp.san_pham_id = sp.id
                          JOIN mau_sac ms ON ctsp.mau_sac_id = ms.id
                          JOIN kich_thuoc kt ON ctsp.kich_thuoc_id = kt.id
                          LEFT JOIN chitietsp_khuyenmai ctkm ON ctsp.id = ctkm.chi_tiet_sp_id
                          left join khuyen_mai km on ctkm.khuyen_mai_id=km.id
            """;

    @Query(value = BASE_SELECT + " WHERE ctsp.so_luong > 0 GROUP BY ctsp.id,km.gia_tri_khuyen_mai,km.loai", nativeQuery = true)
    List<HomeRespone> getALLSanPham();

    @Query(value = BASE_SELECT + " WHERE ctsp.so_luong > 0 GROUP BY ctsp.id,km.gia_tri_khuyen_mai,km.loai ORDER BY ctsp.ngay_tao DESC LIMIT 8", nativeQuery = true)
    List<HomeRespone> getALLSanPhamNew();

    @Query(value = BASE_SELECT + """
            JOIN hoa_don_chi_tiet hdct ON hdct.chi_tiet_san_pham_id = ctsp.id
            JOIN hoa_don hd ON hd.id = hdct.hoa_don_id
            WHERE YEAR(hdct.ngay_tao) = YEAR(CURDATE())
              AND (hd.trang_thai = 4 OR hd.trang_thai = 5)
              AND ctsp.so_luong > 0
            GROUP BY ctsp.id,km.gia_tri_khuyen_mai,km.loai
            """, nativeQuery = true)
    List<HomeRespone> getHotSale();




    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocSanPhamNoData(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.mau_sac_id IN :#{#req.arrayMauSac} ) AND
             	( ctsp.hang_id IN :#{#req.arraySanPham} ) AND 
             	( ctsp.kich_thuoc_id IN :#{#req.arrayKichThuoc} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocSanPhamAll(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.hang_id IN :#{#req.arraySanPham} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocSanPham(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.mau_sac_id IN :#{#req.arrayMauSac} ) AND
             	( ctsp.hang_id IN :#{#req.arraySanPham} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocSanPhamMauSac(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.hang_id IN :#{#req.arraySanPham} ) AND 
             	( ctsp.kich_thuoc_id IN :#{#req.arrayKichThuoc} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )                
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocSanPhamKichThuoc(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.mau_sac_id IN :#{#req.arrayMauSac} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocMauSac(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.mau_sac_id IN :#{#req.arrayMauSac} ) AND
             	( ctsp.kich_thuoc_id IN :#{#req.arrayKichThuoc} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocMauSacKichthuoc(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
            select
                ctsp.san_pham_id as idSanPham,
                ctsp.id as idCt,
            	sp.ten as name,
            	kt.ten as size,
            	ms.ten as color,
            	km.loai as loaiKM,
            	km.gia_tri_khuyen_mai as giaTriKhuyenMai,
            	ms.ma as colorCode,
            	ctsp.gia_ban as price,
            	ctsp.ghi_chu as image,
            	ctsp.ghi_chu as hoverImage
            from
            	chi_tiet_san_pham ctsp
            join san_pham sp on
            	ctsp.san_pham_id = sp.id
            join mau_sac ms on
            	ctsp.mau_sac_id = ms.id
            join kich_thuoc kt on
            	ctsp.kich_thuoc_id = kt.id
            	left join khuyen_mai km on
            	ctsp.khuyen_mai_id = km.id
            	where
             	ctsp.so_luong > 0 AND
             	( ctsp.kich_thuoc_id IN :#{#req.arrayKichThuoc} ) AND
             	( ctsp.gia_ban BETWEEN :#{#req.giaBatDau} AND :#{#req.giaKetThuc} )
            group by
            	ctsp.gia_ban,
            	ms.ten,
            	sp.ten,
            	kt.ten,
            	ctsp.ghi_chu,
            	km.ten,
            	ctsp.id,
            	ms.ma
            """, nativeQuery = true)
    List<HomeRespone> getLocKichThuoc(@Param("req") TimSanPhamTheoMang req);

    @Query(value = """
        SELECT\s
            ctsp.san_pham_id AS idSanPham,
            ctsp.id AS idCt,
            sp.ten AS name,
            kt.ten AS size,
            ms.ten AS color,
            COALESCE(km.gia_tri_khuyen_mai, 0) AS giaTriKhuyenMai,
            km.loai AS loaiKM,
            ms.ma AS colorCode,
            ctsp.gia_ban AS price,
            ctsp.ghi_chu AS image,
            ctsp.ghi_chu AS hoverImage
        FROM chi_tiet_san_pham ctsp
        JOIN san_pham sp ON ctsp.san_pham_id = sp.id
        JOIN mau_sac ms ON ctsp.mau_sac_id = ms.id
        JOIN kich_thuoc kt ON ctsp.kich_thuoc_id = kt.id
        LEFT JOIN chitietsp_khuyenmai ctkm ON ctsp.id = ctkm.chi_tiet_sp_id
        LEFT JOIN khuyen_mai km ON km.id = ctkm.khuyen_mai_id
        WHERE ctsp.so_luong > 0\s
          AND ctsp.ten_ct LIKE %:tenTim%
        ORDER BY ctsp.ngay_tao DESC;
        
              """, nativeQuery = true)
    List<HomeRespone> getTimSanPham(@Param("tenTim") String tenTim);
}
