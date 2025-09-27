package org.example.be.controller.client;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.example.be.dto.impldto.SanPhamDetailResponse;
import org.example.be.dto.request.DiaChiRequest;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.dto.request.TimSanPhamTheoMang;
import org.example.be.service.HomeService;
import org.example.be.service.KhachHangService;
import org.example.be.service.SanPham.*;
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
    @Autowired
    HinhAnhService hinhAnhService;
    @Autowired
    SanPhamService sanPhamService;
    @Autowired
    KhachHangService khachHangService;
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

    @GetMapping("/tim-kiem/{tenTim}")
    public ResponseEntity<?> getTimSanPham(@PathVariable("tenTim") String tenTim) {
        return ResponseEntity.ok(homeService.getTim(tenTim));
    }

    // detail
    @GetMapping("/san-pham-detail/{id}")
    public ResponseEntity<SanPhamDetailResponse> getDetail(@PathVariable("id") String id) {
        return ResponseEntity.ok(sanPhamService.getProductDetailByCtsp(id));
    }
    @GetMapping("/khach-hang/dia-chi/{idKH}")
    public  ResponseEntity<?> getALLDCbyKH(@PathVariable("idKH") String idKH){
        return ResponseEntity.ok(khachHangService.findDiaChiByKH(idKH));
    }
    @GetMapping("/khach-hang/dia-chi-mac-dinh/{idKH}")
    public  ResponseEntity<?> getDiaChiMacDinhByKH(@PathVariable("idKH") String idKH){
        return ResponseEntity.ok(khachHangService.findDiaChiMacDinh(idKH));
    }
    @PostMapping("/khach-hang/add-dia-chi")
    public ResponseEntity<?> addDiaChi(@RequestBody DiaChiRequest request){
        request.setTrangThai(1);
        return ResponseEntity.ok(khachHangService.addDiaChi(request));
    }
    @PostMapping("/khach-hang/update-dia-chi/{id}")
    public ResponseEntity<?> updateDiaChi(@PathVariable("id")String id,@RequestBody DiaChiRequest request){
        return ResponseEntity.ok(khachHangService.updateDiaChi(id,request));
    }
    @PostMapping("/khach-hang/update-dia-chi-mac-dinh/{id}")
    public ResponseEntity<?> updateTTDC(@PathVariable("id")String id){
        return ResponseEntity.ok(khachHangService.updateDiaChiMacDinh(id));
    }
}
