package org.example.be.service.SanPham;

import org.example.be.dto.impldto.SanPhamDetailResponse;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.SanPhamRespone;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.entity.SanPham;
import org.example.be.repository.ChiTietSanPhamRepository;
import org.example.be.repository.ThuocTinhSanPham.HinhAnhRepository;
import org.example.be.repository.ThuocTinhSanPham.KichThuocRepository;
import org.example.be.repository.ThuocTinhSanPham.MauSacRespository;
import org.example.be.repository.ThuocTinhSanPham.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
        // 0) Lấy CTSP đại diện
        ChiTietSanPham ctsp0 = chiTietSanPhamRepository.findById(ctspId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy CTSP"));
        String sanPhamId = ctsp0.getSanPham().getId();

        // 1) Màu + ảnh (gom ảnh từ tất cả CTSP thuộc mỗi màu của cùng sản phẩm)
        List<SanPhamDetailResponse.ColorResponse> colors =
                mauSacRepository.findBySanPhamId(sanPhamId)
                        .stream()
                        .map(ms -> {
                            // tất cả ctsp.id của sản phẩm này theo màu ms
                            List<String> ctspIds = chiTietSanPhamRepository
                                    .findIdsBySanPhamAndMauSac(sanPhamId, ms.getId());
                            // ảnh ở bảng hinh_anh chỉ có chi_tiet_san_pham_id → lọc distinct để tránh trùng
                            List<String> images = ctspIds.isEmpty()
                                    ? List.of()
                                    : hinhAnhRepository.findUrlsByCtspIds(ctspIds)
                                    .stream()
                                    .distinct()
                                    .toList();
                            return new SanPhamDetailResponse.ColorResponse(
                                    ms.getId(),
                                    ms.getTen(),
                                    ms.getMa(),
                                    images
                            );
                        })
                        .toList();

        // 2) Size (distinct theo sản phẩm)
        List<SanPhamDetailResponse.SizeResponse> sizes =
                kichThuocRepository.findBySanPhamId(sanPhamId)
                        .stream()
                        .map(kt -> new SanPhamDetailResponse.SizeResponse(kt.getId(), kt.getTen()))
                        .toList();

        // 3) Biến thể (toàn bộ CTSP của sản phẩm)
        List<SanPhamDetailResponse.VariantResponse> variants =
                chiTietSanPhamRepository.findBySanPhamId(sanPhamId)
                        .stream()
                        .map(v -> new SanPhamDetailResponse.VariantResponse(
                                v.getId(),
                                v.getMauSac() != null ? v.getMauSac().getId() : null,
                                v.getKichThuoc() != null ? v.getKichThuoc().getId() : null,
                                v.getGiaBan(),
                                v.getSoLuong(),
                                v.getKhuyenMai() != null
                                        ? new SanPhamDetailResponse.KhuyenMaiResponse(
                                        v.getKhuyenMai().getLoai(),
                                        v.getKhuyenMai().getGia_tri_khuyen_mai()
                                )
                                        : null
                        ))
                        .toList();

        // 4) Trả DTO – lấy phần mô tả/thuộc tính từ CTSP đại diện (vì SP không có)
        return new SanPhamDetailResponse(
                ctsp0.getSanPham().getId(),                       // idSanPham
                ctsp0.getSanPham().getTen(),                      // tên (nếu tên ở SP)
                ctsp0.getMoTa(),                                  // mô tả ở CTSP
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