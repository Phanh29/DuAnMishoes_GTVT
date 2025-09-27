package org.example.be.controller.sanpham;

import org.example.be.dto.request.ChiTietSanPhamRequest;
import org.example.be.dto.request.HinhAnhRequest;
import org.example.be.dto.request.login.ChiTietSanPhamSearch;
import org.example.be.entity.ChiTietSanPham;
import org.example.be.entity.KhuyenMai;
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

    @GetMapping("/detail/{idCT}")
    public ResponseEntity<?> getDetail(@PathVariable("idCT") String id) {
        return new ResponseEntity<>(ctspService.detailCTSP(id), HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ChiTietSanPhamRequest request, HinhAnhRequest ha) {
        ChiTietSanPham ct = ctspService.add(request,ha);
        return ResponseEntity.ok(ct);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ChiTietSanPhamRequest request) {
        return ResponseEntity.ok(ctspService.update(id, request));
    }

    @PostMapping("/search-ctsp/{idSP}")
    public ResponseEntity<?> search(@PathVariable("idSP") String id, @RequestBody ChiTietSanPhamSearch ctspSearch) {
        return ResponseEntity.ok(ctspService.getSearch(id, ctspSearch));
    }

    // thêm khuyến mại vào sản phẩm
    @PutMapping("/updateKM/{idCTSP}")
    public ResponseEntity<?> update(@PathVariable("idCTSP") String idCTSP,
                                    @RequestBody KhuyenMai khuyenMai) {
        ChiTietSanPham updated = ctspService.updateKM(idCTSP, khuyenMai);
        return ResponseEntity.ok(updated);
    }
    @GetMapping("/showKM/{idKM}")
    public ResponseEntity<?> getALLCTSPByKM(@PathVariable("idKM") String id) {

        return ResponseEntity.ok(ctspService.getALLCTSP(id));
    }
}
