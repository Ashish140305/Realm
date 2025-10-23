package com.realm.authservice.repository;

import com.realm.authservice.model.FileNode;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FileNodeRepository extends JpaRepository<FileNode, Long> {
    List<FileNode> findByParentId(Long parentId);

    List<FileNode> findByParentIsNull();
}