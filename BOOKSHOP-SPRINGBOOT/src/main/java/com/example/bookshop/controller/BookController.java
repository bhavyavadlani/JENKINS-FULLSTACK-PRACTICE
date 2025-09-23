package com.example.bookshop.controller;

import com.example.bookshop.model.Book;
import com.example.bookshop.repository.BookRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*") // allow frontend to call API
public class BookController {

    private final BookRepository repo;

    public BookController(BookRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Book> getAll() {
        return repo.findAll();
    }
    @GetMapping("/{id}")
public Book getOne(@PathVariable Long id) {
    return repo.findById(id).orElse(null);
}

    @PostMapping
    public Book create(@RequestBody Book book) {
        return repo.save(book);
    }

    @PutMapping("/{id}")
    public Book update(@PathVariable Long id, @RequestBody Book book) {
        book.setId(id);
        return repo.save(book);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
