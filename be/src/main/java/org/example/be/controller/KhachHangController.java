package org.example.be.controller;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.DiaChiRequest;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.dto.request.SearchTenAndTrangThaiRequest;
import org.example.be.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/khach-hang")
@RequiredArgsConstructor
public class KhachHangController {
    @Autowired
    KhachHangService khachHangService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(khachHangService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestParam("request") String requestJson) {
        Gson gson = new Gson();
        NguoiDungRequest requestDto = gson.fromJson(requestJson, NguoiDungRequest.class);
        return ResponseEntity.ok(khachHangService.add(requestDto));
    }
    @PutMapping()
    public ResponseEntity<?> update(@RequestParam("request") String request) {
        Gson gson = new Gson();
        NguoiDungRequest requestDto = gson.fromJson(request, NguoiDungRequest.class);
        return ResponseEntity.ok(khachHangService.update(requestDto));
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {
        return ResponseEntity.ok(khachHangService.getByID(id));
    }
    // modal địa chỉ
    @GetMapping("/dia-chi/{idKH}")
    public  ResponseEntity<?> getALLDCbyKH(@PathVariable("idKH") String idKH){
        return ResponseEntity.ok(khachHangService.findDiaChiByKH(idKH));
    }
    @PostMapping("/add-dia-chi")
    public ResponseEntity<?> addDiaChi(@RequestBody DiaChiRequest request){
        request.setTrangThai(1);
        return ResponseEntity.ok(khachHangService.addDiaChi(request));
    }
    @PostMapping("/update-dia-chi/{id}")
    public ResponseEntity<?> updateDiaChi(@PathVariable("id")String id,@RequestBody DiaChiRequest request){
        return ResponseEntity.ok(khachHangService.updateDiaChi(id,request));
    }
    @PostMapping("/update-dia-chi-mac-dinh/{id}")
    public ResponseEntity<?> updateTTDC(@PathVariable("id")String id){
        return ResponseEntity.ok(khachHangService.updateDiaChiMacDinh(id));
    }
}
