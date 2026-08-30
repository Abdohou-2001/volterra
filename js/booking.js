// VOLTERRA booking.js — LOCAL PLACEHOLDERS ONLY
// No Base64, No Unsplash, No external URLs
// Validation, live summary, localStorage, bike prefill from ?bike=id with fallback

(function(){
  const FALLBACK_IMG = 'assets/images/bikes/bike-01-1.jpg';

  const SERVICES = [
    { id:'general', name:'General Maintenance', icon:'fa-screwdriver-wrench', desc:'Routine checks & adjustments' },
    { id:'brake', name:'Brake Service', icon:'fa-compact-disc', desc:'Inspection & replacement' },
    { id:'battery', name:'Battery & Electrical', icon:'fa-battery-three-quarters', desc:'Diagnostics & SoH report' },
    { id:'tire', name:'Tire & Wheel Service', icon:'fa-circle-notch', desc:'Replacement & true' },
    { id:'drivetrain', name:'Drivetrain Service', icon:'fa-gears', desc:'Chain, cassette, belt' },
    { id:'fullcheck', name:'Full E-Bike Check', icon:'fa-magnifying-glass-chart', desc:'127-point inspection' }
  ];

  const $ = s=> document.querySelector(s);
  const form = $('#bookingForm');
  const grid = $('#serviceGrid');
  const brandList = $('#brandList');
  const STORAGE_KEY = 'ebike_bookings';

  // --- Fallback handler for bike image in prefill banner ---
  window.handleBookingImgError = function(img){
    if(img.dataset.failed) return;
    img.dataset.failed="1";
    img.style.display='none';
    const ph = document.createElement('div');
    ph.className='ph';
    ph.textContent='coming soon';
    img.parentNode.insertBefore(ph, img);
  };

  // Populate service cards — no images, only icons
  if(grid){
    grid.innerHTML = SERVICES.map(s=>`
      <label class="service-opt" data-name="${s.name}" tabindex="0" role="radio" aria-label="${s.name}">
        <input type="radio" name="service" value="${s.name}">
        <div class="svc-icon"><i class="fa-solid ${s.icon}"></i></div>
        <b>${s.name}</b><span>${s.desc}</span>
      </label>
    `).join('');
  }

  // Brands datalist from local bikes.js
  if(window.BIKES && brandList){
    const brands=[...new Set(window.BIKES.map(b=>b.brand))].sort();
    brandList.innerHTML = brands.map(b=>`<option value="${b}">`).join('');
  }

  let selectedService='';
  const serviceField = $('#f-service');

  function selectService(label){
    grid.querySelectorAll('.service-opt').forEach(o=> o.classList.remove('selected'));
    label.classList.add('selected');
    const inp = label.querySelector('input');
    if(inp) inp.checked=true;
    selectedService = label.dataset.name;
    serviceField?.classList.remove('invalid');
    updateSummary();
  }

  grid?.addEventListener('click', e=>{
    const label = e.target.closest('.service-opt');
    if(!label) return;
    selectService(label);
  });
  grid?.addEventListener('keydown', e=>{
    if(e.key==='Enter' || e.key===' '){
      e.preventDefault();
      const label = e.target.closest('.service-opt');
      if(label) selectService(label);
    }
  });

  // --- Prefill from ?bike=id or ?bikeId — uses LOCAL image ---
  const params = new URLSearchParams(location.search);
  const bikeId = params.get('bike') || params.get('bikeId') || params.get('id');
  if(bikeId && window.BIKES){
    const bike = window.BIKES.find(b=> String(b.id)===String(bikeId));
    if(bike){
      const brandEl = $('#bikeBrand');
      const modelEl = $('#bikeModel');
      const yearEl = $('#bikeYear');
      if(brandEl) brandEl.value = bike.brand;
      if(modelEl) modelEl.value = bike.model;
      if(yearEl) yearEl.value = bike.year;

      const banner = $('#prefillBanner');
      if(banner){
        banner.style.display='flex';
        banner.className='prefill';
        // LOCAL image only — no Unsplash
        banner.innerHTML = `
          <img src="${bike.image || FALLBACK_IMG}" alt="${bike.brand} ${bike.model}" onerror="handleBookingImgError(this)">
          <div><b>Service requested for this bike</b><span>${bike.brand} ${bike.model} · ${bike.year} · ${bike.mileage.toLocaleString()} km</span></div>
          <div style="margin-left:auto"><span class="eyebrow" style="color:#B7F34A">Linked from details</span></div>
        `;
      }
    }
  }

  // --- Live summary ---
  function updateSummary(){
    const sumService = $('#sumService');
    const sumDate = $('#sumDate');
    const sumTime = $('#sumTime');
    const sumBike = $('#sumBike');
    if(sumService) sumService.textContent = selectedService || '—';
    const d = $('#prefDate')?.value;
    if(sumDate) sumDate.textContent = d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—';
    if(sumTime) sumTime.textContent = $('#prefTime')?.value || '—';
    const brand = $('#bikeBrand')?.value.trim() || '';
    const model = $('#bikeModel')?.value.trim() || '';
    if(sumBike) sumBike.textContent = brand || model ? `${brand} ${model}`.trim() : '—';
  }

  ['input','change'].forEach(ev=>{
    form?.addEventListener(ev, updateSummary);
  });

  // Min date = today
  const dateInput = $('#prefDate');
  const today = new Date(); today.setHours(0,0,0,0);
  const iso = today.toISOString().split('T')[0];
  if(dateInput) dateInput.min = iso;

  function setInvalid(id, isInvalid){
    const el = document.getElementById(id);
    if(!el) return;
    el.classList.toggle('invalid', isInvalid);
  }

  function validate(){
    let ok=true;
    const name = $('#fullName')?.value.trim() || '';
    const email = $('#email')?.value.trim() || '';
    const phone = $('#phone')?.value.trim() || '';
    const brand = $('#bikeBrand')?.value.trim() || '';
    const model = $('#bikeModel')?.value.trim() || '';
    const dateVal = $('#prefDate')?.value || '';
    const timeVal = $('#prefTime')?.value || '';

    setInvalid('f-name', !name); if(!name) ok=false;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setInvalid('f-email', !emailOk); if(!emailOk) ok=false;
    const digits = phone.replace(/\D/g,'');
    const phoneOk = digits.length>=8;
    setInvalid('f-phone', !phoneOk); if(!phoneOk) ok=false;
    setInvalid('f-brand', !brand); if(!brand) ok=false;
    setInvalid('f-model', !model); if(!model) ok=false;
    setInvalid('f-service', !selectedService); if(!selectedService) ok=false;

    let dateOk=true;
    if(!dateVal) dateOk=false;
    else{
      const d = new Date(dateVal); d.setHours(0,0,0,0);
      if(d < today) dateOk=false;
    }
    setInvalid('f-date', !dateOk); if(!dateOk) ok=false;
    setInvalid('f-time', !timeVal); if(!timeVal) ok=false;

    return ok;
  }

  function genRef(){
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    const num = existing.length+1;
    const year = new Date().getFullYear();
    return `EB-${year}-${String(num).padStart(3,'0')}`;
  }

  form?.addEventListener('submit', e=>{
    e.preventDefault();
    if(!validate()){
      const firstInvalid = form.querySelector('.field.invalid');
      if(firstInvalid) firstInvalid.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }
    const booking = {
      id: genRef(),
      name: $('#fullName').value.trim(),
      email: $('#email').value.trim(),
      phone: $('#phone').value.trim(),
      bikeBrand: $('#bikeBrand').value.trim(),
      bikeModel: $('#bikeModel').value.trim(),
      bikeYear: $('#bikeYear').value.trim(),
      service: selectedService,
      date: $('#prefDate').value,
      time: $('#prefTime').value,
      notes: $('#notes').value.trim(),
      createdAt: new Date().toISOString(),
      linkedBikeId: bikeId || null
    };
    const arr = JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
    arr.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

    // Success modal
    const refEl = $('#refNumber');
    if(refEl) refEl.textContent = `Reference: ${booking.id}`;
    const successText = $('#successText');
    if(successText) successText.textContent = `Thanks, ${booking.name.split(' ')[0]}. Your service request has been submitted.`;
    const details = $('#successDetails');
    if(details){
      details.innerHTML = `
        <div style="display:grid;gap:6px">
          <div style="display:flex;justify-content:space-between"><span style="color:var(--color-text-secondary)">Service</span><b>${booking.service}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--color-text-secondary)">Date</span><b>${new Date(booking.date).toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--color-text-secondary)">Time</span><b>${booking.time}</b></div>
          <div style="display:flex;justify-content:space-between"><span style="color:var(--color-text-secondary)">Bike</span><b>${booking.bikeBrand} ${booking.bikeModel}</b></div>
        </div>
        <p style="margin-top:10px;font-size:11px;color:var(--color-text-secondary)">We'll contact you to confirm the appointment. This is a booking request, not instant confirmation.</p>
      `;
    }
    const modal = $('#successModal');
    if(modal){ modal.classList.add('open'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }

    form.reset();
    grid?.querySelectorAll('.service-opt').forEach(o=> o.classList.remove('selected'));
    selectedService='';
    updateSummary();
  });

  // Modal close
  const modal = $('#successModal');
  $('#closeModal')?.addEventListener('click', ()=>{ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; });
  modal?.addEventListener('click', e=>{ if(e.target===modal){ modal.classList.remove('open'); document.body.style.overflow=''; } });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && modal?.classList.contains('open')){ modal.classList.remove('open'); document.body.style.overflow=''; } });

  // Drawer
  const drawer=document.getElementById('drawer');
  document.getElementById('openMenu')?.addEventListener('click',()=> drawer.classList.add('open'));
  document.getElementById('closeMenu')?.addEventListener('click',()=> drawer.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=> drawer.classList.remove('open')));

  updateSummary();
})();
