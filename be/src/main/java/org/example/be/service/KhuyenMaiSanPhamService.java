package org.example.be.service;

import org.example.be.entity.KhuyenMaiSanPham;
import org.example.be.repository.KhuyenMaiSanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class KhuyenMaiSanPhamService {
    @Autowired
    KhuyenMaiSanPhamRepository khuyenMaiSanPhamRepository;
    public KhuyenMaiSanPham add(KhuyenMaiSanPham kmsp){
        return khuyenMaiSanPhamRepository.save(kmsp);
    }
    public KhuyenMaiSanPham find(String idKM, String idCTSP){
        return  khuyenMaiSanPhamRepository.findKhuyenMaiSanPham(idKM,idCTSP);
    }
}
