package org.example.be.service;

import org.example.be.dto.request.TimSanPhamTheoMang;
import org.example.be.dto.respon.HomeRespone;
import org.example.be.repository.HomeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeService {
    @Autowired
    HomeRepository homeRepository;

    public List<HomeRespone> getAllSanPham() {
        return homeRepository.getALLSanPham();
    }

    public List<HomeRespone> getNewSanPham() {
        return homeRepository.getALLSanPhamNew();
    }

    public List<HomeRespone> getHotSale() {
        return homeRepository.getHotSale();
    }

    public List<HomeRespone> getSearchListSanPham(TimSanPhamTheoMang sp) {

        if (sp.getArrayHang().length > 0 && sp.getArrayMauSac().length <= 0 && sp.getArrayKichThuoc().length <= 0) {
            return homeRepository.getLocSanPham(sp);
        }
        if (sp.getArrayHang().length > 0 && sp.getArrayMauSac().length > 0 && sp.getArrayKichThuoc().length <= 0) {
            return homeRepository.getLocSanPhamMauSac(sp);
        }
        if (sp.getArrayHang().length > 0 && sp.getArrayMauSac().length <= 0 && sp.getArrayKichThuoc().length > 0) {
            System.out.println(sp);
            return homeRepository.getLocSanPhamKichThuoc(sp);
        }
        if (sp.getArrayHang().length <= 0 && sp.getArrayMauSac().length > 0 && sp.getArrayKichThuoc().length <= 0) {
            return homeRepository.getLocMauSac(sp);
        }
        if (sp.getArrayHang().length <= 0 && sp.getArrayMauSac().length > 0 && sp.getArrayKichThuoc().length > 0) {
            return homeRepository.getLocMauSacKichthuoc(sp);
        }
        if (sp.getArrayHang().length <= 0 && sp.getArrayMauSac().length <= 0 && sp.getArrayKichThuoc().length > 0) {
            return homeRepository.getLocKichThuoc(sp);
        }
        if(sp.getArrayHang().length>0 && sp.getArrayMauSac().length>0 && sp.getArrayKichThuoc().length>0){
            return homeRepository.getLocSanPhamAll(sp);
        }
        return homeRepository.getLocSanPhamNoData(sp);
    }

    public List<HomeRespone> getTim(String ten) {
        return homeRepository.getTimSanPham(ten);
    }
}
