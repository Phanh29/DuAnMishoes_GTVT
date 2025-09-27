package org.example.be.controller.sanpham;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.service.SanPham.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/san-pham")
@RequiredArgsConstructor
public class SanPhamController {
    @Autowired
    SanPhamService sanPhamService;
    @GetMapping("/getAll")
    public ResponseEntity<?> getALL(){
        return new ResponseEntity<>(sanPhamService.getALL(), HttpStatus.OK);
    }
    @GetMapping
    public ResponseEntity<?> getALLSP() {
        return ResponseEntity.ok(sanPhamService.getAllSanPham());
    }

    @GetMapping("/detail/{idSP}")
    public ResponseEntity<?> detail(@PathVariable("idSP") String id) {
        return ResponseEntity.ok(sanPhamService.detailSP(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ThuocTinhRequest request) {
        return ResponseEntity.ok(sanPhamService.update(id, request));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuocTinhRequest v) {
        return ResponseEntity.ok(sanPhamService.addSP(v));
    }

    @GetMapping("/listMS/{id}")
    public ResponseEntity<?> getListMauSacBySanPhamId(@PathVariable("id") String id) {
        return ResponseEntity.ok(sanPhamService.getListMauSacBySanPhamID(id));
    }

    @GetMapping("/listKT/{id}")
    public ResponseEntity<?> getListKichThuocBySanPhamId(@PathVariable("id") String id) {
        return ResponseEntity.ok(sanPhamService.getListKichThuocBySanPhamID(id));
    }
    @GetMapping("/showSP/{idCTSP}")
    public ResponseEntity<?> getSPByCTSP(@PathVariable("idCTSP") String id){
        return ResponseEntity.ok(sanPhamService.getSPByCTSP(id));
    }
}

