package org.example.be.service.HoaDon;

import org.example.be.model.HoaDonResponn;
import org.example.be.repository.hoadon.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HoaDonService {
    @Autowired
    HoaDonRepository hoaDonRepository;
    public List<HoaDonResponn> getALL() {
        return hoaDonRepository.getALLHD();
    }
}
