DO $$
DECLARE
    uni_id BIGINT;
    prog_id BIGINT;
    i INT;
    j INT;

    countries TEXT[] := ARRAY['USA', 'USA', 'Canada', 'Mexico', 'Canada', 'USA', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'UK', 'France', 'Germany', 'Spain', 'Italy', 'Sweden', 'Georgia', 'Japan', 'South Korea', 'China', 'India', 'Singapore', 'UAE', 'Egypt', 'South Africa', 'Nigeria', 'Kenya', 'Australia', 'Australia', 'New Zealand'];
    cities TEXT[] := ARRAY['New York', 'Los Angeles', 'Toronto', 'Mexico City', 'Vancouver', 'Boston', 'Sao Paulo', 'Buenos Aires', 'Bogota', 'Santiago', 'London', 'Paris', 'Berlin', 'Madrid', 'Rome', 'Stockholm', 'Tbilisi', 'Tokyo', 'Seoul', 'Beijing', 'Mumbai', 'Singapore', 'Dubai', 'Cairo', 'Cape Town', 'Lagos', 'Nairobi', 'Sydney', 'Melbourne', 'Auckland'];
    base_lats NUMERIC[] := ARRAY[40.71, 34.05, 43.65, 19.43, 49.28, 42.36, -23.55, -34.60, 4.71, -33.44, 51.50, 48.85, 52.52, 40.41, 41.90, 59.32, 41.71, 35.67, 37.56, 39.90, 19.07, 1.35, 25.20, 30.04, -33.92, 6.52, -1.29, -33.86, -37.81, -36.84];
    base_lngs NUMERIC[] := ARRAY[-74.00, -118.24, -79.38, -99.13, -123.12, -71.05, -46.63, -58.38, -74.07, -70.65, -0.12, 2.35, 13.40, -3.70, 12.49, 18.06, 44.82, 139.65, 126.97, 116.40, 72.87, 103.81, 55.27, 31.23, 18.42, 3.37, 36.82, 151.20, 144.96, 174.76];

    uni_prefixes TEXT[] := ARRAY['Global', 'Tech', 'Central', 'Northern', 'Southern', 'Atlantic', 'Pacific', 'Summit', 'Pioneer', 'Horizon', 'Royal', 'State'];
    uni_suffixes TEXT[] := ARRAY['University', 'Institute of Technology', 'College', 'Academy', 'Polytechnic'];

    prog_names TEXT[] := ARRAY['BSc Computer Science', 'BSc Mechanical Engineering', 'BA Business Administration', 'BSc Data Science', 'BA Psychology', 'BSc Nursing', 'BA Economics', 'BSc Biology', 'BA English Literature', 'BSc Artificial Intelligence'];
    pois TEXT[] := ARRAY['Computing', 'Engineering', 'Business', 'Data', 'Social Sciences', 'Medicine', 'Economics', 'Science', 'Humanities', 'AI'];

    trait_list TEXT[] := ARRAY['Leadership', 'Coding', 'Research', 'Communication', 'Teamwork', 'Analytical Thinking', 'Creativity', 'Problem Solving', 'Public Speaking', 'Innovation', 'Critical Thinking', 'Adaptability', 'Debate', 'Logic'];

    loc_idx INT;
    gen_uni_name TEXT;
    gen_lat NUMERIC;
    gen_lng NUMERIC;
    rand_prog_idx INT;
BEGIN
    DELETE FROM program_desired_traits;
    DELETE FROM programs;
    DELETE FROM universities;

    SELECT COALESCE(MAX(id), 0) INTO uni_id FROM universities;
    SELECT COALESCE(MAX(id), 0) INTO prog_id FROM programs;

    FOR i IN 1..100 LOOP
        uni_id := uni_id + 1;

        loc_idx := 1 + floor(random() * 30);

        gen_uni_name := uni_prefixes[1 + floor(random() * array_length(uni_prefixes, 1))] || ' ' || uni_suffixes[1 + floor(random() * array_length(uni_suffixes, 1))];

        gen_lat := base_lats[loc_idx] + (random() * 0.4 - 0.2);
        gen_lng := base_lngs[loc_idx] + (random() * 0.4 - 0.2);

        INSERT INTO universities (id, name, country, city, latitude, longitude, description, world_ranking, cover_image_url, website_url)
        VALUES (
            uni_id,
            gen_uni_name,
            countries[loc_idx],
            cities[loc_idx],
            ROUND(gen_lat::NUMERIC, 6),
            ROUND(gen_lng::NUMERIC, 6),
            'A prestigious institution located in ' || cities[loc_idx] || ', ' || countries[loc_idx] || ' dedicated to pioneering research and academic excellence.',
            floor(random() * 1000) + 1,
            'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&q=80',
            'https://www.' || lower(replace(gen_uni_name, ' ', '')) || '.edu'
        );

        FOR j IN 1..3 LOOP
            prog_id := prog_id + 1;
            rand_prog_idx := 1 + floor(random() * array_length(prog_names, 1));

            INSERT INTO programs (id, university_id, name, point_of_interest, target_gpa, target_sat, min_toefl, min_ielts, yearly_tuition)
            VALUES (
                prog_id,
                uni_id,
                prog_names[rand_prog_idx],
                pois[rand_prog_idx],
                ROUND((random() * 1.5 + 2.5)::NUMERIC, 2),
                ((random() * 60 + 100)::INT) * 10,
                (random() * 40 + 80)::INT,
                ROUND((random() * 6 + 11)::NUMERIC) / 2.0,
                ((random() * 45 + 5)::INT) * 1000
            );

            INSERT INTO program_desired_traits (program_id, trait)
            SELECT prog_id, t
            FROM unnest(trait_list) AS t
            ORDER BY random()
            LIMIT 3;

        END LOOP;
    END LOOP;

    PERFORM setval('universities_id_seq', (SELECT COALESCE(MAX(id), 1) FROM universities));
    PERFORM setval('programs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM programs));

END $$;