// bike-details.js — VOLTERRA — LOCAL PLACEHOLDERS ONLY
// No Base64, No Unsplash, No external URLs
// Handles: gallery, thumbnails, prev/next, keyboard, related bikes, fallback placeholder
(function(){
  const $ = s=> document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const detailRoot = $('#detailRoot');
  const errorRoot = $('#errorRoot');
  const crumbName = $('#crumbName');

  function canonicalImagePath(id,index=1){
    const n=String(Number(id)||0).padStart(2,'0');
    return `assets/images/bikes/bike-${n}-${index}.jpg`;
  }
  function canonicalizeImage(path,bikeId,index=1){
    if(!path || typeof path!=='string') return canonicalImagePath(bikeId,index);
    const m=path.match(/bike-(\d+)(?:-(\d+))?\.jpg$/i);
    if(m) return canonicalImagePath(m[1], m[2] ? Number(m[2]) : 1);
    if(path.startsWith('assets/') || path.startsWith('data:image/')) return path;
    return canonicalImagePath(bikeId,index);
  }
  function normalizeBike(b){
    const idNum=Number(b.id);
    const images=Array.isArray(b.images)&&b.images.length ? b.images.map((x,i)=>canonicalizeImage(x,idNum,i+1)) : [canonicalImagePath(idNum,1)];
    return {...b,id:idNum,price:Number(b.price)||0,year:Number(b.year)||0,mileage:Number(b.mileage)||0,
      batteryLabel:b.batteryLabel || (typeof b.battery==='number'?`${b.battery} Wh`:String(b.battery||'—')),
      condition:b.condition||'Good',conditionTag:b.conditionTag||b.condition||'Good',frameSize:b.frameSize||'M',
      batteryHealth:Number(b.batteryHealth)||90,image:canonicalizeImage(b.image,idNum,1),images};
  }
  function findBike(){
    if(!id) return null;
    try { const raw=localStorage.getItem('ebike_bikes'); const stored=raw?JSON.parse(raw):null; if(Array.isArray(stored)&&stored.length){ const found=stored.find(b=>String(b.id)===String(id)); if(found) return normalizeBike(found); } } catch(e) {}
    const found=(window.BIKES||window.bikes||[]).find(b=> String(b.id)===String(id));
    return found ? normalizeBike(found) : null;
  }

  const bike = findBike();

  if(!bike){
    errorRoot.style.display='block';
    detailRoot.style.display='none';
    document.title = 'Bike not found — VOLTERRA';
    if(crumbName) crumbName.textContent = 'Not found';
    bindDrawer();
    return;
  }

  // SEO
  document.title = `${bike.brand} ${bike.model} | Used E-Bikes — VOLTERRA`;
  const metaDesc = document.getElementById('metaDesc');
  if(metaDesc) metaDesc.content = `${bike.brand} ${bike.model} ${bike.year} — ${bike.mileage}km, ${bike.batteryLabel}, ${bike.condition}. Inspected used e-bike at VOLTERRA Berlin.`;
  if(crumbName) crumbName.textContent = `${bike.brand} ${bike.model}`;

  // LOCAL IMAGES ONLY — no fallback external
  // Canonical structure: bike-01-1.jpg, bike-01-2.jpg, bike-01-3.jpg, ...
  const galleryImages = (bike.images && bike.images.length)? bike.images : [bike.image];

  const save = bike.originalPrice? bike.originalPrice - bike.price : 0;

  // Helper to create safe image tag with fallback
  function imgTag(src, alt, extra=''){
    return `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}" loading="lazy" onerror="handleImgError(this)" ${extra}>`;
  }

  function escapeAttr(s){ return String(s||'').replace(/"/g,'&quot;'); }

  detailRoot.innerHTML = `
  <div class="detail-grid">
    <div class="gallery">
      <div class="main-img-wrap" id="mainWrap">
        <span class="badge">${bike.conditionTag || bike.condition}</span>
        <button class="nav-arrow prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="nav-arrow next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
        <div id="mainImgContainer" style="width:100%;height:100%;display:grid;place-items:center">
          ${imgTag(galleryImages[0], `${bike.brand} ${bike.model} main image`, 'id="mainImg" style="width:100%;height:100%;object-fit:contain;object-position:center;padding:10px"')}
        </div>
      </div>
      <div class="thumbs" id="thumbs">
        ${galleryImages.map((src,i)=>`
          <button class="thumb ${i===0?'active':''}" data-idx="${i}" aria-label="Image ${i+1}">
            ${imgTag(src, `${bike.brand} ${bike.model} thumbnail ${i+1}`)}
            <span style="display:none" class="thumb-fallback">coming soon</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="info">
      <div class="info-head">
        <div>
          <div class="info-brand">${bike.brand} · ${bike.year}</div>
          <h1 class="info-title">${bike.model}</h1>
        </div>
        <span class="eyebrow">${bike.frameSize} · ${bike.batteryHealth}% SoH</span>
      </div>

      <div class="price-row">
        <span class="price">$${bike.price.toLocaleString()}</span>
        ${bike.originalPrice? `<span class="old-price">$${bike.originalPrice.toLocaleString()}</span>`:''}
        ${save? `<span class="save">Save $${save}</span>`:''}
      </div>

      <div class="condition-line"><i class="fa-solid fa-circle-check"></i> ${bike.condition} · Inspected · ${bike.mileage.toLocaleString()} km</div>

      <div class="specs-grid">
        <div><div class="spec-k">Brand</div><div class="spec-v">${bike.brand}</div></div>
        <div><div class="spec-k">Model</div><div class="spec-v">${bike.model}</div></div>
        <div><div class="spec-k">Year</div><div class="spec-v">${bike.year}</div></div>
        <div><div class="spec-k">Mileage</div><div class="spec-v">${bike.mileage.toLocaleString()} km</div></div>
        <div><div class="spec-k">Battery</div><div class="spec-v">${bike.batteryLabel} · ${bike.batteryHealth}%</div></div>
        <div><div class="spec-k">Frame</div><div class="spec-v">${bike.frameSize}</div></div>
        <div><div class="spec-k">Motor</div><div class="spec-v">${bike.motor}</div></div>
        <div><div class="spec-k">Condition</div><div class="spec-v">${bike.condition}</div></div>
      </div>

      <div class="ctas">
        <a class="btn-primary" href="book-service.html?bike=${bike.id}"><i class="fa-solid fa-calendar-check"></i> Book a Test Ride</a>
        <a class="btn-secondary" href="bikes.html"><i class="fa-solid fa-arrow-left"></i> Back to E-Bikes</a>
      </div>

      <div class="trust">
        <div><i class="fa-solid fa-shield-halved"></i> 6-month service warranty</div>
        <div><i class="fa-solid fa-file-lines"></i> Inspection report included</div>
        <div><i class="fa-solid fa-location-dot"></i> Berlin store pickup</div>
      </div>
    </div>
  </div>

  <div class="detail-sections">
    <div class="card-white">
      <h3>About this bike</h3>
      <p>${bike.description}</p>
      ${bike.features? `<div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:8px">${bike.features.map(f=>`<span style="font-size:12px;border:1px solid var(--color-border);padding:6px 10px;border-radius:100px;background:var(--color-bg)">${f}</span>`).join('')}</div>`:''}
    </div>
    <div class="card-white">
      <h3>Inspection checklist</h3>
      <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:4px">Each VOLTERRA bike receives a 127-point check before listing. This bike was checked for:</p>
      <ul class="checklist">
        <li><i class="fa-solid fa-check"></i> Battery health & cycles tested (${bike.batteryHealth}% SoH)</li>
        <li><i class="fa-solid fa-check"></i> Motor diagnostics & firmware — ${bike.motor}</li>
        <li><i class="fa-solid fa-check"></i> Brakes, pads, discs inspected</li>
        <li><i class="fa-solid fa-check"></i> Tires, wheels, bearings checked</li>
        <li><i class="fa-solid fa-check"></i> Electrical system & lights</li>
        <li><i class="fa-solid fa-check"></i> Frame alignment & torque specs</li>
      </ul>
    </div>
  </div>

  <div class="related">
    <h2>You may also like</h2>
    <div class="bikes-grid" id="relatedGrid"></div>
  </div>
  `;

  // --- Fallback handler for missing local images ---
  window.handleImgError = function(img){
    if(img.dataset.failed) return;
    img.dataset.failed = "1";
    img.style.display = "none";
    const filename = img.src.split('/').pop();
    const ph = document.createElement('div');
    ph.className = 'img-placeholder';
    ph.innerHTML = `<i class="fa-solid fa-image"></i><span>Image coming soon<br>${filename}</span>`;
    // If thumb, show inside thumb
    if(img.closest('.thumb')){
      ph.style.cssText = 'position:absolute;inset:0;display:grid;place-items:center;background:#EEEDE8;font-size:9px';
      img.parentNode.style.position = 'relative';
      img.parentNode.appendChild(ph);
    } else {
      img.parentNode.appendChild(ph);
    }
  };

  // Gallery logic
  let current = 0;
  const mainImgContainer = document.getElementById('mainImgContainer');
  let mainImg = document.getElementById('mainImg');
  const thumbs = document.getElementById('thumbs');

  function setImage(idx){
    current = (idx+galleryImages.length)%galleryImages.length;
    // fade effect
    mainImgContainer.style.opacity = '0';
    setTimeout(()=>{
      mainImgContainer.innerHTML = `<img id="mainImg" src="${galleryImages[current]}" alt="${bike.brand} ${bike.model} main image" style="width:100%;height:100%;object-fit:contain;object-position:center;padding:10px;transition:opacity.28s" loading="lazy" onerror="handleImgError(this)">`;
      mainImg = document.getElementById('mainImg');
      mainImgContainer.style.opacity = '1';
      [...thumbs.children].forEach((t,i)=> t.classList.toggle('active', i===current));
    }, 120);
  }

  thumbs.addEventListener('click', e=>{
    const btn = e.target.closest('.thumb');
    if(!btn) return;
    setImage(Number(btn.dataset.idx));
  });

  detailRoot.querySelector('.nav-arrow.prev').addEventListener('click', ()=> setImage(current-1));
  detailRoot.querySelector('.nav-arrow.next').addEventListener('click', ()=> setImage(current+1));

  document.addEventListener('keydown', e=>{
    if(e.key==='ArrowLeft') setImage(current-1);
    if(e.key==='ArrowRight') setImage(current+1);
  });

  // Related bikes — 3, exclude current, prefer same brand
  function related(){
    // IMPORTANT: window.BIKES contains the raw inventory objects.
    // Normalize every related bike before rendering so image, price,
    // batteryLabel, condition and other derived fields are always present.
    const all = (window.BIKES||window.bikes||[])
      .map(normalizeBike)
      .filter(b => Number(b.id) !== Number(bike.id));

    const sameBrand = all.filter(b => b.brand === bike.brand);
    const differentBrand = all.filter(b => b.brand !== bike.brand);
    return [...sameBrand, ...differentBrand].slice(0,3);
  }

  const relatedGrid = document.getElementById('relatedGrid');
  if(relatedGrid){
    relatedGrid.innerHTML = related().map(b=>`
      <article class="bike-card">
        <div class="bike-img">
          <span class="badge-card">${b.conditionTag || b.condition}</span>
          <img src="${b.image}" alt="${b.brand} ${b.model}" loading="lazy" onerror="handleImgError(this)">
        </div>
        <div class="bike-body">
          <div class="bike-brand">${b.brand}</div>
          <div class="bike-name">${b.model}</div>
          <div class="bike-specs"><span>${b.year}</span><span class="dot"></span><span>${b.mileage.toLocaleString()} km</span><span class="dot"></span><span>${b.batteryLabel}</span></div>
          <div class="bike-foot"><span class="bike-price">$${b.price.toLocaleString()}</span><a class="bike-link" href="bike-details.html?id=${b.id}">View Details <i class="fa-solid fa-arrow-right"></i></a></div>
        </div>
      </article>
    `).join('');
  }

  bindDrawer();

  function bindDrawer(){
    const drawer = document.getElementById('drawer');
    document.getElementById('openMenu')?.addEventListener('click',()=> drawer.classList.add('open'));
    document.getElementById('closeMenu')?.addEventListener('click',()=> drawer.classList.remove('open'));
    drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=> drawer.classList.remove('open')));
  }
})();
