package com.tilexpress.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.tilexpress.model.ContactForm;

public interface ContactRepository extends JpaRepository<ContactForm, Long> {
}
