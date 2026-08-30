// admin.js — VOLTERRA Admin Demo, localStorage ebike_bikes
(function(){
  const STORAGE_KEY = 'ebike_bikes';
  const BOOKINGS_KEY = 'ebike_bookings';
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?q=80&w=400&auto=format&fit=crop';

  function loadFromStorage(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(raw){
        const parsed = JSON.parse(raw);
        if(Array.isArray(parsed) && parsed.length) return parsed;
      }
    }catch(e){}
    // convert base BIKES to admin structure
    return (window.BIKES||[]).map(b=> normalizeBike(b));
  }

  function normalizeBike(b){
    // map existing fields to admin schema
    return {
      id: b.id,
      brand: b.brand,
      model: b.model,
      price: b.price,
      year: b.year,
      mileage: b.mileage || 0,
      battery: b.batteryLabel || (b.battery ? `${b.battery} Wh` : '—'),
      batteryRaw: typeof b.battery === 'number' ? b.battery : parseInt(b.battery)||0,
      frameSize: b.frameSize || 'M',
      condition: b.condition || 'Good',
      status: b.status || 'Available',
      image: b.fallback || b.image || FALLBACK_IMG,
      description: b.description || '',
      fallback: b.fallback || FALLBACK_IMG
    };
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

  function renderStats(){
    const total = bikes.length;
    const avail = bikes.filter(b=> b.status==='Available').length;
    const sold = bikes.filter(b=> b.status==='Sold').length;
    const avg = total ? Math.round(bikes.reduce((s,b)=> s + (Number(b.price)||0),0)/total) : 0;
    $('#statTotal').textContent = total;
    $('#statAvail').textContent = avail;
    $('#statSold').textContent = sold;
    $('#statAvg').textContent = avg ? `$${avg.toLocaleString()}` : '$0';
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
    emptyState.style.display = has ? 'none' : 'block';
    tableWrap.style.display = has ? 'block' : 'none';
    // bookings badge
    const bookings = getBookings();
    const badge = $('#bookingCountBadge');
    if(bookings.length){ badge.textContent=bookings.length; badge.style.display='grid'; } else badge.style.display='none';
    if(currentTab==='bookings') renderBookings();
  }

  function renderTable(data){
    tableBody.innerHTML = data.map(b=>`
      <tr>
        <td><div class="bike-cell"><img src="${escapeAttr(b.image)}" alt="${escapeAttr(b.brand)} ${escapeAttr(b.model)}" onerror="this.src='${FALLBACK_IMG}'"><div><b>${esc(b.brand)} ${esc(b.model)}</b><span>${b.year} · ${b.mileage} km</span></div></div></td>
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
    cards.innerHTML = data.map(b=>`
      <div class="bike-card">
        <img src="${escapeAttr(b.image)}" alt="" onerror="this.src='${FALLBACK_IMG}'">
        <div class="meta">
          <div style="display:flex;justify-content:space-between;gap:8px"><b>${esc(b.brand)} ${esc(b.model)}</b><span class="price">$${Number(b.price).toLocaleString()}</span></div>
          <div style="font-size:11px;color:var(--color-text-secondary)">${b.year} · ${b.mileage} km · ${esc(b.battery)} · ${esc(b.frameSize)}</div>
          <div style="margin-top:6px;display:flex;gap:6px"><span class="badge ${b.condition.toLowerCase()}">${esc(b.condition)}</span><span class="badge ${b.status==='Available'?'available':'sold'}">${esc(b.status)}</span></div>
          <div class="row"><button class="btn-secondary" data-edit="${b.id}" style="padding:8px 12px;font-size:12px"><i class="fa-solid fa-pen"></i> Edit</button><button class="btn-secondary" data-del="${b.id}" style="padding:8px 12px;font-size:12px"><i class="fa-solid fa-trash"></i> Delete</button></div>
        </div>
      </div>
    `).join('');
  }

  function esc(s){ return String(s||'').replace(/[&<>"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
  function escapeAttr(s){ return esc(s).replace(/"/g,'&quot;'); }

  // Modal handling
  const bikeModal = $('#bikeModal');
  const deleteModal = $('#deleteModal');

  function openModal(){ bikeModal.classList.add('open'); bikeModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  function closeModal(){ bikeModal.classList.remove('open'); bikeModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; editingId=null; clearValidation(); }
  function openDeleteModal(id){
    const bike = bikes.find(b=> String(b.id)===String(id));
    if(!bike) return;
    deletingId=id;
    $('#deleteName').textContent = `${bike.brand} ${bike.model}`;
    deleteModal.classList.add('open'); deleteModal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  }
  function closeDeleteModal(){ deleteModal.classList.remove('open'); deleteModal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deletingId=null; }

  function clearValidation(){ document.querySelectorAll('.field.invalid').forEach(f=> f.classList.remove('invalid')); }

  function validateForm(){
    let ok=true;
    const brand = $('#inputBrand').value.trim();
    const model = $('#inputModel').value.trim();
    const price = Number($('#inputPrice').value);
    const year = Number($('#inputYear').value);
    const mileage = $('#inputMileage').value==='' ? 0 : Number($('#inputMileage').value);

    function setInvalid(id, cond){ const el=document.getElementById(id); if(cond){ el.classList.add('invalid'); ok=false; } else el.classList.remove('invalid'); }

    setInvalid('f-brand', !brand);
    setInvalid('f-model', !model);
    setInvalid('f-price', !price || isNaN(price) || price<=0);
    setInvalid('f-year', !year || year<2015 || year>2026);
    setInvalid('f-mileage', isNaN(mileage) || mileage<0);
    return ok;
  }

  function collectForm(){
    const img = $('#inputImage').value.trim() || FALLBACK_IMG;
    return {
      brand: $('#inputBrand').value.trim(),
      model: $('#inputModel').value.trim(),
      price: Number($('#inputPrice').value),
      year: Number($('#inputYear').value),
      mileage: Number($('#inputMileage').value)||0,
      battery: $('#inputBattery').value.trim() || '—',
      frameSize: $('#inputFrame').value,
      condition: $('#inputCondition').value,
      status: $('#inputStatus').value,
      image: img,
      description: $('#inputDesc').value.trim(),
      fallback: img
    };
  }

  function openAddModal(){
    editingId=null;
    $('#modalTitle').textContent='Add Bike';
    $('#saveText').textContent='Add Bike';
    $('#inputImage').value=''; $('#inputBrand').value=''; $('#inputModel').value=''; $('#inputPrice').value=''; $('#inputYear').value=new Date().getFullYear(); $('#inputMileage').value=''; $('#inputBattery').value=''; $('#inputFrame').value='M'; $('#inputCondition').value='Excellent'; $('#inputStatus').value='Available'; $('#inputDesc').value='';
    openModal();
  }

  function openEditModal(id){
    const bike = bikes.find(b=> String(b.id)===String(id));
    if(!bike) return;
    editingId=id;
    $('#modalTitle').textContent='Edit Bike';
    $('#saveText').textContent='Save Changes';
    $('#inputImage').value = bike.image===FALLBACK_IMG ? '' : bike.image;
    $('#inputBrand').value=bike.brand; $('#inputModel').value=bike.model; $('#inputPrice').value=bike.price; $('#inputYear').value=bike.year; $('#inputMileage').value=bike.mileage; $('#inputBattery').value=bike.battery; $('#inputFrame').value=bike.frameSize; $('#inputCondition').value=bike.condition; $('#inputStatus').value=bike.status; $('#inputDesc').value=bike.description||'';
    openModal();
  }

  function saveBike(){
    if(!validateForm()){ showToast('Please fix highlighted fields','fa-circle-exclamation'); return; }
    const data = collectForm();
    if(editingId){
      const idx = bikes.findIndex(b=> String(b.id)===String(editingId));
      if(idx>=0){
        bikes[idx] = { ...bikes[idx], ...data, id:bikes[idx].id };
        showToast('Bike updated successfully','fa-circle-check');
      }
    } else {
      const newId = bikes.length ? Math.max(...bikes.map(b=> Number(b.id)||0))+1 : 1;
      const newBike = { id:newId, ...data };
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

  // Toast
  function showToast(msg, icon='fa-circle-check'){
    const wrap=$('#toastWrap');
    const el=document.createElement('div');
    el.className='toast';
    el.innerHTML=`<i class="fa-solid ${icon}"></i><span>${esc(msg)}</span>`;
    wrap.appendChild(el);
    setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(8px)'; setTimeout(()=> el.remove(), 280); }, 2600);
  }

  // Bookings
  function getBookings(){ try{ return JSON.parse(localStorage.getItem(BOOKINGS_KEY)||'[]'); }catch{ return []; } }
  function renderBookings(){
    const list=$('#bookingsList');
    const data=getBookings();
    if(!data.length){ list.innerHTML='<div class="empty" style="padding:24px"><p>No booking requests yet. Book a service from book-service.html</p></div>'; return; }
    list.innerHTML=data.slice().reverse().map(b=>`
      <div class="booking-card">
        <div><b>${esc(b.name)} · ${esc(b.service)}</b><span>${esc(b.bikeBrand)} ${esc(b.bikeModel)} · ${esc(b.date)} ${esc(b.time)}</span><span>${esc(b.email)} · ${esc(b.phone)}</span></div>
        <div style="text-align:right"><span class="badge available">${esc(b.id)}</span><span style="margin-top:6px;display:block;font-size:11px">${new Date(b.createdAt).toLocaleDateString()}</span></div>
      </div>
    `).join('');
  }

  // Tabs
  function setTab(tab){
    currentTab=tab;
    document.querySelectorAll('.side-link[data-tab]').forEach(l=> l.classList.toggle('active', l.dataset.tab===tab));
    if(tab==='bookings'){
      $('#inventoryToolbar').style.display='none'; $('#tableWrap').style.display='none'; $('#cards').style.display='none'; $('#emptyState').style.display='none'; $('#stats').style.display='none'; $('#bookingsSection').style.display='block'; renderBookings();
    } else {
      $('#bookingsSection').style.display='none'; $('#inventoryToolbar').style.display='flex'; $('#stats').style.display='grid'; render();
    }
  }

  // Events
  searchInput.addEventListener('input', e=>{ filterQ=e.target.value; render(); });
  statusFilter.addEventListener('change', e=>{ filterStatus=e.target.value; render(); });
  conditionFilter.addEventListener('change', e=>{ filterCondition=e.target.value; render(); });

  document.getElementById('openAdd').addEventListener('click', openAddModal);
  document.getElementById('openAddFromSide').addEventListener('click', openAddModal);
  document.getElementById('emptyAdd').addEventListener('click', openAddModal);
  document.getElementById('closeModal').addEventListener('click', closeModal);
  document.getElementById('cancelModal').addEventListener('click', closeModal);
  document.getElementById('saveModal').addEventListener('click', saveBike);
  bikeModal.addEventListener('click', e=>{ if(e.target===bikeModal) closeModal(); });

  document.getElementById('closeDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDelete').addEventListener('click', confirmDelete);
  deleteModal.addEventListener('click', e=>{ if(e.target===deleteModal) closeDeleteModal(); });

  document.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeModal(); closeDeleteModal(); } });

  // delegated edit/delete
  document.addEventListener('click', e=>{
    const editBtn = e.target.closest('[data-edit]');
    if(editBtn){ openEditModal(editBtn.dataset.edit); return; }
    const delBtn = e.target.closest('[data-del]');
    if(delBtn){ openDeleteModal(delBtn.dataset.del); return; }
  });

  // sidebar tabs
  document.querySelectorAll('.side-link[data-tab]').forEach(btn=> btn.addEventListener('click', ()=> setTab(btn.dataset.tab)));

  // reset demo data
  document.getElementById('resetData').addEventListener('click', ()=>{
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
