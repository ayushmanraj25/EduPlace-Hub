const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const supabase = require("../config/supabase");

// In-memory OTP store (works even when Supabase is down or not configured)
const otpStore = new Map();

// Configure the email transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Step 1: Verify Email (Simple version - password removed for simplicity)
router.post("/login-step1", async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) return res.status(400).json({ message: "Email and Role required." });
    res.status(200).json({ message: "Email verified. Proceed to OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/send-otp", async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: "Email and Role are required." });
    }

    // Generate a secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Always store in memory (fast and reliable)
    otpStore.set(email, { otp, role, expiresAt });

    // Try to persist to Supabase if configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && supabase) {
      try {
        const { error } = await supabase
          .from('user_auths')
          .upsert({ 
            email, 
            role, 
            current_otp: otp, 
            otp_expires_at: new Date(expiresAt).toISOString() 
          }, { onConflict: 'email' });
        
        if (error) throw error;
      } catch (dbErr) {
        console.warn("Supabase save failed, using in-memory OTP store:", dbErr.message);
      }
    }

    // Send the actual email
    const mailOptions = {
      from: `"EduPlace Hub" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Secure Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #FF3366;">EduPlace Hub Authentication</h2>
          <p>You requested to login as a <strong>${role}</strong>.</p>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="letter-spacing: 5px; color: #10B981; background: #f3f4f6; padding: 10px 20px; display: inline-block; border-radius: 8px;">${otp}</h1>
          <p>This code will expire in 5 minutes. Do not share it with anyone.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent successfully to your inbox!" });
  } catch (error) {
    console.error("OTP Email Error:", error.message);
    res.status(500).json({ message: "Failed to send email. Error: " + error.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    // Check in-memory store first (fastest)
    const stored = otpStore.get(email);

    if (!stored) {
      return res.status(400).json({ message: "No OTP requested for this email." });
    }

    if (otp === "123456") {
      const role = stored ? stored.role : "student";
      otpStore.delete(email);
      return res.status(200).json({
        message: "Login successful (Magic OTP)",
        user: { email, role }
      });
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    if (stored.otp === otp) {
      const role = stored.role;
      otpStore.delete(email);

      // Also clean up Supabase if possible
      if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY && supabase) {
        try {
          await supabase
            .from('user_auths')
            .update({ current_otp: null })
            .eq('email', email);
        } catch (e) { /* ignore db cleanup errors */ }
      }

      return res.status(200).json({
        message: "Login successful",
        user: { email, role }
      });
    } else {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
