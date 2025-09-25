package org.example.be.service;


import org.example.be.dto.request.KhuyenMaiRequest;
import org.example.be.entity.KhuyenMai;
import org.example.be.repository.KhuyenMaiRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KhuyenMaiService {
    @Autowired
    KhuyenMaiRepository dotGiamGiaRepository;

    public List<KhuyenMai> getAllDotGiamGia() {
        return dotGiamGiaRepository.findAll();
    }


    public KhuyenMai addDotGiamGia(KhuyenMaiRequest request) {
        KhuyenMai km = request.map();
        long count = dotGiamGiaRepository.count();
        String ma = String.format("DGG%03d", count + 1);
        km.setMa(ma);
        // Set ngày tạo
        km.setNgayTao(LocalDateTime.now());

        LocalDateTime ngayBD = km.getNgay_bat_dau();
        LocalDateTime ngayKT = km.getNgay_ket_thuc();
        LocalDateTime now = LocalDateTime.now();

        // Xác định trạng thái
        if (ngayBD.isAfter(now)) {
            km.setTrangThai(0); // chưa bắt đầu
        } else if ((ngayBD.isBefore(now) || ngayBD.isEqual(now)) && ngayKT.isAfter(now)) {
            km.setTrangThai(1); // đang hiệu lực
        } else {
            km.setTrangThai(2); // đã kết thúc
        }
        return dotGiamGiaRepository.save(km);
    }


}
