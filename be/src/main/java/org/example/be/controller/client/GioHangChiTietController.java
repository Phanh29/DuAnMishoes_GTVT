package org.example.be.controller.client;

import lombok.RequiredArgsConstructor;
import org.example.be.service.GioHangChiTietService;
import org.example.be.service.SanPham.ChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/gio-hang-chi-tiet")
@RequiredArgsConstructor
public class GioHangChiTietController {
    @Autowired
    GioHangChiTietService gioHangChiTietService;
    @Autowired
    ChiTietSanPhamService ctspService;

    @GetMapping("/getAll/{idGH}")
    public ResponseEntity<?> getAllGHCT(@PathVariable("idGH") String idGH) {
        return ResponseEntity.ok(gioHangChiTietService.getAllGHCT(idGH));
    }
//    @PostMapping("/addGHCT")
//    public ResponseEntity<?> addGHCT(@RequestBody GioHangChiTietRequest request){
//        return ResponseEntity.ok(gioHangChiTietService.addGHCT(request));
//    }
//    @PostMapping("/updateSLGHCT")
//    public ResponseEntity<?> updateSLGHCT(@RequestBody GioHangChiTietRequest request){
//        return ResponseEntity.ok(gioHangChiTietService.updateSLGHCT(request));
//    }
//    @PostMapping("/updateGHCT")
//    public ResponseEntity<?> updateGHCT(@RequestBody GioHangChiTietRequest request){
//        return ResponseEntity.ok(gioHangChiTietService.updateGHCT(request));
//    }
//    @GetMapping("/detailCTSP/{idCT}") // truyền vào ictsp lấy ra detail
//    public ResponseEntity<?> getDetail(@PathVariable("idCT") String id) {
//        return  ResponseEntity.ok(ctspService.detailCTSPGioHang(id));
//    }
//    @DeleteMapping("/deleteGHCT/{id}")
//    public ResponseEntity<?> deleteGHCT(@PathVariable("id") String id){
//        return ResponseEntity.ok(gioHangChiTietService.deleteGHCT(id));
//    }
//
//    @GetMapping("/so-luong-san-pham-trong-gio-hang/{idGH}")
//    public Integer soLuongSPtrongGH(@PathVariable("idGH")String idGH){
//        return gioHangChiTietService.soLuongSanPhamTrongGioHang(idGH);
//    }
}
