package org.example.be.repository;

import org.example.be.dto.request.SearchTenAndTrangThaiRequest;
import org.example.be.entity.NguoiDung;
import org.example.be.model.NguoiDungDiaChiRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, String> {
    @Query(value = """
        SELECT
            nd.id AS id,
            nd.ma AS ma,
            nd.ten AS ten,
            nd.so_dien_thoai AS soDienThoai,
            CASE
                WHEN nd.email IS NULL THEN N'Không có'
                ELSE nd.email
            END AS email,
            CASE
                WHEN nd.ngay_sinh IS NULL THEN N'Không có'
                ELSE nd.ngay_sinh
            END AS ngaySinh,
            nd.gioi_tinh AS gioiTinh,
            nd.can_cuoc_cong_dan AS cccd,
            CASE
                WHEN nd.anh IS NULL THEN N'Không có'
                ELSE nd.anh
            END AS anh,
            nd.trang_thai AS trangThai
        FROM
            nguoi_dung nd
        WHERE
            nd.chuc_vu = :chucVu
        ORDER BY
            nd.ngay_tham_gia DESC
        """, nativeQuery = true)
    List<org.example.be.model.NguoiDungRepository> getNguoiDungByChucVu(@Param("chucVu") String chucVu);


    @Query(value = "SELECT COUNT(*) FROM nguoi_dung WHERE chuc_vu = :chucVu", nativeQuery = true)
    int countNguoiDungByChucVu(@Param("chucVu") String chucVu);

    @Query(value = """
            SELECT
                u.id AS id,
                u.ten AS ten,
                u.ma AS ma,
                u.email AS email,
                u.gioi_tinh AS gioiTinh,
                u.can_cuoc_cong_dan AS cccd,
                u.ngay_sinh AS ngaySinh,
                u.so_dien_thoai AS soDienThoai,
                u.anh AS anh,
                u.ngay_tao AS ngayTao,
                u.ngay_tham_gia AS ngayThamGia,
                u.trang_thai AS trangThai,
                a.id AS idDiaChi,
                COALESCE(a.ten_thanh_pho, 'Không có') AS tenThanhPho,
                a.id_thanh_pho as idThanhPho,
                COALESCE(a.ten_huyen, 'Không có') AS tenHuyen,
                a.id_huyen AS idHuyen,
                COALESCE(a.ten_xa, 'Không có') AS tenXa,
                a.id_xa AS idXa,
                COALESCE(a.dia_chi, 'Không có') AS diaChi
            FROM nguoi_dung u
            LEFT JOIN dia_chi a
                ON u.id = a.nguoi_dung_id
                AND a.trang_thai = 0
            WHERE u.chuc_vu = :chucVu
              AND u.id = :id
               
                     """, nativeQuery = true)
    NguoiDungDiaChiRepository findByIdAndChucVu(
            @Param("id") String id,
            @Param("chucVu") String chucVu
    );
    @Query(value = """
           select  * from nguoi_dung where  email=:email
                    """,nativeQuery = true)
    Optional<NguoiDung> findByEmail(@Param("email") String email);
}
