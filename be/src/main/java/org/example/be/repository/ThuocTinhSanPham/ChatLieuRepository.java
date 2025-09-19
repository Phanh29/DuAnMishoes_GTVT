package org.example.be.repository.ThuocTinhSanPham;

import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.ChatLieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatLieuRepository extends JpaRepository<ChatLieu, String> {
    @Query(value = """
    SELECT o.id as id,o.ma as ma ,o.ten as ten, o.trang_thai as trangThai FROM chat_lieu o ORDER BY o.ngay_tao DESC
            """, nativeQuery = true)
    List<ThuocTinhRepo> getALLCL();
}
