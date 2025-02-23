package com.tilexpress.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.tilexpress.model.ContactForm;
import com.tilexpress.repositories.ContactRepository;

@Service
public class ContactServiceImplementation implements ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public ContactForm saveContact(ContactForm contactForm) {
        ContactForm savedContact = contactRepository.save(contactForm);
        sendEmail(contactForm.getEmail(), contactForm.getMessage());
        return savedContact;
    }

    private void sendEmail(String fromEmail, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo("admin@tilexpress.com");
        mailMessage.setSubject("New Contact Form Submission");
        mailMessage.setText("Sender Email: " + fromEmail + "\nMessage: " + message);
        mailSender.send(mailMessage);
    }
}
