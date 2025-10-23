package com.realm.authservice.controller;

import com.realm.authservice.model.FileNode;
import com.realm.authservice.repository.FileNodeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileNodeRepository fileNodeRepository;

    @GetMapping
    public List<FileNode> getFiles(@RequestParam(required = false) Long parentId) {
        if (parentId == null) {
            return fileNodeRepository.findByParentIsNull();
        }
        return fileNodeRepository.findByParentId(parentId);
    }

    @PostMapping
    public FileNode createFile(@RequestBody FileNode fileNode) {
        return fileNodeRepository.save(fileNode);
    }
}