// bike-details.js — renders bike from URL id, gallery, related
(function(){
  const $ = s=> document.querySelector(s);
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  const detailRoot = $('#detailRoot');
  const errorRoot = $('#errorRoot');
  const crumbName = $('#crumbName');

  function findBike(){
    if(!id) return null;
    return (window.BIKES||[]).find(b=> String(b.id)===String(id)) || null;
  }

  const bike = findBike();

  if(!bike){
    errorRoot.style.display='block';
    detailRoot.style.display='none';
    document.title = 'Bike not found — VOLTERRA';
    crumbName.textContent = 'Not found';
    // drawer logic still
    bindDrawer();
    return;
  }

  // SEO
  document.title = `${bike.brand} ${bike.model} | Used E-Bikes — VOLTERRA`;
  const metaDesc = document.getElementById('metaDesc');
  if(metaDesc) metaDesc.content = `${bike.brand} ${bike.model} ${bike.year} — ${bike.mileage}km, ${bike.batteryLabel}, ${bike.condition}. Inspected used e-bike at VOLTERRA Berlin.`;
  crumbName.textContent = `${bike.brand} ${bike.model}`;

  const galleryImages = (bike.images && bike.images.length) ? bike.images : [bike.fallback || bike.image];

  const save = bike.originalPrice ? bike.originalPrice - bike.price : 0;

  detailRoot.innerHTML = `
  <div class="detail-grid">
    <div class="gallery">
      <div class="main-img-wrap">
        <span class="badge">${bike.conditionTag || bike.condition}</span>
        <button class="nav-arrow prev" aria-label="Previous image"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="nav-arrow next" aria-label="Next image"><i class="fa-solid fa-chevron-right"></i></button>
        <img id="mainImg" src="${galleryImages[0]}" alt="${bike.brand} ${bike.model} main image">
      </div>
      <div class="thumbs" id="thumbs">
        ${galleryImages.map((src,i)=>`<button class="thumb ${i===0?'active':''}" data-idx="${i}" aria-label="Image ${i+1}"><img src="${src}" alt="${bike.brand} ${bike.model} thumbnail ${i+1}" loading="lazy"></button>`).join('')}
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

  // Gallery logic
  let current = 0;
  const mainImg = $('#mainImg');
  const thumbs = document.getElementById('thumbs');
  function setImage(idx){
    current = (idx+galleryImages.length)%galleryImages.length;
    mainImg.style.opacity='0';
    setTimeout(()=>{ mainImg.src=galleryImages[current]; mainImg.style.opacity='1'; }, 120);
    [...thumbs.children].forEach((t,i)=> t.classList.toggle('active', i===current));
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

  // Related bikes — 3, exclude current, prefer same brand then random
  function related(){
    const others = window.BIKES.filter(b=> b.id!==bike.id);
    const sameBrand = others.filter(b=> b.brand===bike.brand);
    const pool = [...sameBrand, ...others.filter(b=> b.brand!==bike.brand)];
    const picked = pool.slice(0,3);
    // fallback if less than 3
    while(picked.length<3 && others.length>picked.length){
      const remaining = others.filter(b=> !picked.includes(b));
      picked.push(remaining[0]);
    }
    return picked.slice(0,3);
  }

  const relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = related().map(b=>`
    <article class="bike-card">
      <div class="bike-img">
        <span class="badge-card">${b.conditionTag || b.condition}</span>
        <img src="${b.fallback || b.image}" alt="${b.brand} ${b.model}" loading="lazy">
      </div>
      <div class="bike-body">
        <div class="bike-brand">${b.brand}</div>
        <div class="bike-name">${b.model}</div>
        <div class="bike-specs"><span>${b.year}</span><span class="dot"></span><span>${b.mileage.toLocaleString()} km</span><span class="dot"></span><span>${b.batteryLabel}</span></div>
        <div class="bike-foot"><span class="bike-price">$${b.price.toLocaleString()}</span><a class="bike-link" href="bike-details.html?id=${b.id}">View Details <i class="fa-solid fa-arrow-right"></i></a></div>
      </div>
    </article>
  `).join('');

  bindDrawer();

  function bindDrawer(){
    const drawer = document.getElementById('drawer');
    document.getElementById('openMenu')?.addEventListener('click',()=> drawer.classList.add('open'));
    document.getElementById('closeMenu')?.addEventListener('click',()=> drawer.classList.remove('open'));
    drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=> drawer.classList.remove('open')));
  }
})();
