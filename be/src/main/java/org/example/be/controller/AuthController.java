package org.example.be.controller;
import com.google.gson.Gson;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.example.be.dto.login.LoginRequest;
import org.example.be.dto.login.LoginRespon;
import org.example.be.dto.request.NguoiDungRequest;
import org.example.be.entity.NguoiDung;
import org.example.be.util.sercurity.CustomUserDetailsService;
import org.example.be.util.sercurity.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    // Inject CustomUserDetailsService
    private final CustomUserDetailsService customUserDetailsService;
//    @Autowired
//    KhachHangService khachHangService;
    @PostMapping("/dang-nhap")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtTokenProvider.generateToken(authentication);

            NguoiDung nguoiDung = customUserDetailsService.getNguoiDungByEmail(request.getEmail());
            if (nguoiDung == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            LoginRespon jwtAuthResponse = new LoginRespon();
            jwtAuthResponse.setAccessToken(token);
            jwtAuthResponse.setEmail(nguoiDung.getEmail());
            jwtAuthResponse.setMa(nguoiDung.getMa());
            jwtAuthResponse.setChucVu(nguoiDung.getChucVu());
            jwtAuthResponse.setTen(nguoiDung.getTen());
            jwtAuthResponse.setAnh(nguoiDung.getAnh());
            jwtAuthResponse.setUserID(nguoiDung.getId());

            return ResponseEntity.ok(jwtAuthResponse);

        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
//    @PostMapping("/dang-ky")
//    public ResponseEntity<?> signUP(@RequestParam("request") String requestJson) {
//        Gson gson = new Gson();
//        NguoiDungRequest requestDto = gson.fromJson(requestJson, NguoiDungRequest.class);
//        return ResponseEntity.ok(khachHangService.add(requestDto));
//    }
//    @PostMapping("/quen-mat-khau")
//    public ResponseEntity<?> forgotPass(@RequestBody DangKyRequest dangKyRequest) {
//        return ResponseEntity.ok(khachHangService.QuenMatKhau(dangKyRequest));
//    }
//    @GetMapping("/get-all")
//    public ResponseEntity<?> getAll() {
//        return ResponseEntity.ok(khachHangService.getAll());
//    }
}
