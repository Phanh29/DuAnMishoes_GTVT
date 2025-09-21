package org.example.be.service.SanPham;

import org.example.be.dto.request.ChiTietSanPhamRequest;
import org.example.be.dto.respon.ChiTietSanPhamRespone;
import org.example.be.dto.respon.DetailChiTietSanPhamRepo;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.repository.ChiTietSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChiTietSanPhamService {
    @Autowired
    ChiTietSanPhamRepository ctspRepository;
    public List<ChiTietSanPham> getALL(){
        return ctspRepository.findAll();
    }
    public List<ChiTietSanPhamRespone> getALLCTSP(String id){
        return ctspRepository.getALLCTSP(id);
    }
    public ChiTietSanPham add (ChiTietSanPhamRequest sp){
        ChiTietSanPham ct = sp.map(new ChiTietSanPham());
        return ctspRepository.save(ct);
    }
    public List<DetailChiTietSanPhamRepo> detail(){return ctspRepository.detail();}
}
