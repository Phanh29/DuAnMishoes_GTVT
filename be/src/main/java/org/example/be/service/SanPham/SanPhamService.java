package org.example.be.service.SanPham;

import org.example.be.dto.impldto.SanPhamDetailResponse;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.CtspKmViewRespone;
import org.example.be.dto.respon.SanPhamRespone;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.entity.SanPham;
import org.example.be.repository.ChiTietSanPhamRepository;
import org.example.be.repository.KhuyenMaiSanPhamRepository;
import org.example.be.repository.ThuocTinhSanPham.HinhAnhRepository;
import org.example.be.repository.ThuocTinhSanPham.KichThuocRepository;
import org.example.be.repository.ThuocTinhSanPham.MauSacRespository;
import org.example.be.repository.ThuocTinhSanPham.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SanPhamService {
    @Autowired
    SanPhamRepository sanPhamRepository;
    @Autowired
    private MauSacRespository mauSacRepository;
    @Autowired
    private KichThuocRepository kichThuocRepository;
    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    private HinhAnhRepository hinhAnhRepository;
    @Autowired
    KhuyenMaiSanPhamRepository khuyenMaiSanPhamRepository;
    public List<SanPham> getALL() {
        Sort sortByNgayTao = Sort.by(Sort.Direction.DESC, "ngayTao");
        return sanPhamRepository.findAll(sortByNgayTao);
    }

    public List<SanPhamRespone> getAllSanPham() {
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
    public List<String>  getSPByCTSP(String id){
        return sanPhamRepository.getIDSPbyCTSP(id);
    }
    public SanPhamDetailResponse getProductDetailByCtsp(String ctspId) {
        // 0) CTSP đại diện
        ChiTietSanPham ctsp0 = chiTietSanPhamRepository.findById(ctspId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy CTSP"));
        String sanPhamId = ctsp0.getSanPham().getId();

        // 1) Màu + ảnh (gom ảnh từ tất cả CTSP thuộc mỗi màu)
        var colors = mauSacRepository.findBySanPhamId(sanPhamId)
                .stream()
                .map(ms -> {
                    List<String> ctspIds = chiTietSanPhamRepository
                            .findIdsBySanPhamAndMauSac(sanPhamId, ms.getId());
                    List<String> images = ctspIds.isEmpty()
                            ? List.of()
                            : hinhAnhRepository.findUrlsByCtspIds(ctspIds)
                            .stream().distinct().toList();
                    return new SanPhamDetailResponse.ColorResponse(
                            ms.getId(), ms.getTen(), ms.getMa(), images
                    );
                })
                .toList();

        // 2) Size (distinct theo sản phẩm)
        var sizes = kichThuocRepository.findBySanPhamId(sanPhamId)
                .stream()
                .map(kt -> new SanPhamDetailResponse.SizeResponse(kt.getId(), kt.getTen()))
                .toList();

        // 3a) Toàn bộ CTSP của SP
        List<ChiTietSanPham> allCtsp = chiTietSanPhamRepository.findBySanPhamId(sanPhamId);
        List<String> allCtspIds = allCtsp.stream().map(ChiTietSanPham::getId).toList();

        // 3b) Batch query khuyến mại đang hiệu lực
        LocalDate today = LocalDate.now(); // nếu dùng LocalDateTime, đổi cả repo & đây
        List<CtspKmViewRespone> kmRows = allCtspIds.isEmpty()
                ? List.of()
                : khuyenMaiSanPhamRepository.findActiveKmByCtspIds(allCtspIds, today);

        // 3c) chọn 1 KM "đại diện" cho mỗi CTSP (nếu nhiều, giữ cái đầu;
        //     nếu bạn có doUuTien → bạn có thể chọn theo rule ưu tiên)
        Map<String, CtspKmViewRespone> kmMap = new HashMap<>();
        for (CtspKmViewRespone r : kmRows) {
            kmMap.putIfAbsent(r.getCtspId(), r);
        }

        // 3d) Build variants + gắn KM
        var variants = allCtsp.stream()
                .map(v -> {
                    var km = kmMap.get(v.getId()); // có thể null
                    SanPhamDetailResponse.KhuyenMaiResponse kmDto = null;
                    if (km != null) {
                        kmDto = new SanPhamDetailResponse.KhuyenMaiResponse(
                                km.getLoai(),
                                km.getGiaTri()
                        );
                    }
                    return new SanPhamDetailResponse.VariantResponse(
                            v.getId(),
                            v.getMauSac()    != null ? v.getMauSac().getId()    : null,
                            v.getKichThuoc() != null ? v.getKichThuoc().getId() : null,
                            v.getGiaBan(),
                            v.getSoLuong(),
                            kmDto
                    );
                })
                .toList();

        // 4) Trả DTO (meta từ CTSP đại diện)
        return new SanPhamDetailResponse(
                ctsp0.getSanPham().getId(),
                ctsp0.getSanPham().getTen(),
                ctsp0.getMoTa(),
                ctsp0.getHang()     != null ? ctsp0.getHang().getTen()     : null,
                ctsp0.getDanhMuc()  != null ? ctsp0.getDanhMuc().getTen()  : null,
                ctsp0.getChatLieu() != null ? ctsp0.getChatLieu().getTen() : null,
                ctsp0.getDeGiay()   != null ? ctsp0.getDeGiay().getTen()   : null,
                colors,
                sizes,
                variants
        );
    }
}