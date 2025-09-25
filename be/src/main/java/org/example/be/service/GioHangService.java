package org.example.be.service;

import org.example.be.dto.request.GioHangRequest;
import org.example.be.dto.respon.GioHangRespone;
import org.example.be.entity.GioHang;
import org.example.be.repository.GioHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GioHangService {
    @Autowired
    GioHangRepository gioHangRepository;

    public GioHang addGioHang(GioHangRequest request) {
        GioHang gh = request.map(new GioHang());
        return gioHangRepository.save(gh);
    }

    public GioHangRespone detailGioHang(String idKH) {
        return gioHangRepository.detailGioHang(idKH);
    }

    public GioHangRespone detailGHByID(String id) {
        return gioHangRepository.detailGHByID(id);
    }
}
