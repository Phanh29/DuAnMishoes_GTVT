package org.example.be.service;


import org.apache.commons.lang3.RandomStringUtils;
import org.example.be.dto.impldto.NguoiDungResponseImplDTO;
import org.example.be.dto.request.login.DangKyRequest;
import org.example.be.dto.request.DiaChiRequest;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.dto.respon.DiaChiKhachHangRepon;
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
public class KhachHangService {
    @Autowired
    NguoiDungRepository nguoiDungRepository;
    @Autowired
    private EmailServiceImpl emailService;
    @Autowired
    private DiaChiRepository diaChiRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<org.example.be.model.NguoiDungRepository> getAll() {
        return nguoiDungRepository.getNguoiDungByChucVu("KHACHHANG");
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
                .ma(String.format("KH%03d", nguoiDungRepository.countNguoiDungByChucVu("KHACHHANG") + 1))
                .email(request.getEmail())
                .gioiTinh(request.getGioiTinh())
                .chucVu("KHACHHANG")
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
        NguoiDungDiaChiRepository optional = nguoiDungRepository.findByIdAndChucVu(id,"KHACHHANG");
        return optional;

    }

    //tìm địa chỉ mặc định khách hàng
    public DiaChiKhachHangRepon findDiaChiMacDinh(String idKH){
        return diaChiRepository.findDiaChiMacDinh(idKH);
    }
    // tìm kiếm list địa chỉ khách hàng
    public List<DiaChiKhachHangRepon> findDiaChiByKH(String idKH){
        return diaChiRepository.findDiaChiByKH(idKH);
    }
        // thêm địa chỉ khách hàng
    public DiaChi addDiaChi(DiaChiRequest diaChiRequest){
        DiaChi diaChi=diaChiRequest.map(new DiaChi());
        return diaChiRepository.save(diaChi);
    }
    public DiaChi updateDiaChi(String id,DiaChiRequest diaChiRequest){
        DiaChi diaChi=diaChiRequest.map(new DiaChi());
        diaChi.setId(id);
        return diaChiRepository.save(diaChi);
    }
    public DiaChi updateDiaChiMacDinh(String id){
        diaChiRepository.findAll().stream().forEach(o-> {
            if(o.getNguoiDung().getId().equals(diaChiRepository.findById(id).get().getNguoiDung().getId())) {
                o.setTrangThai(1);
                diaChiRepository.save(o);
            }
        });
        DiaChi diaChi=diaChiRepository.findById(id).get();
        diaChi.setTrangThai(0);
        return diaChiRepository.save(diaChi);
    }

    public DiaChi detailDiaChi(String id){
        return diaChiRepository.findById(id).get();
    }

    // khách hàng quên mật khẩu
    public NguoiDung QuenMatKhau(DangKyRequest dangKyRequest) {
        // Tạo mật khẩu ngẫu nhiên 8 ký tự gồm chữ và số
        String password = RandomStringUtils.random(8, true, true);

        // Gửi email thông báo mật khẩu mới
        emailService.sendEmailPasword(
                dangKyRequest.getEmail(),
                "Bạn thay đổi mật khẩu thành công. Mật khẩu mới của bạn là: ",
                password
        );

        // Tìm người dùng theo email
        Optional<NguoiDung> optionalNguoiDung = nguoiDungRepository.findByEmail(dangKyRequest.getEmail());

        if (optionalNguoiDung.isPresent()) {
            NguoiDung nguoiDung = optionalNguoiDung.get();
            nguoiDung.setMatKhau(passwordEncoder.encode(password)); // mã hoá mật khẩu trước khi lưu
            return nguoiDungRepository.save(nguoiDung);
        } else {
            throw new RuntimeException("Không tìm thấy người dùng với email: " + dangKyRequest.getEmail());
        }
    }

}
