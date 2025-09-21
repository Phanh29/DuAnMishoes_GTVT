package org.example.be.controller.sanpham;

import org.example.be.dto.request.ChiTietSanPhamRequest;
import org.example.be.dto.request.HinhAnhRequest;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.service.SanPham.ChiTietSanPhamService;
import org.example.be.service.SanPham.HinhAnhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/ctsp")
public class ChiTietSanPhamController {
    @Autowired
    HinhAnhService hinhAnhService;
    @Autowired
    ChiTietSanPhamService ctspService;

    @GetMapping("/show")
    public ResponseEntity<?> getALLCTSP() {
        return new ResponseEntity<>(ctspService.getALL(), HttpStatus.OK);
    }
    @GetMapping("/showct/{idSP}")
    public ResponseEntity<?> getALLCTSP(@PathVariable("idSP") String id) {
        return new ResponseEntity<>(ctspService.getALLCTSP(id), HttpStatus.OK);
    }
    @GetMapping("/detailsp")
    public ResponseEntity<?> getAllDetail() {
        return new ResponseEntity<>(ctspService.detail(), HttpStatus.OK);
    }
    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody ChiTietSanPhamRequest request, HinhAnhRequest ha) {
        request.setGiaNhap(BigDecimal.valueOf(0));
        request.setTrangThai(0);
        request.setSoLuongTra(0);
        request.setNgayTao(LocalDateTime.now());
        request.setGioiTinh(true);
        ArrayList<String> listLink = request.getLinkAnh();
        ChiTietSanPham newct = ctspService.add(request);
        for (String link : listLink) {
            int maAnh = hinhAnhService.getALL().size();
            ha.setTrangThai(0);
            ha.setMa("HA-" + (maAnh + 1));
            ha.setChiTietSanPham(newct.getId());
            ha.setTen(newct.getMauSac().getId());
            ha.setUrl(link);
            ha.setNgayTao(LocalDateTime.now());
            hinhAnhService.add(ha);
        }
        return ResponseEntity.ok("Done");
    }
}
