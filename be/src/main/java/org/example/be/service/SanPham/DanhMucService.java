package org.example.be.service.SanPham;

import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.DanhMuc;
import org.example.be.repository.ThuocTinhSanPham.DanhMucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DanhMucService {
    @Autowired
    DanhMucRepository danhMucRepository;
    public List<ThuocTinhRepo> getAllDanhMuc() {
        return danhMucRepository.getALLDM();
    }
    public DanhMuc update(String id, ThuocTinhRequest request) {
        DanhMuc dm = request.mapToEntity(new DanhMuc());
        dm.setId(id);
        dm.setNgaySua(LocalDateTime.now());
        return danhMucRepository.save(dm);
    }

    public DanhMuc detailDM(String id){return danhMucRepository.findById(id).get();}


    public String addDM(ThuocTinhRequest dm){
        long count = danhMucRepository.count();
        String ma = String.format("DM%03d", count + 1);
        DanhMuc danhMuc = DanhMuc.builder()
                .ma(ma)
                .ten(dm.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        danhMucRepository.save(danhMuc);
        return "Done";
    }
}
