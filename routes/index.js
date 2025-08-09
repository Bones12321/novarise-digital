const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Product = require('../models/Product'); // Make sure this exists for marketplace products
const User = require('../models/User'); // Import User model for updating roles

// Middleware to check if user is logged in
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to access that page');
  res.redirect('/login');
}

// Configure your SMTP transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,       // e.g. smtp.gmail.com
  port: parseInt(process.env.EMAIL_PORT, 10), // 465 or 587
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for others
  auth: {
    user: process.env.EMAIL_USER,    // your SMTP email from .env
    pass: process.env.EMAIL_PASS,    // your SMTP password or app password
  },
});

// Route for home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Beyond 9 to 5' });
});

// Route for Section 1 page (Guide to Freedom)
router.get('/section1', (req, res) => {
  const products = [
    { title: 'Mind Mastery: Mental Strength Blueprint', price: 25.00, image: '/images/product1.jpg' },
    { title: 'Discipline Daily: Focus & Growth Planner', price: 19.00, image: '/images/product2.jpg' },
    { title: 'Resilience Reset: Bounce Back Formula', price: 15.00, image: '/images/product3.jpg' },
    { title: 'Beyond Limits: Mental Peak Workbook', price: 29.00, image: '/images/product4.jpg' },
    { title: 'Clarity Guide: Focus Techniques', price: 18.00, image: '' },
    { title: 'Calm Mind: Stress Reduction Plan', price: 22.00, image: '' },
    { title: 'Energy Boost: Daily Habits', price: 20.00, image: '' },
    { title: 'Success Journal: Daily Reflection', price: 17.00, image: '' },
    { title: 'Goal Getter: Achievement Tracker', price: 23.00, image: '' },
    { title: 'Positive Mindset: Affirmation Cards', price: 16.00, image: '' },
    { title: 'Focus Flow: Meditation Audio', price: 27.00, image: '' },
    { title: 'Motivation Manual: Power Habits', price: 21.00, image: '' },
    { title: 'Growth Mindset: Self-Coaching', price: 24.00, image: '' },
    { title: 'Zen Mode: Evening Routine Guide', price: 19.00, image: '' },
  ];

  res.render('section1', {
    title: 'Guide to Freedom',
    description: `At NovaRise, we believe digital products are the future of personal growth. Our guides, blueprints, and tools are designed to help you build discipline, mental resilience, and financial freedom — all accessible instantly from anywhere in the world. By selling digital products, we remove barriers and empower you to take action at your own pace. Every product we offer is crafted with purpose, clarity, and real-life application. Our mission is to help you unlock your full potential, one digital guide at a time.`,
    quote: `"Discipline is the bridge between goals and freedom." – NovaRise`,
    backgroundImage: '/images/hero-bg.jpg',
    products,
  });
});

// Route for Section 2 page (Mind Mastery)
router.get('/section2', (req, res) => {
  const products = [
    { title: 'Focus Flow: Concentration Booster', price: 20.00, image: '/images/product1.jpg' },
    { title: 'Resilience Builder: Mental Toughness Course', price: 35.00, image: '/images/product2.jpg' },
    { title: 'Daily Discipline Tracker', price: 15.00, image: '/images/product3.jpg' },
    { title: 'Mind Reset: Stress Relief Techniques', price: 18.00, image: '/images/product4.jpg' },
    { title: 'Emotional Intelligence 101', price: 25.00, image: '/images/product5.jpg' },
    { title: 'Cognitive Restructuring Guide', price: 22.00, image: '/images/product6.jpg' },
    { title: 'Meditation for Mental Clarity', price: 19.00, image: '/images/product7.jpg' },
    { title: 'Confidence Booster Blueprint', price: 27.00, image: '/images/product8.jpg' },
    { title: 'Stress Management Protocols', price: 21.00, image: '/images/product9.jpg' },
    { title: 'Personal Growth Journal', price: 14.00, image: '/images/product10.jpg' },
    { title: 'Mental Health Tracker App', price: 30.00, image: '/images/product11.jpg' },
    { title: 'Neuroplasticity Training', price: 40.00, image: '/images/product12.jpg' },
    { title: 'Sleep Optimization Course', price: 16.00, image: '/images/product13.jpg' },
    { title: 'Mind Mastery Video Series', price: 38.00, image: '/images/product14.jpg' },
    { title: 'Anxiety Relief Toolkit', price: 28.00, image: '/images/product15.jpg' },
  ];

  res.render('section2', {
    title: 'Mind Mastery',
    description: `Unlock your mind’s full potential with our science-backed digital training systems. We provide immersive courses and tools designed to build mental toughness, emotional intelligence, and stress resilience. Whether you’re looking to manage anxiety, boost confidence, or enhance focus, our programs empower you to take control of your mental health. Dive into cognitive restructuring, daily discipline challenges, and growth tracking to transform your mindset. Your mental strength journey begins here.`,
    quote: `"Strength grows in the moments when you think you can't go on but you keep going anyway." – NovaRise`,
    backgroundImage: '/images/mind-mastery-bg.jpg',
    products,
  });
});

// Route for Section 3 page (Physical Health)
router.get('/section3', (req, res) => {
  const products = [
    { title: 'Science-Based Strength Training Program', price: 45.00, image: '/images/product1.jpg' },
    { title: 'Nutrition Optimization Guide', price: 30.00, image: '/images/product2.jpg' },
    { title: 'Recovery & Sleep Protocol', price: 25.00, image: '/images/product3.jpg' },
    { title: 'Metabolic Health Blueprint', price: 28.00, image: '/images/product4.jpg' },
    { title: 'Functional Fitness Course', price: 35.00, image: '/images/product5.jpg' },
    { title: 'Cardio Performance Plan', price: 22.00, image: '/images/product6.jpg' },
    { title: 'Flexibility & Mobility Training', price: 20.00, image: '/images/product7.jpg' },
    { title: 'Medical Health Insights', price: 40.00, image: '/images/product8.jpg' },
    { title: 'Sleep Science Essentials', price: 24.00, image: '/images/product9.jpg' },
    { title: 'Digital Fitness Tracker', price: 32.00, image: '/images/product10.jpg' },
    { title: 'Wellness & Stress Management', price: 26.00, image: '/images/product11.jpg' },
    { title: 'Personalized Nutrition Plan', price: 38.00, image: '/images/product12.jpg' },
    { title: 'Holistic Health Coaching', price: 29.00, image: '/images/product13.jpg' },
    { title: 'Performance Recovery Techniques', price: 34.00, image: '/images/product14.jpg' },
    { title: 'Science-Backed Exercise Guide', price: 31.00, image: '/images/product15.jpg' },
  ];

  res.render('section3', {
    title: 'Physical Health',
    description: `Experience the power of science-backed wellness to transform your physical health and performance. Our curated digital products offer evidence-based training programs, nutrition protocols, and recovery systems developed by top health professionals. Simplify complex medical science into practical strategies for your body. Whether you want to build strength, optimize metabolism, or improve recovery, our guides provide expert insights for lasting results. Commit to your health journey today with digital tools designed for success.`,
    quote: `"Physical health is the foundation upon which all success is built." – NovaRise`,
    backgroundImage: '/images/wellness-bg.jpg',
    products,
  });
});

// Route for Section 4 page (Personal Recommendations)
router.get('/section4', (req, res) => {
  res.render('section4', {
    title: 'Personal Recommendations',
    description: `Discover a personally curated collection of tools and physical products that have elevated my life, health, and productivity. These items aren’t just things — they’re carefully selected instruments of transformation. Each recommendation reflects years of trial, testing, and tangible results. From workspace optimization to wellness tech, every product plays a key role in helping you unlock peak performance. Get ready for a handpicked lineup of what truly works.`,
    quote: `"Only recommend what you’ve tested, trusted, and transformed with." – NovaRise`,
    backgroundImage: '/images/personal-recommendations-bg.jpg',
  });
});

// Route for Section 5 page (Affiliate & Seller Hub)
router.get('/section5', (req, res) => {
  res.render('section5', {
    title: 'Affiliate & Seller Hub',
    description: 'Explore how you can earn with us — either by promoting our products for a generous 35% commission or by selling your own products on our platform with a 90/10 revenue split.',
    backgroundImage: '/images/affiliate-bg.jpg'
  });
});

// *** New Partner Signup Routes ***

// GET partner signup page - only if logged in
router.get('/partner-signup', ensureAuthenticated, (req, res) => {
  res.render('partner-signup', { title: 'Join as a Partner', user: req.user, errors: [], formData: {} });
});

// POST partner signup form - only if logged in
router.post('/partner-signup', ensureAuthenticated, async (req, res) => {
  try {
    const { username, terms, confirmSeller } = req.body;
    let errors = [];

    if (!username || username.trim().length === 0) {
      errors.push({ msg: 'Username is required' });
    }
    if (!terms) {
      errors.push({ msg: 'You must accept the Terms and Conditions' });
    }
    if (!confirmSeller) {
      errors.push({ msg: 'You must confirm to become a Seller and Affiliate Partner' });
    }

    if (errors.length > 0) {
      return res.render('partner-signup', { title: 'Join as a Partner', user: req.user, errors, formData: req.body });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      req.flash('error_msg', 'User not found');
      return res.redirect('/login');
    }

    // Update username and role
    user.username = username.trim();
    user.role = 'seller';

    await user.save();

    // refresh session user so role change is effective immediately
    if (typeof req.login === 'function') {
      req.login(user, (loginErr) => {
        if (loginErr) {
          console.error('Error refreshing login after partner signup:', loginErr);
          req.flash('success_msg', 'You are now a Partner! Please log out and log back in to access the seller dashboard.');
          return res.redirect('/login');
        }
        req.flash('success_msg', 'You are now a Partner! Access your seller dashboard below.');
        return res.redirect('/seller-dashboard');
      });
    } else {
      // fallback: update req.user object and redirect
      req.user.username = user.username;
      req.user.role = user.role;
      req.flash('success_msg', 'You are now a Partner! Access your seller dashboard below.');
      return res.redirect('/seller-dashboard');
    }
  } catch (err) {
    console.error(err);
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/partner-signup');
  }
});

// --- SELLER DASHBOARD ROUTE (added) ---
router.get('/seller-dashboard', ensureAuthenticated, (req, res) => {
  // ensure only sellers access this page
  if (!req.user || req.user.role !== 'seller') {
    req.flash('error_msg', 'You must be a seller to access the Seller Dashboard.');
    return res.redirect('/');
  }

  res.render('seller-dashboard', {
    title: 'Seller Dashboard',
    user: req.user,
    backgroundImage: '/images/seller-dashboard-bg.jpg', // optional - change or remove if not needed
  });
});
// --- end seller dashboard ---

// GET login page
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    backgroundImage: '/images/login-bg.jpg',
  });
});

// Route for Section 6 page (Our Story)
router.get('/section6', (req, res) => {
  res.render('section6', {
    title: 'Our Story',
    backgroundImage: '/images/logo.png',
  });
});

// Route for Marketplace page (Section 7)
router.get('/marketplace', async (req, res) => {
  try {
    // Fetch products from your DB model for marketplace
    const products = await Product.find({});

    res.render('section7', {
      title: 'Marketplace',
      description: `Explore the NovaRise marketplace — your curated space to discover digital products that empower your personal and professional growth. From productivity tools to mindset guides, our sellers offer quality resources crafted to help you unlock your full potential.`,
      quote: `"Empower yourself with digital tools designed for success." – NovaRise`,
      backgroundImage: '/images/logo.png',
      products,
      user: req.user,
      cart: req.session.cart || []
    });
  } catch (error) {
    console.error('Error loading marketplace:', error);
    res.status(500).send('Failed to load marketplace');
  }
});

// Route for Terms and Conditions page
router.get('/terms', (req, res) => {
  res.render('terms', {
    title: 'Terms and Conditions',
    backgroundImage: '/images/logo.png',
  });
});

// Contact page GET
router.get('/contact', (req, res) => {
  res.render('contact', {
    title: 'Contact Us',
    backgroundImage: '/images/contact-bg.jpg',
    pageClass: 'contact-page'
  });
});

// Contact page POST - form submission
router.post('/contact', async (req, res) => {
  const { name, email, topic, message } = req.body;

  // Basic validation
  if (!name || !email || !topic || !message) {
    return res.render('contact', {
      title: 'Contact Us',
      backgroundImage: '/images/contact-bg.jpg',
      pageClass: 'contact-page',
      errorMessage: 'Please fill in all fields including the topic.',
      name,
      email,
      topic,
      message,
    });
  }

  // Simple email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.render('contact', {
      title: 'Contact Us',
      backgroundImage: '/images/contact-bg.jpg',
      pageClass: 'contact-page',
      errorMessage: 'Please enter a valid email address.',
      name,
      email,
      topic,
      message,
    });
  }

  // Prepare email to NovaRise team
  const teamMailOptions = {
    from: `"NovaRise Website Contact" <${transporter.options.auth.user}>`,
    to: 'novariseteam@gmail.com',
    subject: `New Contact Message: ${topic}`,
    html: `
      <h2>New Contact Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
    `,
  };

  // Prepare confirmation email to user
  const userMailOptions = {
    from: `"NovaRise Team" <${transporter.options.auth.user}>`,
    to: email,
    subject: 'Thank you for contacting NovaRise!',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for reaching out to NovaRise regarding <strong>${topic}</strong>.</p>
      <p>We have received your message and will respond as soon as possible.</p>
      <p>In the meantime, feel free to explore our site or reach out again.</p>
      <p>Best regards,<br/>The NovaRise Team</p>
    `,
  };

  try {
    await transporter.sendMail(teamMailOptions);
    await transporter.sendMail(userMailOptions);

    res.render('contact', {
      title: 'Contact Us',
      backgroundImage: '/images/contact-bg.jpg',
      pageClass: 'contact-page',
      successMessage: 'Your message has been sent! We will get back to you shortly.',
      name: '',
      email: '',
      topic: '',
      message: '',
    });
  } catch (error) {
    console.error('Error sending contact emails:', error);
    res.render('contact', {
      title: 'Contact Us',
      backgroundImage: '/images/contact-bg.jpg',
      pageClass: 'contact-page',
      errorMessage: 'Sorry, something went wrong while sending your message. Please try again later.',
      name,
      email,
      topic,
      message,
    });
  }
});

// FAQ page GET
router.get('/faq', (req, res) => {
  res.render('faq', {
    title: 'Frequently Asked Questions',
    backgroundImage: '/images/faq-bg.jpg',
    pageClass: 'faq-page'
  });
});

// About page GET
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Us',
    backgroundImage: '/images/about-bg.jpg', // choose a suitable background or leave blank
    pageClass: 'about-page'
  });
});

module.exports = router;
