package com.example.uniCompass.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
public class DatabaseService {
    private final JdbcTemplate jdbcTemplate;

    @Value("classpath:random_generator.sql")
    private Resource sqlScript;

    public DatabaseService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void executeSeedScript() {
        try {
            Reader reader = new InputStreamReader(sqlScript.getInputStream(), StandardCharsets.UTF_8);
            String sql = FileCopyUtils.copyToString(reader);

            jdbcTemplate.execute(sql);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}