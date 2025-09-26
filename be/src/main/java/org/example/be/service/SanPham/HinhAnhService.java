package org.example.be.service.SanPham;

import org.example.be.dto.request.HinhAnhRequest;
import org.example.be.entity.HinhAnh;
import org.example.be.repository.ThuocTinhSanPham.HinhAnhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class HinhAnhService {
    @Autowired
    HinhAnhRepository hinhAnhRepository;
    public List<HinhAnh> getALL(){
        return hinhAnhRepository.findAll();
    }
    public HinhAnh add (HinhAnhRequest request){
        HinhAnh ha = request.map(new HinhAnh());
        return hinhAnhRepository.save(ha);
    }
    public HinhAnh addAnhMoi (HinhAnhRequest request, String idSP){
        int maAnh = getALL().size();
        request.setChiTietSanPham(idSP);
        request.setTrangThai(0);
        request.setNgayTao(LocalDateTime.now());
        request.setMa("HA-" + (maAnh + 1));
        HinhAnh ha = request.map(new HinhAnh());
        return hinhAnhRepository.save(ha);
    }
    public String deleteAnh (String idCTSP){
        hinhAnhRepository.deleteAnhCTSP(idCTSP);
        return "Done";
    }
    public List<HinhAnh> getAnhCTSP(String tenAnh, String idSP){
        return hinhAnhRepository.getAnhCTSP(tenAnh,idSP);
    }
}
