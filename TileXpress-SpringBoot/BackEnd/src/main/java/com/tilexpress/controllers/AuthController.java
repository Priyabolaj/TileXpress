package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tilexpress.config.JwtProvider;
import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Cart;
import com.tilexpress.model.User;
import com.tilexpress.repositories.UserRepository;
import com.tilexpress.requests.LoginRequest;
import com.tilexpress.responses.AuthResponse;
import com.tilexpress.services.CartService;
import com.tilexpress.services.CustomUserServiceImplementation;
import com.tilexpress.services.EmailService;

import java.time.LocalDateTime;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private UserRepository userRepository;
    private JwtProvider jwtProvider;
    private PasswordEncoder passwordEncoder;
    private CustomUserServiceImplementation customUserService;
    private CartService cartService;
    private EmailService emailService;
    public AuthController() {
    }

    @Autowired
    public AuthController(UserRepository userRepository, JwtProvider jwtProvider, PasswordEncoder passwordEncoder, CustomUserServiceImplementation customUserService, CartService cartService,EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
        this.customUserService = customUserService;
        this.cartService = cartService;
        this.emailService = emailService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws UserException {
        String email = user.getEmail();
        String password = user.getPassword();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String mobile = user.getMobile();
        String gender = user.getGender();

        System.out.println(user.toString());
        User isEmailExist = userRepository.findByEmail(email);
        System.out.println(user.toString());
        if (isEmailExist != null) {
            throw new UserException("Email already exist for another user");
        }
        System.out.println(user.toString());
        User createUser = new User();
        createUser.setEmail(user.getEmail());
        createUser.setPassword(passwordEncoder.encode(password));
        createUser.setFirstName(firstName);
        createUser.setLastName(lastName);
        createUser.setMobile(mobile);
        createUser.setGender(gender);
        createUser.setCreatedAt(LocalDateTime.now());
        createUser.setRole("USER");

        User savedUser = userRepository.save(createUser);

        Cart cart = cartService.CreateCart(savedUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(savedUser.getEmail(),savedUser.getPassword());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();

        authResponse.setJwt(token);

        authResponse.setMessage("Signup Successfully");
        String fullName = user.getFirstName() + " "+ user.getLastName();
        emailService.registrationEmail(email);
        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginUserHandler(@RequestBody LoginRequest loginRequest) throws UserException{

        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = Authentication(email,password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("SignIn Successfull");

        return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.CREATED);
    }
    private Authentication Authentication(String email, String password) {
        UserDetails userDetails = customUserService.loadUserByUsername(email);

        if (userDetails==null) {
            throw new BadCredentialsException("Invalid Email");
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new BadCredentialsException("Invalid Password");
        }
        System.out.println("Authorities:"+userDetails.getAuthorities());
        return new UsernamePasswordAuthenticationToken(email, null,userDetails.getAuthorities());
    }
}
