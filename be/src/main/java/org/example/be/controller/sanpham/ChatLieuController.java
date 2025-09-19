package org.example.be.controller.sanpham;

import lombok.RequiredArgsConstructor;
import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.service.SanPham.ChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin("http://localhost:3000/")
@RestController
@RequestMapping("/admin/chat-lieu")
@RequiredArgsConstructor
public class ChatLieuController {
    @Autowired
    ChatLieuService chatLieuService;

    @GetMapping
    public ResponseEntity<?> getALLCL() {
        return ResponseEntity.ok(chatLieuService.getAllChatLieu());
    }


    @GetMapping("/detail/{idCL}")
    public ResponseEntity<?> detail(@PathVariable("idCL") String id) {
        return ResponseEntity.ok(chatLieuService.detailCL(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable("id") String id, @RequestBody ThuocTinhRequest request) {
        return ResponseEntity.ok(chatLieuService.update(id, request));
    }

    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody ThuocTinhRequest v) {
        return ResponseEntity.ok(chatLieuService.addCL(v));
    }
}

