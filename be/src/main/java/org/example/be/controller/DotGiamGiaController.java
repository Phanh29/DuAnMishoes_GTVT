package org.example.be.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.KhuyenMaiRequest;
import org.example.be.entity.KhuyenMai;
import org.example.be.service.KhuyenMaiService;
import org.example.be.service.SanPham.ChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/dot-giam-gia")
@RequiredArgsConstructor
public class DotGiamGiaController {
    @Autowired
    KhuyenMaiService khuyenMaiService;
    @Autowired
    ChiTietSanPhamService chiTietSanPhamService;

    @GetMapping("hien-thi")
    public ResponseEntity<?> getALL() {
        return ResponseEntity.ok(khuyenMaiService.getAllDotGiamGia());
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody KhuyenMaiRequest request) {
        KhuyenMai saved = khuyenMaiService.addDotGiamGia(request);
        return ResponseEntity.ok(saved);
    }
}
