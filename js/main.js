// ============================================================
// Kaboozer Marketing Site — Main JS
// Waitlist form submission + smooth scroll
// ============================================================

// Supabase client — replace with your project URL and anon key
const SUPABASE_URL = 'https://jothpcjnmhgupxtilvjc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvdGhwY2pubWhndXB4dGlsdmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4OTM1NzYsImV4cCI6MjA5MDQ2OTU3Nn0.ARf_mtL5k1CwXnLln2JiJPEqS8hyFHUsG6moLcNQr3g';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---- Waitlist Form ----

const form = document.getElementById('waitlist-form');
const messageEl = document.getElementById('waitlist-message');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const email = emailInput.value.trim().toLowerCase();

    if (!email) return;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';
    messageEl.textContent = '';
    messageEl.className = 'waitlist-message';

    try {
      const { error } = await supabase
        .from('waitlist')
        .insert({ email });

      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          messageEl.textContent = "You're already on the list!";
          messageEl.className = 'waitlist-message duplicate';
        } else {
          messageEl.textContent = 'Something went wrong, please try again.';
          messageEl.className = 'waitlist-message error';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Join the Waitlist';
        return;
      }

      // Success — replace form with confirmation
      form.style.display = 'none';
      messageEl.textContent = "You're on the list! We'll be in touch.";
      messageEl.className = 'waitlist-message success';
    } catch (err) {
      messageEl.textContent = 'Something went wrong, please try again.';
      messageEl.className = 'waitlist-message error';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join the Waitlist';
    }
  });
}
