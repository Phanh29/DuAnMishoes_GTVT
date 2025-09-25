package org.example.be.controller.client;
import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.GioHangRequest;
import org.example.be.service.GioHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/gio-hang")
@RequiredArgsConstructor
public class GioHangController {
    @Autowired
    GioHangService gioHangService;
    @GetMapping("/detailGH/{idKH}")
    public ResponseEntity<?> detailGH(@PathVariable("idKH")String idKH){
        return ResponseEntity.ok(gioHangService.detailGioHang(idKH));
    }
    @GetMapping("/detailGHByID/{id}")
    public ResponseEntity<?> detailGHByID(@PathVariable("id")String id){
        return ResponseEntity.ok(gioHangService.detailGHByID(id));
    }
    @PostMapping("/addGH")
    public ResponseEntity<?> addGH(@RequestBody GioHangRequest request){
        return ResponseEntity.ok(gioHangService.addGioHang(request));
    }
}
