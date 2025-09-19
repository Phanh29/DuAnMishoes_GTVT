package org.example.be.controller.sanpham;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.service.SanPham.KichThuocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/kich-thuoc")
@RequiredArgsConstructor
public class KichThuocController {
    @Autowired
    KichThuocService kichThuocService;

    @GetMapping
    public ResponseEntity<?> getALLKT() {
        return ResponseEntity.ok(kichThuocService.getAllKichThuoc());
    }


    @GetMapping("/detail/{idKT}")
    public ResponseEntity<?> detail(@PathVariable("idKT") String id) {
        return ResponseEntity.ok(kichThuocService.detailKT(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ThuocTinhRequest request) {
        return ResponseEntity.ok(kichThuocService.update(id, request));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuocTinhRequest v) {
        return ResponseEntity.ok(kichThuocService.addKT(v));
    }
}

