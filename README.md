# UniCompass

UniCompass is a modern, full-stack educational technology platform designed to democratize elite university counseling. It serves as an intelligent admissions assistant, transforming traditional, static university search engines into an interactive, personalized discovery experience.

The application securely maps user academic credentials, financial boundaries, and soft skills against institutional parameters using a deterministic weighted scoring algorithm to deliver real-time admission probability scores and automated gap analysis.

## 🚀 Key Features

* **Global Opportunity Explorer (Interactive Map):** A full-screen geolocation engine built on Leaflet.js using a responsive, modern tile theme. Features tailored, non-cluttering markers highlighting global institutional hubs with a smooth slide-out profile interface.
* **Intelligent Personalized Matching:** A deterministic, server-side weighted matching engine that cross-references academic metrics, logistical limits, and point-of-interest indicators without relying on unpredictable AI models.
* **Automated Gap Analysis:** Instantly processes individual student baselines against program criteria to emit actionable steps—highlighting test preparation targets, specific curriculum additions, or soft-skill keywords needed to increase admissions viability.
* **Sleek Multi-Step Registration:** A conversion-optimized onboarding flow featuring live input icon mapping, responsive custom input sliders, and secure, native email OTP code verification.
* **Comprehensive Profile Dashboard:** A clean, modular control center dividing user parameters into unified sections—Academics (with embedded validation ceilings for SAT, ACT, GPA, and language proficiencies), Target Preferences, Extracurricular tracking, and an itemized application checklist.
* **State-Driven Reset Security:** An end-to-end multi-view login ecosystem incorporating seamless custom forgotten-password steps and integrated verification flows.

## 🛠️ Tech Stack

### Frontend
* **Core Architecture:** Semantic HTML5 & Vanilla JavaScript (ES6+)
* **Styling:** Clean CSS3 utilizing strict separation of concerns (decoupled architecture without inline or embedded utility classes)
* **Mapping Engine:** Leaflet.js utilizing CartoDB Voyager geospatial layouts
* **Iconography:** Lucide Icons Vector Architecture

### Backend & Security
* **Framework:** Spring Boot (Java)
* **Security:** JSON Web Tokens (JWT) for secure, stateless request authentication
* **Mailing System:** JavaMailSender abstraction integrated with secure app-password authentication protocols

### Database
* **Engine:** PostgreSQL
* **ORM:** Spring Data JPA / Hibernate
* **Data Layout:** Fully normalized schemas optimized with PostgreSQL native array types (`TEXT[]`) for memory-efficient multi-value management (Skills, Language levels, and Extracurricular tracking).

## 🗄️ Database Schema Design

The persistence layer separates credentials from operational profiles using optimized spatial and list variables:

* **Authentication & Profiles:** Decoupled `users` and `user_profiles` relational mapping containing structural numeric score limits alongside geographical text criteria.
* **Language Mapping:** A normalized `user_languages` entity handling precise name-to-proficiency relational integrity.
* **Institutional Mapping:** A dual-table configuration splitting macro metadata (`universities` including floating-point latitude and longitude variables) from distinct target metrics (`programs` managing target testing thresholds and keyword arrays).

## 🔧 Installation & Setup

*(Add specific steps here once your environment paths are configured)*

1. Clone the repository: `git clone https://github.com/yourusername/unicompass.git`
2. Configure your PostgreSQL database credentials in `src/main/resources/application.properties`.
3. Set your secure email credentials and Application Passwords for the notification service layer.
4. Run the Spring Boot application.
