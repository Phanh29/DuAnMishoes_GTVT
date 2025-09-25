package org.example.be.service.SanPham;

import org.example.be.dto.request.ChiTietSanPhamRequest;
import org.example.be.dto.respon.ChiTietSanPhamRespone;
import org.example.be.dto.respon.DetailChiTietSanPhamRepo;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.entity.KhuyenMai;
import org.example.be.entity.KhuyenMaiSanPham;
import org.example.be.model.CTSPForKhuyenMai;
import org.example.be.repository.ChiTietSanPhamRepository;
import org.example.be.service.HoaDon.HoaDonChiTietService;
import org.example.be.service.KhuyenMaiSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChiTietSanPhamService {
    @Autowired
    ChiTietSanPhamRepository ctspRepository;
    @Autowired
    KhuyenMaiSanPhamService khuyenMaiSanPhamService;
    @Autowired
    HoaDonChiTietService hoaDonChiTietService;
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

    // đợt giảm giá (khuyến mại)
    public ChiTietSanPham updateKM(String idCTSP, KhuyenMai km) {
        // 1) Lấy CTSP
        ChiTietSanPham ctsp = ctspRepository.findById(idCTSP)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy CTSP: " + idCTSP));

        // 2) Upsert quan hệ KhuyenMaiSanPham (nếu chưa có)
        KhuyenMaiSanPham existed = khuyenMaiSanPhamService.find(km.getId(), idCTSP);
        if (existed == null) {
            KhuyenMaiSanPham kmsp = new KhuyenMaiSanPham();
            kmsp.setKhuyenMai(km);
            kmsp.setTrangThai(0);
            kmsp.setChiTietSanPham(ctsp);
            String maGen = (km.getMa() == null ? "KM" : km.getMa())
                    + ctsp.getSanPham().getTen()
                    + ctsp.getMauSac().getTen()
                    + ctsp.getKichThuoc().getTen();
            kmsp.setMa(maGen);
            khuyenMaiSanPhamService.add(kmsp);
        }

        // 3) Gán KM vào CTSP nếu start > now (giữ nguyên logic của bạn)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime start = km.getNgay_bat_dau();
        if (start != null && start.isAfter(now)) {
            ctsp.setKhuyenMai(km);
            ctsp.setNgaySua(now);
            ctsp = ctspRepository.save(ctsp);
        }

        // 4) Tính giá giảm & giá sau giảm (null-safe, không âm)
        BigDecimal giaBan = nvl(ctsp.getGiaBan());
        BigDecimal giaTri = nvl(km.getGia_tri_khuyen_mai());
        BigDecimal giaGiam;
        BigDecimal giaSauGiam;

        if ("Tiền mặt".equalsIgnoreCase(nvlStr(km.getLoai()))) {
            giaGiam = giaTri;
        } else {
            // Phần trăm
            BigDecimal fraction = giaTri.divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP);
            giaGiam = giaBan.multiply(fraction).setScale(0, RoundingMode.HALF_UP); // tuỳ quy tắc làm tròn
        }
        giaSauGiam = giaBan.subtract(giaGiam);
        if (giaSauGiam.compareTo(BigDecimal.ZERO) < 0) giaSauGiam = BigDecimal.ZERO;

        // 5) Cập nhật giá ở HĐCT (giữ đúng chữ ký hàm bạn đang dùng)
        hoaDonChiTietService.updateGia(idCTSP, giaGiam, giaSauGiam);

        return ctsp;
    }

    private BigDecimal nvl(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }
    private String nvlStr(String s) { return s == null ? "" : s; }
}
