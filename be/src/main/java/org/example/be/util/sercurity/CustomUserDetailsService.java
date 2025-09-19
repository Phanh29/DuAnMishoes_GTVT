package org.example.be.util.sercurity;


import org.example.be.entity.NguoiDung;
import org.example.be.repository.NguoiDungRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final NguoiDungRepository nguoiDungRepository;

    public CustomUserDetailsService(NguoiDungRepository nguoiDungRepository) {
        this.nguoiDungRepository = nguoiDungRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        NguoiDung nguoiDung = nguoiDungRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(nguoiDung.getChucVu())  // VD: "NHANVIEN"
        );

        return new User(
                nguoiDung.getEmail(),
                nguoiDung.getMatKhau(),
                authorities   // ✅ PHẢI TRẢ AUTHORITIES Ở ĐÂY!
        );
    }
    // Phương thức để lấy đối tượng NguoiDung
    public NguoiDung getNguoiDungByEmail(String email) {
        return nguoiDungRepository.findByEmail(email).orElse(null);
    }
}
