package com.example.uniCompass.service;

import com.example.uniCompass.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private final UserRepository userRepository;

    public EmailService(JavaMailSender mailSender, UserRepository userRepository) {
        this.mailSender = mailSender;
        this.userRepository = userRepository;
    }

    public void sendVerificationCode(String recipientEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("unicompass.team@gmail.com");
            helper.setTo(recipientEmail);
            helper.setSubject("Your UniCompass Verification Code");

            String htmlContent = getHtmlContent(otpCode);
            helper.setText(htmlContent, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to build HTML email: " + e.getMessage());
        }
    }

    public boolean userExists(String email) {
        return userRepository.existsByEmail(email);
    }

    private String getHtmlContent(String otpCode) {
        return """
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center; padding: 40px 20px; color: #333; background-color: #f9fafb;">
                        <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                            <h2 style="color: #0f172a; margin-top: 0;">Welcome to UniCompass!</h2>
                            <p style="font-size: 16px; color: #475569; line-height: 1.5;">
                                You are almost ready to start exploring global opportunities. Here is your password reset code:
                            </p>
                           \s
                            <div style="margin: 30px auto; padding: 20px; background-color: #f1f5f9; border-radius: 8px; border: 1px solid #e2e8f0; width: fit-content;">
                                <h1 style="font-size: 42px; margin: 0; letter-spacing: 8px; color: #2563eb;">%s</h1>
                            </div>
                           \s
                            <p style="font-size: 14px; color: #64748b; margin-bottom: 0;">
                                This code will expire in 10 minutes.<br>
                                If you didn't request this, you can safely ignore this email.
                            </p>
                        </div>
                    </div>
                   \s""".formatted(otpCode);
    }
}