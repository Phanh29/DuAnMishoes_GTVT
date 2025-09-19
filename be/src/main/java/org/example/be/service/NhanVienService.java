package org.example.be.service;

import org.apache.commons.lang3.RandomStringUtils;
import org.example.be.dto.impldto.NguoiDungResponseImplDTO;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.dto.request.SearchTenAndTrangThaiRequest;
import org.example.be.entity.DiaChi;
import org.example.be.entity.NguoiDung;
import org.example.be.model.NguoiDungDiaChiRepository;
import org.example.be.repository.DiaChiRepository;
import org.example.be.repository.NguoiDungRepository;
import org.example.be.util.EmailServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
@Service
public class NhanVienService {
    @Autowired
    NguoiDungRepository nguoiDungRepository;
    @Autowired
    private EmailServiceImpl emailService;
    @Autowired
    private DiaChiRepository diaChiRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<org.example.be.model.NguoiDungRepository> getAll() {
        return nguoiDungRepository.getNguoiDungByChucVu("NHANVIEN");
    }
    public NguoiDungResponseImplDTO add(NguoiDungRequest request) {
        String randompassword = RandomStringUtils.random(8, true, true);
        String pass;
        if(request.getMatKhau()==null){
            pass=passwordEncoder.encode(randompassword);
        }else {
            pass=passwordEncoder.encode(request.getMatKhau());
        }
        NguoiDung add = NguoiDung.builder()
                .ten(request.getTen())
                .ma(String.format("NV%03d", nguoiDungRepository.countNguoiDungByChucVu("NHANVIEN") + 1))
                .email(request.getEmail())
                .gioiTinh(request.getGioiTinh())
                .chucVu("NHANVIEN")
                .canCuocCongDan(request.getCanCuocCongDan())
                .trangThai(0)
                .ngaySinh(request.getNgaySinh())
                .anh(request.getAnh() == null ?  "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg": request.getAnh())
                .ngayThamGia(java.sql.Date.valueOf(LocalDate.now()))
                .ngayTao(LocalDateTime.now())
                .matKhau(pass)
                .soDienThoai(request.getSoDienThoai())
                .build();
        nguoiDungRepository.save(add);
        DiaChi diaChi = new DiaChi();
        diaChi.setDiaChi(request.getDiaChi());
        diaChi.setTenThanhPho(request.getTenThanhPho());
        diaChi.setTenHuyen(request.getTenHuyen());
        diaChi.setTenXa(request.getTenXa());
        diaChi.setIdThanhPho(request.getIdThanhPho());
        diaChi.setIdHuyen(request.getIdHuyen());
        diaChi.setIdXa(request.getIdXa());
        diaChi.setTenNguoiNhan(request.getTen());
        diaChi.setSoDienThoai(request.getSoDienThoai());
        diaChi.setNguoiDung(add);
        diaChi.setTrangThai(0);
        diaChiRepository.save(diaChi);
        emailService.sendEmailPasword(request.getEmail(), "Mật khẩu bạn là ", pass);
        return new NguoiDungResponseImplDTO(add, diaChi);
    }
    @Async
    @Transactional
    public NguoiDungResponseImplDTO update(NguoiDungRequest request) {
        Optional<NguoiDung> optional = nguoiDungRepository.findById(request.getId());
        // todo: update user
        NguoiDung update = optional.get();
        update.setTen(request.getTen());
        update.setEmail(request.getEmail());
        update.setGioiTinh(request.getGioiTinh());
        update.setCanCuocCongDan(request.getCanCuocCongDan());
        update.setTrangThai(0);
        update.setNgaySinh(request.getNgaySinh());
        update.setAnh(request.getAnh());
        update.setSoDienThoai(request.getSoDienThoai());
        update.setNgaySua(LocalDateTime.now());
        nguoiDungRepository.save(update);
        DiaChi diaChiupdate = diaChiRepository.findByUserAndStatus(request.getId());
        diaChiupdate.setDiaChi(request.getDiaChi());
        diaChiupdate.setTenThanhPho(request.getTenThanhPho());
        diaChiupdate.setTenHuyen(request.getTenHuyen());
        diaChiupdate.setTenXa(request.getTenXa());
        diaChiupdate.setIdThanhPho(request.getIdThanhPho());
        diaChiupdate.setIdHuyen(request.getIdHuyen());
        diaChiupdate.setIdXa(request.getIdXa());
        diaChiupdate.setTenNguoiNhan(request.getTen());
        diaChiupdate.setSoDienThoai(request.getSoDienThoai());
        diaChiRepository.save(diaChiupdate);

        return new NguoiDungResponseImplDTO(update, diaChiupdate);
    }

    public NguoiDungDiaChiRepository getByID(String id) {
        NguoiDungDiaChiRepository optional = nguoiDungRepository.findByIdAndChucVu(id,"NHANVIEN");
        return optional;

    }
}
