package org.example.be.service.HoaDon;

import org.example.be.dto.request.LichSuHoaDonRequest;
import org.example.be.dto.respon.HoaDonTimeLineRespon;
import org.example.be.entity.LichSuHoaDon;
import org.example.be.repository.hoadon.LichSuHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class LichSuHoaDonService {
    @Autowired
    LichSuHoaDonRepository lichSuHoaDonRepository;
    public LichSuHoaDon addLichSuHoaDon(LichSuHoaDonRequest lichSuHoaDonRequest){
        LichSuHoaDon lichSuHoaDon = lichSuHoaDonRequest.map(new LichSuHoaDon());
        return lichSuHoaDonRepository.save(lichSuHoaDon);

    }
    public LichSuHoaDon save(LichSuHoaDon lichSuHoaDon){
        return lichSuHoaDonRepository.save(lichSuHoaDon);
    }
    public List<HoaDonTimeLineRespon> getLichHoaDon(String idHD) {
        return lichSuHoaDonRepository.detailLichSuHoaDon(idHD);
    }
}
