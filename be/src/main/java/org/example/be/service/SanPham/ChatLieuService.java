package org.example.be.service.SanPham;


import org.example.be.dto.request.ThuocTinhRequest;
import org.example.be.dto.respon.ThuocTinhRepo;
import org.example.be.entity.ChatLieu;
import org.example.be.repository.ThuocTinhSanPham.ChatLieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatLieuService {
    @Autowired
    ChatLieuRepository chatLieuRepository;
    public List<ThuocTinhRepo> getAllChatLieu() {
        return chatLieuRepository.getALLCL();
    }
    public ChatLieu update(String id, ThuocTinhRequest request) {
        ChatLieu cl = request.mapToEntity(new ChatLieu());
        cl.setId(id);
        cl.setNgaySua(LocalDateTime.now());
        return chatLieuRepository.save(cl);
    }
    public ChatLieu detailCL(String id){return chatLieuRepository.findById(id).get();}


    public String addCL(ThuocTinhRequest cl){
        long count = chatLieuRepository.count();
        String ma = String.format("CL%03d", count + 1);
        ChatLieu chatLieu = ChatLieu.builder()
                .ma(ma)
                .ten(cl.getTen())
                .ngayTao(LocalDateTime.now())
                .trangThai(0)
                .build();
        chatLieuRepository.save(chatLieu);
        return "Done";
    }
}