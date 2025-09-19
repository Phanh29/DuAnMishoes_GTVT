package org.example.be.controller;

import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.service.NhanVienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/nhan-vien")
@RequiredArgsConstructor
public class NhanVienController {
    @Autowired
    NhanVienService nhanVienService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(nhanVienService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestParam("request") String requestJson) {
        Gson gson = new Gson();
        NguoiDungRequest requestDto = gson.fromJson(requestJson, NguoiDungRequest.class);
        return ResponseEntity.ok(nhanVienService.add(requestDto));
    }

    @PutMapping()
    public ResponseEntity<?> update(@RequestParam("request") String request) {
        Gson gson = new Gson();
        NguoiDungRequest requestDto = gson.fromJson(request, NguoiDungRequest.class);
        return ResponseEntity.ok(nhanVienService.update(requestDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") String id) {
        return ResponseEntity.ok(nhanVienService.getByID(id));
    }
}
