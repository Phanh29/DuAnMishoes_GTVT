package org.example.be.controller.sanpham;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.service.SanPham.DeGiayService;
import org.example.be.service.SanPham.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/de-giay")
@RequiredArgsConstructor
public class DeGiayController {
    @Autowired
    DeGiayService deGiayService;

    @GetMapping
    public ResponseEntity<?> getALLDeGiay() {
        return ResponseEntity.ok(deGiayService.getAllDeGiay());
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> detail(@PathVariable("id") String id) {
        return ResponseEntity.ok(deGiayService.detailDeGiay(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ThuocTinhRequest request) {
        return ResponseEntity.ok(deGiayService.update(id, request));
    }


    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuocTinhRequest v) {
        return ResponseEntity.ok(deGiayService.addDeGiay(v));
    }
}
