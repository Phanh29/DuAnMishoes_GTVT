package org.example.be.controller.sanpham;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.service.SanPham.DanhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/danh-muc")
@RequiredArgsConstructor
public class DanhMucController {
    @Autowired
    DanhMucService danhMucService;

    @GetMapping
    public ResponseEntity<?> getALLDM() {
        return ResponseEntity.ok(danhMucService.getAllDanhMuc());
    }


    @GetMapping("/detail/{idDM}")
    public ResponseEntity<?> detail(@PathVariable("idDM") String id) {
        return ResponseEntity.ok(danhMucService.detailDM(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ThuocTinhRequest request) {
        return ResponseEntity.ok(danhMucService.update(id, request));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuocTinhRequest v) {
        return ResponseEntity.ok(danhMucService.addDM(v));
    }
}

