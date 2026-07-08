CREATE TABLE IF NOT EXISTS program_desired_traits (
    program_id BIGINT NOT NULL,
    trait VARCHAR(255),
    CONSTRAINT fk_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);