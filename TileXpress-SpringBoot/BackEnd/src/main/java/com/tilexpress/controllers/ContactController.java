package com.tilexpress.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tilexpress.model.ContactForm;
import com.tilexpress.services.ContactService;


@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping("/submit")
    public ResponseEntity<ContactForm> submitForm(@RequestBody ContactForm contactForm) {
        ContactForm savedContact = contactService.saveContact(contactForm);
        return ResponseEntity.ok(savedContact);
    }
}

