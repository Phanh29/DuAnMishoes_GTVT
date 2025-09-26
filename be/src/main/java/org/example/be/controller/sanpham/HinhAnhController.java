package org.example.be.controller.sanpham;

import org.example.be.dto.request.HinhAnhRequest;
import org.example.be.service.SanPham.HinhAnhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/hinhanh")
public class HinhAnhController {
    @Autowired
    HinhAnhService hinhAnhService;
    @GetMapping("/{ten}/{idSP}")
    public ResponseEntity<?> detail(@PathVariable("ten") String ten, @PathVariable("idSP") String idSP){
        return ResponseEntity.ok(hinhAnhService.getAnhCTSP(ten,idSP));
    }
    @PostMapping("/add-anh/{idSP}")
    public ResponseEntity<?> upAnh(@RequestBody HinhAnhRequest ha, @PathVariable("idSP") String idSP){
       return ResponseEntity.ok(hinhAnhService.addAnhMoi(ha,idSP));
    }
    @DeleteMapping("/delete-anh/{idCTSP}")
    public ResponseEntity<?> deleteAnh(@PathVariable("idCTSP") String idCTSP){
        hinhAnhService.deleteAnh(idCTSP);
        return ResponseEntity.ok("Done");
    }
}
