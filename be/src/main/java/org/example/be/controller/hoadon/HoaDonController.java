package org.example.be.controller.hoadon;

import lombok.RequiredArgsConstructor;
import org.example.be.service.HoaDon.HoaDonService;
import org.example.be.service.HoaDon.LichSuHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/hoa-don")
@RequiredArgsConstructor
public class HoaDonController {
    @Autowired
    private HoaDonService hoaDonService;
    @GetMapping()
    public ResponseEntity<?> getALL(){
        return  ResponseEntity.ok(hoaDonService.getALL());
    }
    @Autowired
    private LichSuHoaDonService lichSuHoaDonService;

    @GetMapping("/detail-lich-su-hoa-don/{idHD}")
    public ResponseEntity<?> detailLSHD(@PathVariable("idHD") String id){
        return  ResponseEntity.ok(lichSuHoaDonService.getLichHoaDon(id));
    }
}
