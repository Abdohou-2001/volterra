// admin.js — VOLTERRA Admin Demo — LOCAL PLACEHOLDERS ONLY
// No Base64, No Unsplash, No external URLs
// Uses localStorage ebike_bikes, graceful image fallback

(function(){
  const STORAGE_KEY = 'ebike_bikes';
  const BOOKINGS_KEY = 'ebike_bookings';
  const FALLBACK_LOCAL = 'assets/images/bikes/bike-1.jpg'; // local placeholder you will add

  function normalizeBike(b){
    // Convert old structure (with fallback Unsplash) to local-only structure
    const localImg = b.image && b.image.startsWith('assets/')? b.image : `assets/images/bikes/bike-${b.id}.jpg`;
    const localImages = (b.images && b.images.length && b.images[0].startsWith('assets/'))
     ? b.images
      : [
          `assets/images/bikes/bike-${b.id}.jpg`,
          `assets/images/bikes/bike-${b.id}-2.jpg`,
          `assets/images/bikes/bike-${b.id}-3.jpg`,
          `assets/images/bikes/bike-${b.id}-4.jpg`
        ];
    return {
      id: b.id,
      brand: b.brand,
      model: b.model,
      price: b.price,
      year: b.year,
      mileage: b.mileage || 0,
      battery: b.batteryLabel || (typeof b.battery === 'number'? `${b.battery} Wh` : (b.battery || '—')),
      batteryRaw: typeof b.battery === 'number'? b.battery : parseInt(b.battery)||0,
      frameSize: b.frameSize || 'M',
      condition: b.condition || 'Good',
      status: b.status || 'Available',
      image: localImg,
      images: localImages,
      description: b.description || '',
      motor: b.motor || '',
      batteryHealth: b.batteryHealth || 90
    };
  }

  function loadFromStorage(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length) {
          return parsed.map(b=> normalizeBike(b));
        }
      }
    }catch(e){}
    return (window.BIKES||[]).map(b=> normalizeBike(b));
  }

  function saveToStorage(bikes){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bikes));
  }

  let bikes = loadFromStorage();
  let filterQ = '';
  let filterStatus = 'all';
  let filterCondition = 'all';
  let editingId = null;
  let deletingId = null;
  let currentTab = 'dashboard';

  const $ = s=> document.querySelector(s);
  const tableBody = $('#tableBody');
  const cards = $('#cards');
  const emptyState = $('#emptyState');
  const tableWrap = $('#tableWrap');
  const searchInput = $('#searchInput');
  const statusFilter = $('#statusFilter');
  const conditionFilter = $('#conditionFilter');

  // --- Image fallback handler ---
  window.handleAdminImgError = function(img){
    if(img.dataset.failed) return;
    img.dataset.failed="1";
    img.style.display="none";
    const filename = (img.src.split('/').pop()||'bike image').split('?')[0];
    const ph = document.createElement('div');
    ph.className = 'ph';
    ph.innerHTML = `<i class="fa-solid fa-image"></i><span>${filename}<br>coming soon</span>`;
    ph.style.cssText = 'display:grid;place-items:center;gap:4px;background:#EEEDE8;border:1px solid var(--color-border);border-radius:10px;color:var(--color-text-secondary);font-size:9px;text-align:center';
    // match size of original img
    if(img.classList.contains('table-thumb')){
      ph.style.width='48px'; ph.style.height='48px';
    } else if(img.classList.contains('card-thumb')){
      ph.style.width='84px'; ph.style.height='84px'; ph.style.flex='0 0 84px';
    }
    img.parentNode.insertBefore(ph, img);
  };

  function renderStats(){
    const total = bikes.length;
    const avail = bikes.filter(b=> b.status==='Available').length;
    const sold = bikes.filter(b=> b.status==='Sold').length;
    const avg = total? Math.round(bikes.reduce((s,b)=> s + (Number(b.price)||0),0)/total) : 0;
    $('#statTotal').textContent = total;
    $('#statAvail').textContent = avail;
    $('#statSold').textContent = sold;
    $('#statAvg').textContent = avg? `$${avg.toLocaleString()}` : '$0';
  }

  function filtered(){
    let out=[...bikes];
    if(filterQ){
      const q=filterQ.toLowerCase();
      out = out.filter(b=> `${b.brand} ${b.model} ${b.year}`.toLowerCase().includes(q));
    }
    if(filterStatus!=='all') out = out.filter(b=> b.status===filterStatus);
    if(filterCondition!=='all') out = out.filter(b=> b.condition===filterCondition);
    return out;
  }

  function render(){
    const data = filtered();
    renderStats();
    renderTable(data);
    renderCards(data);
    const has = data.length>0;
    if(emptyState) emptyState.style.display = has? 'none' : 'block';
    if(tableWrap) tableWrap.style.display = has? 'block' : 'none';
    const bookings = getBookings();
    const badge = $('#bookingCountBadge');
    if(badge){
      if(bookings.length){ badge.textContent=bookings.length; badge.style.display='grid'; }
      else badge.style.display='none';
    }
    if(currentTab==='bookings') renderBookings();
  }

  function renderTable(data){
    if(!tableBody) return;
    tableBody.innerHTML = data.map(b=>`
      <tr>
        <td>
          <div class="bike-cell">
            <img class="table-thumb" src="${escapeAttr(b.image)}" alt="${escapeAttr(b.brand)} ${escapeAttr(b.model)}" loading="lazy" onerror="handleAdminImgError(this)">
            <div><b>${esc(b.brand)} ${esc(b.model)}</b><span>${b.year} · ${b.mileage} km</span></div>
          </div>
        </td>
        <td>${esc(b.brand)}</td>
        <td>${esc(b.model)}</td>
        <td>${b.year}</td>
        <td><b>$${Number(b.price).toLocaleString()}</b></td>
        <td>${b.mileage} km</td>
        <td>${esc(b.battery)}</td>
        <td><span class="badge ${b.condition.toLowerCase()}">${esc(b.condition)}</span></td>
        <td><span class="badge ${b.status==='Available'?'available':'sold'}">${esc(b.status)}</span></td>
        <td><div class="actions"><button class="icon-btn" data-edit="${b.id}" aria-label="Edit"><i class="fa-solid fa-pen"></i></button><button class="icon-btn" data-del="${b.id}" aria-label="Delete"><i class="fa-solid fa-trash"></i></button></div></td>
      </tr>
    `).join('');
  }

  function renderCards(data){
    if(!cards) return;
    cards.innerHTML = data.map(b=>`
      <div class="bike-card">
        <img class="card-thumb" src="${escapeAttr(b.image)}" alt="${esc(b.brand)}" loading="lazy" onerror="handleAdminImgError(this)">
        <div class="meta">
          <div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(b.brand)} ${esc(b.model)}</b><span class="price">$${Number(b.price).toLocaleString()}</span></div>
          <div style="font-size:11px;color:var(--color-text-secondary)">${b.year} · ${b.mileage} km · ${esc(b.battery)} · ${esc(b.frameSize)}</div>
          <div style="margin-top:6px;display:flex;gap:6px"><span class="badge ${b.condition.toLowerCase()}">${esc(b.condition)}</span><span class="badge ${b.status==='Available'?'available':'sold'}">${esc(b.status)}</span></div>
          <div class="row" style="display:flex;justify-content:space-between;margin-top:8px;gap:8px"><button class="btn-secondary" data-edit="${b.id}" style="padding:8px 12px;font-size:12px"><i class="fa-solid fa-pen"></i> Edit</button><button class="btn-secondary" data-del="${b.id}" style="padding:8px 12px;font-size:12px"><i class="fa-solid fa-trash"></i> Delete</button></div>
        </div>
      </div>
    `).join('');
  }

  function esc(s){ return String(s||'').replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeAttr(s){ return esc(s).replace(/"/g,'&quot;'); }

  const bikeModal = $('#bikeModal');
  const deleteModal = $('#deleteModal');

  function openModal(){
    if(!bikeModal) return;
    bikeModal.classList.add('open'); bikeModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeModal(){
    if(!bikeModal) return;
    bikeModal.classList.remove('open'); bikeModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; editingId=null; clearValidation();
  }
  function openDeleteModal(id){
    const bike = bikes.find(b=> String(b.id)===String(id));
    if(!bike) return;
    deletingId=id;
    const nameEl = $('#deleteName');
    if(nameEl) nameEl.textContent = `${bike.brand} ${bike.model}`;
    if(deleteModal){ deleteModal.classList.add('open'); deleteModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  }
  function closeDeleteModal(){
    if(!deleteModal) return;
    deleteModal.classList.remove('open'); deleteModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deletingId=null;
  }

  function clearValidation(){ document.querySelectorAll('.field.invalid').forEach(f=> f.classList.remove('invalid')); }

  function validateForm(){
    let ok=true;
    const brand = $('#inputBrand')?.value.trim() || '';
    const model = $('#inputModel')?.value.trim() || '';
    const price = Number($('#inputPrice')?.value);
    const year = Number($('#inputYear')?.value);
    const mileageVal = $('#inputMileage')?.value;
    const mileage = mileageVal===''? 0 : Number(mileageVal);

    function setInvalid(id, cond){ const el=document.getElementById(id); if(!el) return; if(cond){ el.classList.add('invalid'); ok=false; } else el.classList.remove('invalid'); }

    setInvalid('f-brand',!brand);
    setInvalid('f-model',!model);
    setInvalid('f-price',!price || isNaN(price) || price<=0);
    setInvalid('f-year',!year || year<2015 || year>2026);
    setInvalid('f-mileage', isNaN(mileage) || mileage<0);
    return ok;
  }

  function collectForm(){
    const imgInput = $('#inputImage')?.value.trim() || '';
    // Force local placeholder pattern — no Unsplash, no external
    const img = imgInput.startsWith('assets/')? imgInput : (imgInput? imgInput : FALLBACK_LOCAL);
    return {
      brand: $('#inputBrand').value.trim(),
      model: $('#inputModel').value.trim(),
      price: Number($('#inputPrice').value),
      year: Number($('#inputYear').value),
      mileage: Number($('#inputMileage').value)||0,
      battery: $('#inputBattery').value.trim() || '—',
      batteryLabel: $('#inputBattery').value.trim() || '—',
      frameSize: $('#inputFrame').value,
      condition: $('#inputCondition').value,
      status: $('#inputStatus').value,
      image: img,
      images: [img, img.replace('.jpg','-2.jpg'), img.replace('.jpg','-3.jpg'), img.replace('.jpg','-4.jpg')],
      description: $('#inputDesc').value.trim(),
    };
  }

  function openAddModal(){
    editingId=null;
    const mt = $('#modalTitle'); if(mt) mt.textContent='Add Bike';
    const st = $('#saveText'); if(st) st.textContent='Add Bike';
    if($('#inputImage')) $('#inputImage').value='';
    if($('#inputBrand')) $('#inputBrand').value='';
    if($('#inputModel')) $('#inputModel').value='';
    if($('#inputPrice')) $('#inputPrice').value='';
    if($('#inputYear')) $('#inputYear').value=new Date().getFullYear();
    if($('#inputMileage')) $('#inputMileage').value='';
    if($('#inputBattery')) $('#inputBattery').value='';
    if($('#inputFrame')) $('#inputFrame').value='M';
    if($('#inputCondition')) $('#inputCondition').value='Excellent';
    if($('#inputStatus')) $('#inputStatus').value='Available';
    if($('#inputDesc')) $('#inputDesc').value='';
    openModal();
  }

  function openEditModal(id){
    const bike = bikes.find(b=> String(b.id)===String(id));
    if(!bike) return;
    editingId=id;
    const mt = $('#modalTitle'); if(mt) mt.textContent='Edit Bike';
    const st = $('#saveText'); if(st) st.textContent='Save Changes';
    if($('#inputImage')) $('#inputImage').value = bike.image===FALLBACK_LOCAL? '' : bike.image;
    if($('#inputBrand')) $('#inputBrand').value=bike.brand;
    if($('#inputModel')) $('#inputModel').value=bike.model;
    if($('#inputPrice')) $('#inputPrice').value=bike.price;
    if($('#inputYear')) $('#inputYear').value=bike.year;
    if($('#inputMileage')) $('#inputMileage').value=bike.mileage;
    if($('#inputBattery')) $('#inputBattery').value=bike.battery;
    if($('#inputFrame')) $('#inputFrame').value=bike.frameSize;
    if($('#inputCondition')) $('#inputCondition').value=bike.condition;
    if($('#inputStatus')) $('#inputStatus').value=bike.status;
    if($('#inputDesc')) $('#inputDesc').value=bike.description||'';
    openModal();
  }

  function saveBike(){
    if(!validateForm()){ showToast('Please fix highlighted fields','fa-circle-exclamation'); return; }
    const data = collectForm();
    if(editingId){
      const idx = bikes.findIndex(b=> String(b.id)===String(editingId));
      if(idx>=0){
        bikes[idx] = {...bikes[idx],...data, id:bikes[idx].id };
        showToast('Bike updated successfully','fa-circle-check');
      }
    } else {
      const newId = bikes.length? Math.max(...bikes.map(b=> Number(b.id)||0))+1 : 1;
      const newBike = { id:newId,...data };
      bikes.unshift(newBike);
      showToast('Bike added successfully','fa-circle-check');
    }
    saveToStorage(bikes);
    closeModal();
    render();
  }

  function confirmDelete(){
    if(!deletingId) return;
    bikes = bikes.filter(b=> String(b.id)!==String(deletingId));
    saveToStorage(bikes);
    closeDeleteModal();
    render();
    showToast('Bike deleted successfully','fa-trash');
  }

  function showToast(msg, icon='fa-circle-check'){
    const wrap=$('#toastWrap');
    if(!wrap) return;
    const el=document.createElement('div');
    el.className='toast';
    el.innerHTML=`<i class="fa-solid ${icon}"></i><span>${esc(msg)}</span>`;
    wrap.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(8px)'; setTimeout(()=> el.remove(), 280); }, 2600);
  }

  function getBookings(){ try{ return JSON.parse(localStorage.getItem(BOOKINGS_KEY)||'[]'); }catch{ return []; } }
  function renderBookings(){
    const list=$('#bookingsList');
    if(!list) return;
    const data=getBookings();
    if(!data.length){ list.innerHTML='<div class="empty" style="padding:24px"><p>No booking requests yet. Book a service from book-service.html</p></div>'; return; }
    list.innerHTML=data.slice().reverse().map(b=>`
      <div class="booking-card">
        <div><b>${esc(b.name)} · ${esc(b.service)}</b><span>${esc(b.bikeBrand)} ${esc(b.bikeModel)} · ${esc(b.date)} ${esc(b.time)}</span><span>${esc(b.email)} · ${esc(b.phone)}</span></div>
        <div style="text-align:right"><span class="badge available">${esc(b.id)}</span><span style="margin-top:6px;display:block;font-size:11px">${new Date(b.createdAt).toLocaleDateString()}</span></div>
      </div>
    `).join('');
  }

  function setTab(tab){
    currentTab=tab;
    document.querySelectorAll('.side-link[data-tab]').forEach(l=> l.classList.toggle('active', l.dataset.tab===tab));
    const invToolbar = $('#inventoryToolbar');
    const bookingsSection = $('#bookingsSection');
    const statsEl = $('#stats');
    if(tab==='bookings'){
      if(invToolbar) invToolbar.style.display='none';
      if(tableWrap) tableWrap.style.display='none';
      if(cards) cards.style.display='none';
      if(emptyState) emptyState.style.display='none';
      if(statsEl) statsEl.style.display='none';
      if(bookingsSection){ bookingsSection.style.display='block'; renderBookings(); }
    } else {
      if(bookingsSection) bookingsSection.style.display='none';
      if(invToolbar) invToolbar.style.display='flex';
      if(statsEl) statsEl.style.display='grid';
      render();
    }
  }

  // Events
  searchInput?.addEventListener('input', e=>{ filterQ=e.target.value; render(); });
  statusFilter?.addEventListener('change', e=>{ filterStatus=e.target.value; render(); });
  conditionFilter?.addEventListener('change', e=>{ filterCondition=e.target.value; render(); });

  document.getElementById('openAdd')?.addEventListener('click', openAddModal);
  document.getElementById('openAddFromSide')?.addEventListener('click', openAddModal);
  document.getElementById('emptyAdd')?.addEventListener('click', openAddModal);
  document.getElementById('closeModal')?.addEventListener('click', closeModal);
  document.getElementById('cancelModal')?.addEventListener('click', closeModal);
  document.getElementById('saveModal')?.addEventListener('click', saveBike);
  bikeModal?.addEventListener('click', e=>{ if(e.target===bikeModal) closeModal(); });

  document.getElementById('closeDelete')?.addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDelete')?.addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDelete')?.addEventListener('click', confirmDelete);
  deleteModal?.addEventListener('click', e=>{ if(e.target===deleteModal) closeDeleteModal(); });

  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModal(); closeDeleteModal(); } });

  document.addEventListener('click', e=>{
    const editBtn = e.target.closest('[data-edit]');
    if(editBtn){ openEditModal(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if(delBtn){ openDeleteModal(delBtn.dataset.del); return; }
  });

  document.querySelectorAll('.side-link[data-tab]').forEach(btn=> btn.addEventListener('click', ()=> setTab(btn.dataset.tab)));

  document.getElementById('resetData')?.addEventListener('click', ()=>{
    if(confirm('Reset demo data to original 12 bikes? This will overwrite current inventory.')){
      localStorage.removeItem(STORAGE_KEY);
      bikes = (window.BIKES||[]).map(b=> normalizeBike(b));
      saveToStorage(bikes);
      render();
      showToast('Demo data reset','fa-rotate-left');
    }
  });

  // init
  render();
})();
