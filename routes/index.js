const express = require('express');
const router = express.Router();

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

module.exports = router;
