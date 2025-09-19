package org.example.be.service.SanPham;


import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.Hang;
import org.example.be.repository.ThuocTinhSanPham.HangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HangService {
    @Autowired
    HangRepository hangRepository;
    public List<ThuocTinhRepo> getAllHang() {
        return hangRepository.getALLH();
    }
    public Hang update(String id, ThuocTinhRequest request) {
        Hang h = request.mapToEntity(new Hang());
        h.setId(id);
        h.setNgaySua(LocalDateTime.now());
        return hangRepository.save(h);
    }

    public Hang detailH(String id){return hangRepository.findById(id).get();}


    public String addH(ThuocTinhRequest h){
        long count = hangRepository.count();
        String ma = String.format("H%03d", count + 1);
        Hang hang = Hang.builder()
                .ma(ma)
                .ten(h.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        hangRepository.save(hang);
        return "Done";
    }
}
