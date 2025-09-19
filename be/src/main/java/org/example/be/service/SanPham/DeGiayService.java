package org.example.be.service.SanPham;

import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.DeGiay;
import org.example.be.repository.ThuocTinhSanPham.DeGiayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
@Service
public class DeGiayService {
    @Autowired
    DeGiayRepository deGiayRepository;

    public List<ThuocTinhRepo> getAllDeGiay() {
        return deGiayRepository.getALLDeGiay();
    }

    public DeGiay update(String id, ThuocTinhRequest request) {
        DeGiay h = request.mapToEntity(new DeGiay());
        h.setId(id);
        h.setNgaySua(LocalDateTime.now());
        return deGiayRepository.save(h);
    }

    public DeGiay detailDeGiay(String id) {
        return deGiayRepository.findById(id).get();
    }


    public String addDeGiay(ThuocTinhRequest h) {
        long count = deGiayRepository.count();
        String ma = String.format("DG%03d", count + 1);
        DeGiay deGiay = DeGiay.builder()
                .ma(ma)
                .ten(h.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        deGiayRepository.save(deGiay);
        return "Done";
    }
}
