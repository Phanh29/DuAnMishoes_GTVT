package org.example.be.controller.client;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.TimSanPhamTheoMang;
import org.example.be.service.HomeService;
import org.example.be.service.SanPham.HangService;
import org.example.be.service.SanPham.KichThuocService;
import org.example.be.service.SanPham.MauSacService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/home")
@RequiredArgsConstructor
public class HomeController {
    @Autowired
    HomeService homeService;
    @Autowired
    HangService hangService;
    @Autowired
    MauSacService mauSacService;
    @Autowired
    KichThuocService kichThuocService;
    @GetMapping()
    public ResponseEntity<?> getALL() {
        return ResponseEntity.ok(homeService.getAllSanPham());
    }

    @GetMapping("/new")
    public ResponseEntity<?> getALLNew() {
        return ResponseEntity.ok(homeService.getNewSanPham());
    }

    @GetMapping("/hot")
    public ResponseEntity<?> getHotSale() {
        return ResponseEntity.ok(homeService.getHotSale());
    }

    @PostMapping("/searchMang")
    public ResponseEntity<?> getLocSanPham(@RequestBody TimSanPhamTheoMang request) {
        return ResponseEntity.ok(homeService.getSearchListSanPham(request));
    }

    @GetMapping("/hang")
    public ResponseEntity<?> getHang() {
        return ResponseEntity.ok(hangService.getAllHang());
    }

    @GetMapping("/mau-sac")
    public ResponseEntity<?> getMauSac() {
        return ResponseEntity.ok(mauSacService.getALL());
    }

    @GetMapping("/kich-thuoc")
    public ResponseEntity<?> getKichThuoc() {
        return ResponseEntity.ok(kichThuocService.getAllKichThuoc());
    }

//    @GetMapping("/tim-kiem/{tenTim}")
//    public ResponseEntity<?> getTimSanPham(@PathVariable("tenTim") String tenTim) {
//        return ResponseEntity.ok(homeService.getTim(tenTim));
//    }
}
