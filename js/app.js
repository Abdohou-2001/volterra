// app.js — VOLTERRA Home & Bikes Listing — LOCAL PLACEHOLDERS ONLY
// No Base64, No Unsplash, No external URLs
// Drawer, search, filters, inventory rendering with graceful fallback

(function(){
  const STORAGE_KEY = 'ebike_bikes';
  const FALLBACK_LOCAL = 'assets/images/bikes/bike-01-1.jpg';

  function canonicalImagePath(id, index=1){
    const n = String(Number(id)||0).padStart(2,'0');
    return `assets/images/bikes/bike-${n}-${index}.jpg`;
  }
  function canonicalizeImage(path, id, index=1){
    if(!path || typeof path !== 'string') return canonicalImagePath(id,index);
    const m = path.match(/bike-(\d+)(?:-(\d+))?\.jpg$/i);
    if(m){
      const fileId = String(Number(m[1])||0).padStart(2,'0');
      const fileIndex = m[2] ? Number(m[2]) : 1;
      return canonicalImagePath(fileId, fileIndex);
    }
    return path.startsWith('assets/') ? path : canonicalImagePath(id,index);
  }
  function normalizeBike(b){
    const localImg = canonicalizeImage(b.image, b.id, 1);
    const localImages = (Array.isArray(b.images) && b.images.length)
      ? b.images.map((x,i)=>canonicalizeImage(x,b.id,i+1))
      : [canonicalImagePath(b.id,1)];
    return {
      id: b.id,
      brand: b.brand,
      model: b.model,
      year: b.year,
      price: b.price,
      originalPrice: b.originalPrice || null,
      mileage: b.mileage || 0,
      batteryLabel: b.batteryLabel || (b.battery? `${b.battery} Wh` : '—'),
      frameSize: b.frameSize || 'M',
      condition: b.condition || 'Good',
      conditionTag: b.conditionTag || b.condition || 'Good',
      status: b.status || 'Available',
      image: localImg,
      images: localImages,
      motor: b.motor || '',
      batteryHealth: b.batteryHealth || 90,
      description: b.description || ''
    };
  }

  function loadBikes(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length) return parsed.map(normalizeBike);
      }
    }catch(e){}
    return (window.BIKES||[]).map(normalizeBike);
  }

  const bikes = loadBikes();

  // --- Global fallback for missing local images ---
  window.handleAppImgError = function(img){
    if(img.dataset.failed) return;
    img.dataset.failed="1";
    img.style.display='none';
    const filename = (img.src.split('/').pop()||'bike image').split('?')[0];
    const ph = document.createElement('div');
    ph.className='img-fallback';
    ph.innerHTML=`<i class="fa-solid fa-image"></i><span>Image coming soon<br>${filename}</span>`;
    ph.style.cssText='position:absolute;inset:0;display:grid;place-items:center;gap:6px;background:#EEEDE8;color:#6B706C;font-size:11px;text-align:center;padding:10px';
    if(img.parentNode){
      if(getComputedStyle(img.parentNode).position==='static') img.parentNode.style.position='relative';
      img.parentNode.appendChild(ph);
    }
  };

  // --- Drawer (same on all pages) ---
  const drawer = document.getElementById('drawer');
  const openBtn = document.getElementById('openMenu');
  const closeBtn = document.getElementById('closeMenu');
  openBtn?.addEventListener('click', ()=> drawer?.classList.add('open'));
  closeBtn?.addEventListener('click', ()=> drawer?.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> drawer?.classList.remove('open')));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') drawer?.classList.remove('open'); });

  // --- Helpers ---
  const $ = s=> document.querySelector(s);
  function esc(s){ return String(s||'').replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

  function bikeCardHTML(b){
    const save = b.originalPrice? b.originalPrice - b.price : 0;
    return `
      <article class="bike-card" data-id="${b.id}">
        <div class="bike-img">
          <span class="badge-card">${esc(b.conditionTag)}</span>
          <img src="${b.image}" alt="${esc(b.brand)} ${esc(b.model)}" loading="lazy" onerror="handleAppImgError(this)">
          ${save? `<span class="save-badge" style="position:absolute;bottom:10px;right:10px;background:var(--color-primary);color:var(--color-dark);font-size:10px;font-weight:700;padding:4px 8px;border-radius:100px">Save $${save}</span>`:''}
        </div>
        <div class="bike-body">
          <div class="bike-brand">${esc(b.brand)} · ${b.year}</div>
          <div class="bike-name">${esc(b.model)}</div>
          <div class="bike-specs"><span>${b.mileage.toLocaleString()} km</span><span class="dot"></span><span>${esc(b.batteryLabel)}</span><span class="dot"></span><span>${esc(b.frameSize)}</span></div>
          <div class="bike-foot"><span class="bike-price">$${b.price.toLocaleString()}</span><a class="bike-link" href="bike-details.html?id=${b.id}">View Details <i class="fa-solid fa-arrow-right"></i></a></div>
        </div>
      </article>
    `;
  }

  // --- Home page: render featured (first 6) ---
  const featuredGrid = document.getElementById('featuredGrid') || document.getElementById('bikesGridHome');
  if(featuredGrid){
    const featured = bikes.filter(b=> b.status==='Available').slice(0,6);
    if(featured.length){
      featuredGrid.innerHTML = featured.map(b=> bikeCardHTML(b)).join('');
    } else {
      featuredGrid.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:32px;text-align:center;background:#fff;border:1px dashed var(--color-border);border-radius:20px"><p>No bikes available right now. Check admin to add inventory.</p></div>`;
    }
  }

  // --- Bikes page: full listing with search & filters ---
  const bikesGrid = document.getElementById('bikesGrid');
  const searchInput = document.getElementById('searchBikes');
  const brandFilter = document.getElementById('brandFilter');
  const conditionFilter = document.getElementById('conditionFilter');
  const sortFilter = document.getElementById('sortFilter');
  const countEl = document.getElementById('bikeCount');
  const emptyEl = document.getElementById('bikesEmpty');

  if(bikesGrid){
    // Populate brand filter from local data
    if(brandFilter){
      const brands = [...new Set(bikes.map(b=>b.brand))].sort();
      brandFilter.innerHTML = `<option value="all">All Brands</option>` + brands.map(br=> `<option value="${esc(br)}">${esc(br)}</option>`).join('');
    }

    let q='', brand='all', condition='all', sort='newest';

    function getFiltered(){
      let out=[...bikes].filter(b=> b.status==='Available');
      if(q){
        const qq=q.toLowerCase();
        out = out.filter(b=> `${b.brand} ${b.model} ${b.year} ${b.batteryLabel}`.toLowerCase().includes(qq));
      }
      if(brand!=='all') out = out.filter(b=> b.brand===brand);
      if(condition!=='all') out = out.filter(b=> b.condition===condition);
      if(sort==='price-asc') out.sort((a,b)=> a.price-b.price);
      else if(sort==='price-desc') out.sort((a,b)=> b.price-a.price);
      else if(sort==='mileage-asc') out.sort((a,b)=> a.mileage-b.mileage);
      else if(sort==='year-desc') out.sort((a,b)=> b.year-a.year);
      else out.sort((a,b)=> b.id-a.id);
      return out;
    }

    function renderBikes(){
      const data = getFiltered();
      if(countEl) countEl.textContent = `${data.length} bike${data.length!==1?'s':''} found`;
      if(data.length===0){
        bikesGrid.style.display='none';
        if(emptyEl) emptyEl.style.display='block';
      } else {
        bikesGrid.style.display='grid';
        if(emptyEl) emptyEl.style.display='none';
        bikesGrid.innerHTML = data.map(b=> bikeCardHTML(b)).join('');
      }
    }

    searchInput?.addEventListener('input', e=>{ q=e.target.value.trim(); renderBikes(); });
    brandFilter?.addEventListener('change', e=>{ brand=e.target.value; renderBikes(); });
    conditionFilter?.addEventListener('change', e=>{ condition=e.target.value; renderBikes(); });
    sortFilter?.addEventListener('change', e=>{ sort=e.target.value; renderBikes(); });

    renderBikes();
  }

  // --- Newsletter dummy (no backend) ---
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm?.addEventListener('submit', e=>{
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]')?.value.trim();
    if(!email ||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ alert('Please enter a valid email'); return; }
    const btn = newsletterForm.querySelector('button');
    const orig = btn? btn.textContent : '';
    if(btn){ btn.textContent='Subscribed!'; btn.disabled=true; }
    setTimeout(()=>{ if(btn){ btn.textContent=orig; btn.disabled=false; } newsletterForm.reset(); }, 2000);
  });

})();
