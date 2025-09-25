package org.example.be.service.HoaDon;

import org.example.be.entity.GioHangChiTiet;
import org.example.be.entity.HoaDon;
import org.example.be.entity.HoaDonChiTiet;
import org.example.be.repository.GioHangChiTietRepository;
import org.example.be.repository.hoadon.HoaDonChiTietRepository;
import org.example.be.repository.hoadon.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
@Service
public class HoaDonChiTietService {
    @Autowired
    HoaDonChiTietRepository hoaDonChiTietRepository;
    @Autowired
    HoaDonRepository hoaDonRepository;
    @Autowired
    GioHangChiTietRepository gioHangChiTietRepository;
    public void updateGia(String idCTSP, BigDecimal giaGiam , BigDecimal giaSauGiam){
        List<HoaDonChiTiet> list = hoaDonChiTietRepository.getAllHDCTByCTSP(idCTSP);
        List<GioHangChiTiet> listGH=gioHangChiTietRepository.getAllGHCTByCTSP(idCTSP);
        for (HoaDonChiTiet h : list){
            if (h.getTrangThai() == 0) {
                BigDecimal before = h.getGiaSauGiam().subtract(h.getGiaGiam());
                BigDecimal after = giaSauGiam.subtract(giaGiam);
                HoaDon hd = hoaDonRepository.getHoaDonByIDHD(h.getHoaDon().getId());
                hd.setGiaGoc(hd.getGiaGoc().subtract(h.getGiaSauGiam()).add(giaSauGiam));
                hd.setThanhTien(hd.getThanhTien().subtract(h.getGiaSauGiam()).add(giaSauGiam));
                hoaDonRepository.save(hd);
                h.setGiaGiam(giaGiam);
                h.setGiaSauGiam(giaSauGiam);
                hoaDonChiTietRepository.save(h);
            }
            System.out.println( hoaDonChiTietRepository.save(h));
        }
        if(listGH.size()>0) {
            for(GioHangChiTiet gh :listGH){
                System.out.println("giỏ hàng"+gh);
                gh.setThanhTien(giaSauGiam.multiply(BigDecimal.valueOf(gh.getSoLuong())));
                gioHangChiTietRepository.save(gh);
            }
        }
//        thongBaoService.socketLoadSanPham(idCTSP);
    }
}
