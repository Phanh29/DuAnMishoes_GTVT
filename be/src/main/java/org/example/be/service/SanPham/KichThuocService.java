package org.example.be.service.SanPham;

import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.KichThuoc;
import org.example.be.repository.ThuocTinhSanPham.KichThuocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class KichThuocService {
    @Autowired
    KichThuocRepository kichThuocRepository;

    public List<ThuocTinhRepo> getAllKichThuoc() {
        return kichThuocRepository.getALLKT();
    }

    public KichThuoc update(String id, ThuocTinhRequest request) {
        KichThuoc kt = request.mapToEntity(new KichThuoc());
        kt.setId(id);
        kt.setNgaySua(LocalDateTime.now());
        return kichThuocRepository.save(kt);
    }

    public KichThuoc detailKT(String id) {
        return kichThuocRepository.findById(id).get();
    }


    public String addKT(ThuocTinhRequest kt) {
        long count = kichThuocRepository.count();
        String ma = String.format("KT%03d", count + 1);
        KichThuoc kichThuoc = KichThuoc.builder()
                .ma(ma)
                .ten(kt.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        kichThuocRepository.save(kichThuoc);
        return "Done";
    }
}