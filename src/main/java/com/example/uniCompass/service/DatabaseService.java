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
    private Resource sqlScriptForUniversities;

    @Value("classpath:program_desired_traits_table.sql")
    private Resource sqlScriptForProgramTraits;

    public DatabaseService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void executeSeedScript() {
        try {
            Reader reader = new InputStreamReader(sqlScriptForProgramTraits.getInputStream(), StandardCharsets.UTF_8);
            String sql = FileCopyUtils.copyToString(reader);

            Reader reader1 = new InputStreamReader(sqlScriptForUniversities.getInputStream(), StandardCharsets.UTF_8);
            String sql1 = FileCopyUtils.copyToString(reader1);

            jdbcTemplate.execute(sql);
            jdbcTemplate.execute(sql1);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }
}