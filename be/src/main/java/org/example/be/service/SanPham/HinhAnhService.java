package org.example.be.service.SanPham;

import org.example.be.dto.request.HinhAnhRequest;
import org.example.be.entity.HinhAnh;
import org.example.be.repository.ThuocTinhSanPham.HinhAnhRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
