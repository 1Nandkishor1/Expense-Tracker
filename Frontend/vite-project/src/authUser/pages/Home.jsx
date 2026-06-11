import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Home = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (!loading && user) {
      navigate('/groups');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // 1. Initialize Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // 2. Navbar Show/Hide on Scroll
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar-home');
    
    const handleScroll = () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (navbar) {
        if (scrollTop > lastScrollTop && scrollTop > 80) {
          navbar.classList.add('navbar-home--hidden');
        } else {
          navbar.classList.remove('navbar-home--hidden');
        }
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener('scroll', handleScroll);

    // 3. Stats Counter Animation using Intersection Observer
    const statCounters = document.querySelectorAll('.stat-home-counter');
    
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'));
          if (isNaN(target)) return;
          
          const duration = 2000;
          const prefix = el.getAttribute('data-prefix') || '';
          const suffix = el.getAttribute('data-suffix') || '';
          const format = el.getAttribute('data-format');
          let startTime = null;

          function animate(currentTime) {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const currentVal = Math.floor(progress * target);
            
            let displayVal = currentVal;
            if (format === 'comma') {
              displayVal = currentVal.toLocaleString();
            }
            
            el.innerText = prefix + displayVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              let finalVal = target;
              if (format === 'comma') {
                finalVal = target.toLocaleString();
              }
              el.innerText = prefix + finalVal + suffix;
            }
          }
          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statCounters.forEach(counter => statsObserver.observe(counter));

    // 4. Reveal elements on scroll using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal-home');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Green Glow feature cards hover effect mouse tracking
    const featureCards = document.querySelectorAll('.feature-home-card');
    const handleCardMouseMove = (card) => (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--x', `${x}px`);
      card.style.setProperty('--y', `${y}px`);
    };

    const listeners = [];
    featureCards.forEach(card => {
      const listener = handleCardMouseMove(card);
      card.addEventListener('mousemove', listener);
      listeners.push({ card, listener });
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      statCounters.forEach(counter => statsObserver.unobserve(counter));
      revealElements.forEach(el => revealObserver.unobserve(el));
      listeners.forEach(({ card, listener }) => card.removeEventListener('mousemove', listener));
    };
  }, []);

  // Update Lucide Icons when Mobile Menu toggles
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
        <span className="spinner-text">Loading SplitEase...</span>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0F172A', minHeight: '100vh', width: '100%', position: 'relative', overflowX: 'hidden' }}>
      {/* Animated background blobs */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* NAVBAR */}
      <nav class="navbar-home" id="navbar-home">
        <div class="container">
          <a href="#" class="nav-home-logo">
            <i data-lucide="wallet"></i>
            <span>SplitEase</span>
          </a>
          
          <ul class="nav-home-links">
            <li class="nav-home-link"><a href="#features">Features</a></li>
            <li class="nav-home-link"><a href="#how-it-works">How It Works</a></li>
            <li class="nav-home-link"><a href="#testimonials">Testimonials</a></li>
          </ul>

          <div class="nav-home-cta">
            <Link to="/register" class="btn-home btn-home-primary">Get Started</Link>
          </div>

          <button class="nav-home-toggle" onClick={toggleMobileMenu} aria-label="Toggle Menu">
            <i data-lucide={isMobileMenuOpen ? "x" : "menu"}></i>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div class={`mobile-home-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <a href="#features" class="mobile-home-nav-link" onClick={toggleMobileMenu}>Features</a>
        <a href="#how-it-works" class="mobile-home-nav-link" onClick={toggleMobileMenu}>How It Works</a>
        <a href="#testimonials" class="mobile-home-nav-link" onClick={toggleMobileMenu}>Testimonials</a>
        <Link to="/register" class="btn-home btn-home-primary mobile-home-cta">Get Started</Link>
      </div>

      {/* HERO SECTION */}
      <header class="hero-home">
        <div class="container hero-home-grid">
          <div class="hero-home-content">
            <div class="hero-home-badge">
              <i data-lucide="sparkles"></i> Split bills seamlessly
            </div>
            <h1 class="hero-home-title">Split expenses, <span>not friendships</span></h1>
            <p class="hero-home-subtitle">The simple, beautiful way to track, split and settle group bills. Perfect for flatmates, trips, and shared adventures.</p>
            <div class="hero-home-actions">
              <Link to="/register" class="btn-home btn-home-primary">Start for Free</Link>
              <a href="#how-it-works" class="btn-home btn-home-secondary">See How it Works</a>
            </div>
          </div>
          <div class="hero-home-graphic">
            {/* Floating mock UI card */}
            <div class="hero-home-floating-card glass-card">
              <div class="fc-home-header">
                <span class="fc-home-title">Recent Activity</span>
                <span class="fc-home-badge">Live</span>
              </div>
              <div class="fc-home-list">
                <div class="fc-home-item">
                  <div class="fc-home-user-info">
                    <div class="avatar-home-circle avatar-home-c1">ZA</div>
                    <div class="fc-home-user-details">
                      <span class="fc-home-name">Zaheer</span>
                      <span class="fc-home-desc">Added "Villa Booking"</span>
                    </div>
                  </div>
                  <span class="fc-home-amount positive">+₹7,600</span>
                </div>
                <div class="fc-home-item">
                  <div class="fc-home-user-info">
                    <div class="avatar-home-circle avatar-home-c2">AM</div>
                    <div class="fc-home-user-details">
                      <span class="fc-home-name">Amit</span>
                      <span class="fc-home-desc">Added "Dinner"</span>
                    </div>
                  </div>
                  <span class="fc-home-amount negative">-₹400</span>
                </div>
                <div class="fc-home-item">
                  <div class="fc-home-user-info">
                    <div class="avatar-home-circle avatar-home-c3">SN</div>
                    <div class="fc-home-user-details">
                      <span class="fc-home-name">Sneha</span>
                      <span class="fc-home-desc">Settled with Zaheer</span>
                    </div>
                  </div>
                  <span class="fc-home-amount positive">Settle up</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <section class="stats-home-bar">
        <div class="container stats-home-grid">
          <div class="stat-home-item">
            <span class="stat-home-val stat-home-counter" data-target="10000" data-suffix="+" data-format="comma">0</span>
            <span class="stat-home-label">Groups Created</span>
          </div>
          <div class="stat-home-item">
            <span class="stat-home-val stat-home-counter" data-target="50" data-prefix="₹" data-suffix="L+" data-format="plain">0</span>
            <span class="stat-home-label">Expenses Tracked</span>
          </div>
          <div class="stat-home-item">
            <span class="stat-home-val">Zero</span>
            <span class="stat-home-label">Math Required</span>
          </div>
          <div class="stat-home-item">
            <span class="stat-home-val stat-home-counter" data-target="100" data-suffix="%" data-format="plain">0</span>
            <span class="stat-home-label">Free Forever</span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section class="features-home" id="features">
        <div class="container">
          <div class="section-home-header reveal-home">
            <span class="section-home-label-top">Superpowers</span>
            <h2 class="section-home-title-large">Everything you need to split fairly</h2>
            <p class="section-home-subtitle-large">No more spreadsheets, awkward reminders, or late-night calculations. We keep the tab clean so you can enjoy the moments.</p>
          </div>

          <div class="features-home-grid">
            {/* Feature 1 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="users"></i>
              </div>
              <h3 class="feature-home-title">Group Management</h3>
              <p class="feature-home-desc">Create custom groups for trips, flats, colleagues, or dinners and invite everyone with ease.</p>
            </div>

            {/* Feature 2 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="divide"></i>
              </div>
              <h3 class="feature-home-title">Smart Expense Splitting</h3>
              <p class="feature-home-desc">Split expenses equally, by percentages, shares, or exact amounts. Customise to fit your rules.</p>
            </div>

            {/* Feature 3 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="shuffle"></i>
              </div>
              <h3 class="feature-home-title">Debt Simplification</h3>
              <p class="feature-home-desc">Our intelligent algorithm minimizes the number of payments required between members to settle up.</p>
            </div>

            {/* Feature 4 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="check-circle"></i>
              </div>
              <h3 class="feature-home-title">Settlement Tracking</h3>
              <p class="feature-home-desc">Mark settlements with screenshot proof, and verify transactions to keep the record completely clean.</p>
            </div>

            {/* Feature 5 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="link"></i>
              </div>
              <h3 class="feature-home-title">Invite via Link</h3>
              <p class="feature-home-desc">No signup barriers. Invite friends instantly via a magic link or unique group QR code.</p>
            </div>

            {/* Feature 6 */}
            <div class="feature-home-card glass-card reveal-home">
              <div class="feature-home-icon">
                <i data-lucide="trending-up"></i>
              </div>
              <h3 class="feature-home-title">Real-time Balances</h3>
              <p class="feature-home-desc">Check who is up, who is down, and who owes what instantly with clean visual indicators.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section class="how-it-works-home" id="how-it-works">
        <div class="container">
          <div class="section-home-header reveal-home">
            <span class="section-home-label-top">Process</span>
            <h2 class="section-home-title-large">Up and running in 3 steps</h2>
            <p class="section-home-subtitle-large">Get started in seconds. No complicated setups or tutorials required.</p>
          </div>

          <div class="timeline-home-container">
            <div class="timeline-home-line"></div>
            <div class="timeline-home-grid">
              {/* Step 1 */}
              <div class="step-home-card reveal-home">
                <div class="step-home-number-bubble">
                  <span>01</span>
                  <div class="step-home-icon-badge">
                    <i data-lucide="user-plus"></i>
                  </div>
                </div>
                <h3 class="step-home-title">Create & Invite</h3>
                <p class="step-home-desc">Set up a group in a tap and share the unique invite link with your friends.</p>
              </div>

              {/* Step 2 */}
              <div class="step-home-card reveal-home">
                <div class="step-home-number-bubble">
                  <span>02</span>
                  <div class="step-home-icon-badge">
                    <i data-lucide="plus-circle"></i>
                  </div>
                </div>
                <h3 class="step-home-title">Log Expenses</h3>
                <p class="step-home-desc">Log bills as they happen, attach details, select payers, and assign splits.</p>
              </div>

              {/* Step 3 */}
              <div class="step-home-card reveal-home">
                <div class="step-home-number-bubble">
                  <span>03</span>
                  <div class="step-home-icon-badge">
                    <i data-lucide="banknote"></i>
                  </div>
                </div>
                <h3 class="step-home-title">Settle Debts</h3>
                <p class="step-home-desc">Follow split suggestions, make direct payments, and settle up with one click.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPENSE PREVIEW SECTION */}
      <section class="preview-home-section" id="preview">
        <div class="container">
          <div class="section-home-header reveal-home">
            <span class="section-home-label-top">Interface Preview</span>
            <h2 class="section-home-title-large">See your balances at a glance</h2>
            <p class="section-home-subtitle-large">A clean, focused dashboard showing you precisely what's important.</p>
          </div>

          {/* High fidelity mock app UI */}
          <div class="mockup-home-window glass-card reveal-home">
            <div class="window-home-header">
              <div class="window-home-dot red"></div>
              <div class="window-home-dot yellow"></div>
              <div class="window-home-dot green"></div>
              <div class="window-home-title">SplitEase App Preview • app.splitease.com</div>
            </div>
            <div class="mockup-home-content">
              {/* App Header */}
              <div class="app-home-header">
                <div class="app-home-title-group">
                  <div class="app-home-back-btn">
                    <i data-lucide="chevron-left"></i>
                  </div>
                  <div>
                    <h3>Goa Trip 🏖️</h3>
                    <span>4 members • Active</span>
                  </div>
                </div>
                <div class="app-home-actions">
                  <button class="app-home-btn-sec"><i data-lucide="link"></i> Invite</button>
                  <button class="app-home-btn-pri"><i data-lucide="plus"></i> Add Expense</button>
                </div>
              </div>

              {/* App body */}
              <div class="app-home-body">
                {/* Left: Expenses list */}
                <div class="app-home-left">
                  <h4 class="section-home-label">Recent Expenses</h4>
                  <div class="expense-home-list">
                    <div class="expense-home-item">
                      <div class="expense-home-icon-wrapper villa"><i data-lucide="home"></i></div>
                      <div class="expense-home-details">
                        <span class="expense-home-name">Villa Booking</span>
                        <span class="expense-home-meta">Paid by Zaheer • Split equally</span>
                      </div>
                      <div class="expense-home-amount-group">
                        <span class="expense-home-amount">₹12,000</span>
                        <span class="expense-home-date">June 8</span>
                      </div>
                    </div>
                    <div class="expense-home-item">
                      <div class="expense-home-icon-wrapper food"><i data-lucide="utensils"></i></div>
                      <div class="expense-home-details">
                        <span class="expense-home-name">Dinner at Britto's</span>
                        <span class="expense-home-meta">Paid by Amit • Split equally</span>
                      </div>
                      <div class="expense-home-amount-group">
                        <span class="expense-home-amount">₹4,000</span>
                        <span class="expense-home-date">June 9</span>
                      </div>
                    </div>
                    <div class="expense-home-item">
                      <div class="expense-home-icon-wrapper cab"><i data-lucide="car"></i></div>
                      <div class="expense-home-details">
                        <span class="expense-home-name">Cab to Beach</span>
                        <span class="expense-home-meta">Paid by Sneha • Split equally</span>
                      </div>
                      <div class="expense-home-amount-group">
                        <span class="expense-home-amount">₹1,600</span>
                        <span class="expense-home-date">June 10</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Balances grid */}
                <div class="app-home-right">
                  <h4 class="section-home-label">Group Balances</h4>
                  <div class="balances-home-grid">
                    <div class="balance-home-pill positive">
                      <div class="avatar-home-sm za">ZA</div>
                      <div class="balance-home-name-group">
                        <span class="balance-home-name">Zaheer (You)</span>
                        <span class="balance-home-desc">Gets back ₹7,600</span>
                      </div>
                    </div>
                    <div class="balance-home-pill negative">
                      <div class="avatar-home-sm am">AM</div>
                      <div class="balance-home-name-group">
                        <span class="balance-home-name">Amit</span>
                        <span class="balance-home-desc">Owes ₹400</span>
                      </div>
                    </div>
                    <div class="balance-home-pill negative">
                      <div class="avatar-home-sm sn">SN</div>
                      <div class="balance-home-name-group">
                        <span class="balance-home-name">Sneha</span>
                        <span class="balance-home-desc">Owes ₹2,800</span>
                      </div>
                    </div>
                    <div class="balance-home-pill negative">
                      <div class="avatar-home-sm kp">KP</div>
                      <div class="balance-home-name-group">
                        <span class="balance-home-name">Karan</span>
                        <span class="balance-home-desc">Owes ₹4,400</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggested Settlement */}
                  <h4 class="section-home-label settlement-home-title">Smart Suggestions</h4>
                  <div class="settlement-home-card">
                    <div class="settlement-home-header">
                      <i data-lucide="sparkles"></i>
                      <span>3 steps to zero balance</span>
                    </div>
                    <div class="settlement-home-item">
                      <span class="settle-home-desc"><strong>Karan</strong> owes <strong>Zaheer</strong></span>
                      <span class="settle-home-val">₹4,400</span>
                      <button class="settle-home-btn">Settle</button>
                    </div>
                    <div class="settlement-home-item">
                      <span class="settle-home-desc"><strong>Sneha</strong> owes <strong>Zaheer</strong></span>
                      <span class="settle-home-val">₹2,800</span>
                      <button class="settle-home-btn">Settle</button>
                    </div>
                    <div class="settlement-home-item">
                      <span class="settle-home-desc"><strong>Amit</strong> owes <strong>Zaheer</strong></span>
                      <span class="settle-home-val">₹400</span>
                      <button class="settle-home-btn">Settle</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section class="testimonials-home" id="testimonials">
        <div class="container">
          <div class="section-home-header reveal-home">
            <span class="section-home-label-top">Reviews</span>
            <h2 class="section-home-title-large">Loved by groups everywhere</h2>
            <p class="section-home-subtitle-large">Read what friends, flatmates, and travel buddies say about SplitEase.</p>
          </div>

          <div class="testimonials-home-grid">
            {/* Testimonial 1 */}
            <div class="testimonial-home-card glass-card reveal-home">
              <div class="t-home-stars">
                <i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i>
              </div>
              <p class="t-home-quote">"We used to argue about who paid for what in our flat. Now we log it here in 5 seconds and settle at the end of the month with a single tap. Life saver!"</p>
              <div class="t-home-user">
                <div class="t-home-avatar av1">RK</div>
                <div class="t-home-details">
                  <span class="t-home-name">Rohan & Kshitij</span>
                  <span class="t-home-desc">Flatmates in Mumbai</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div class="testimonial-home-card glass-card reveal-home">
              <div class="t-home-stars">
                <i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i>
              </div>
              <p class="t-home-quote">"Saves us hours of math during and after trips. The debt minimizer feature is pure magic — we settled a 10-person Goa trip in just three quick transfers."</p>
              <div class="t-home-user">
                <div class="t-home-avatar av2">SS</div>
                <div class="t-home-details">
                  <span class="t-home-name">Sneha & Shruti</span>
                  <span class="t-home-desc">Frequent Travelers</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div class="testimonial-home-card glass-card reveal-home">
              <div class="t-home-stars">
                <i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i><i data-lucide="star"></i>
              </div>
              <p class="t-home-quote">"A clean, fast interface. No ads, no popups. It just does split expenses extremely well, and the proof verification features prevent any trust issues."</p>
              <div class="t-home-user">
                <div class="t-home-avatar av3">AD</div>
                <div class="t-home-details">
                  <span class="t-home-name">Aditya & Friends</span>
                  <span class="t-home-desc">Office Lunch Buddies</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section class="cta-home-section">
        <div class="container">
          <div class="cta-home-card reveal-home">
            <div class="cta-home-content">
              <h2 class="cta-home-title">Ready to split fairly?</h2>
              <p class="cta-home-subtext">Join thousands of users splitting expenses with zero stress. Get started with your groups today.</p>
              <Link to="/register" class="btn-home btn-home-primary" style={{ fontSize: '1.1rem', padding: '16px 36px' }}>Create Your First Group</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer class="footer-home">
        <div class="container">
          <div class="footer-home-grid">
            <div class="footer-home-about">
              <a href="#" class="footer-home-logo">
                <i data-lucide="wallet"></i>
                <span>SplitEase</span>
              </a>
              <p class="footer-home-tagline">Split expenses, bills, and tabs with friends, flatmates, and family without any calculations.</p>
              <div class="footer-home-socials">
                <a href="#" class="social-home-link" aria-label="Twitter"><i data-lucide="twitter"></i></a>
                <a href="#" class="social-home-link" aria-label="Github"><i data-lucide="github"></i></a>
                <a href="#" class="social-home-link" aria-label="Linkedin"><i data-lucide="linkedin"></i></a>
              </div>
            </div>
            
            <div class="footer-home-links-col">
              <span class="footer-home-links-title">Product</span>
              <ul class="footer-home-links-list">
                <li class="footer-home-link"><a href="#features">Features</a></li>
                <li class="footer-home-link"><a href="#how-it-works">How It Works</a></li>
                <li class="footer-home-link"><a href="#preview">Interface Preview</a></li>
              </ul>
            </div>

            <div class="footer-home-links-col">
              <span class="footer-home-links-title">Account</span>
              <ul class="footer-home-links-list">
                <li class="footer-home-link"><Link to="/login">Login</Link></li>
                <li class="footer-home-link"><Link to="/register">Register</Link></li>
              </ul>
            </div>
          </div>

          <div class="footer-home-bottom">
            <span class="copyright-home">© 2026 SplitEase. All rights reserved. Made for clean friendships.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
