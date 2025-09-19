package org.example.be.service.SanPham;

import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.SanPham;
import org.example.be.repository.ThuocTinhSanPham.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SanPhamService {
    @Autowired
    SanPhamRepository sanPhamRepository;

    public List<ThuocTinhRepo> getAllSanPham() {
        return sanPhamRepository.getALLSP();
    }

    public SanPham update(String id, ThuocTinhRequest request) {
        SanPham sp = request.mapToEntity(new SanPham());
        sp.setId(id);
        sp.setNgaySua(LocalDateTime.now());
        return sanPhamRepository.save(sp);
    }

    public SanPham detailSP(String id) {
        return sanPhamRepository.findById(id).get();
    }


    public String addSP(ThuocTinhRequest sp) {
        long count = sanPhamRepository.count();
        String ma = String.format("SP%03d", count + 1);
        SanPham sanPham = SanPham.builder()
                .ma(ma)
                .ten(sp.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        sanPhamRepository.save(sanPham);
        return "Done";
    }

    public List<String> getListMauSacBySanPhamID(String id) {
        return sanPhamRepository.getListMauSacBySanPhamId(id);
    }

    public List<String> getListKichThuocBySanPhamID(String id) {
        return sanPhamRepository.getListKichThuocBySanPhamId(id);
    }
}