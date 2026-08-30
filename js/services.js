// services.js — VOLTERRA — LOCAL PLACEHOLDERS ONLY
// No Base64, No Unsplash, No external URLs
// Handles: mobile drawer, image fallback, subtle fade-in

(function(){
  // --- Mobile drawer (same as other pages) ---
  const drawer = document.getElementById('drawer');
  const openBtn = document.getElementById('openMenu');
  const closeBtn = document.getElementById('closeMenu');

  function openDrawer(){ if(drawer) drawer.classList.add('open'); }
  function closeDrawer(){ if(drawer) drawer.classList.remove('open'); }

  openBtn?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click', closeDrawer));

  // Close on Escape
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && drawer?.classList.contains('open')) closeDrawer();
  });

  // --- Image fallback for local placeholders ---
  // All images in services.html are now: assets/images/services/...
  // If file doesn't exist, show "Image coming soon" placeholder without breaking layout
  window.handleServiceImgError = function(img){
    if(img.dataset.failed) return;
    img.dataset.failed = "1";
    img.style.display = "none";
    const filename = (img.src.split('/').pop() || '').split('?')[0];
    const ph = document.createElement('div');
    ph.className = 'img-placeholder';
    ph.innerHTML = `<i class="fa-solid fa-image"></i><span>Image coming soon<br>${filename || 'service image'}</span>`;
    // If parent has position relative (hero-visual, why-visual, map-box), keep it
    if(img.parentNode){
      img.parentNode.appendChild(ph);
      // Ensure placeholder covers same area
      if(img.parentNode.classList.contains('hero-visual') ||
         img.parentNode.classList.contains('why-visual') ||
         img.parentNode.classList.contains('map-box')){
        ph.style.position = 'absolute';
        ph.style.inset = '0';
        ph.style.display = 'grid';
      }
    }
  };

  // Attach onerror to all service images automatically
  document.querySelectorAll('.hero-visual img,.why-visual img,.map-box img').forEach(img=>{
    img.addEventListener('error', ()=> window.handleServiceImgError(img));
  });

  // --- Subtle fade-in for service cards (respects prefers-reduced-motion) ---
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced && 'IntersectionObserver' in window){
    const cards = document.querySelectorAll('.service-card,.step,.price-card,.contact-card');
    cards.forEach(c=>{ c.style.opacity='0'; c.style.transform='translateY(8px)'; c.style.transition='opacity.36s ease, transform.36s ease'; });
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(ent=>{
        if(ent.isIntersecting){
          ent.target.style.opacity='1';
          ent.target.style.transform='translateY(0)';
          io.unobserve(ent.target);
        }
      });
    },{threshold:0.12});
    cards.forEach(c=> io.observe(c));
  }

})();
