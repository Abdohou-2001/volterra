// VOLTERRA bikes.js — inventory logic, vanilla JS only
(function(){
  const $ = (s, r=document)=> r.querySelector(s);
  const $$ = (s, r=document)=> [...r.querySelectorAll(s)];

  const state = {
    q: '', brand:'all', condition:'all', battery:'all', year:'all', price:'all', sort:'recommended'
  };

  const grid = $('#bikeGrid');
  const countEl = $('#resultCount');
  const clearBtn = $('#clearFilters');
  const emptyEl = $('#emptyState');
  const searchInput = $('#searchInput');

  const brandSelect = $('#brandFilter');
  const condSelect = $('#conditionFilter');
  const battSelect = $('#batteryFilter');
  const yearSelect = $('#yearFilter');
  const priceSelect = $('#priceFilter');
  const sortSelect = $('#sortFilter');

  const filterSheet = $('#filterSheet');
  const filterBackdrop = $('#filterBackdrop');

  function initFiltersFromData(){
    const brands = [...new Set(BIKES.map(b=>b.brand))].sort();
    brands.forEach(b=>{
      const o=document.createElement('option'); o.value=b; o.textContent=b; brandSelect.appendChild(o);
    });
  }

  function readURL(){
    const p = new URLSearchParams(location.search);
    if(p.get('brand')) state.brand = p.get('brand');
    if(p.get('condition')) state.condition = p.get('condition');
    if(p.get('battery')) state.battery = p.get('battery');
    if(p.get('year')) state.year = p.get('year');
    if(p.get('price')) state.price = p.get('price');
    if(p.get('sort')) state.sort = p.get('sort');
    if(p.get('q')) state.q = p.get('q');
  }

  function writeURL(){
    const p = new URLSearchParams();
    if(state.q) p.set('q', state.q);
    if(state.brand!=='all') p.set('brand', state.brand);
    if(state.condition!=='all') p.set('condition', state.condition);
    if(state.battery!=='all') p.set('battery', state.battery);
    if(state.year!=='all') p.set('year', state.year);
    if(state.price!=='all') p.set('price', state.price);
    if(state.sort!=='recommended') p.set('sort', state.sort);
    const qs = p.toString();
    history.replaceState(null,'', qs ? `bikes.html?${qs}` : 'bikes.html');
  }

  function syncUI(){
    searchInput.value = state.q;
    brandSelect.value = state.brand;
    condSelect.value = state.condition;
    battSelect.value = state.battery;
    yearSelect.value = state.year;
    priceSelect.value = state.price;
    sortSelect.value = state.sort;
    const anyActive = state.q || state.brand!=='all' || state.condition!=='all' || state.battery!=='all' || state.year!=='all' || state.price!=='all';
    clearBtn.style.display = anyActive ? 'inline-flex' : 'none';
    // update mobile filter count badge
    const activeCount = [state.brand,state.condition,state.battery,state.year,state.price].filter(v=>v!=='all').length + (state.q?1:0);
    const badge = $('#filterCountBadge');
    if(badge){ badge.textContent = activeCount; badge.style.display = activeCount ? 'grid' : 'none'; }
  }

  function filtered(){
    let out = [...BIKES];
    if(state.q){
      const q = state.q.toLowerCase();
      out = out.filter(b=> `${b.brand} ${b.model}`.toLowerCase().includes(q));
    }
    if(state.brand!=='all') out = out.filter(b=> b.brand===state.brand);
    if(state.condition!=='all') out = out.filter(b=> b.condition===state.condition);
    if(state.battery!=='all'){
      if(state.battery==='360') out = out.filter(b=> b.battery<=400);
      if(state.battery==='500') out = out.filter(b=> b.battery>400 && b.battery<=625);
      if(state.battery==='750') out = out.filter(b=> b.battery>625 && b.battery<=800);
      if(state.battery==='1000') out = out.filter(b=> b.battery>800);
    }
    if(state.year!=='all') out = out.filter(b=> String(b.year)===state.year);
    if(state.price!=='all'){
      if(state.price==='under2000') out = out.filter(b=> b.price<2000);
      if(state.price==='2000-3000') out = out.filter(b=> b.price>=2000 && b.price<=3000);
      if(state.price==='3000-4000') out = out.filter(b=> b.price>3000 && b.price<=4000);
      if(state.price==='over4000') out = out.filter(b=> b.price>4000);
    }
    // sort
    if(state.sort==='price-low') out.sort((a,b)=> a.price-b.price);
    else if(state.sort==='price-high') out.sort((a,b)=> b.price-a.price);
    else if(state.sort==='newest') out.sort((a,b)=> b.year-a.year);
    else if(state.sort==='mileage') out.sort((a,b)=> a.mileage-b.mileage);
    // recommended keeps original order
    return out;
  }

  function cardHTML(b){
    const condClass = b.condition==='Excellent' ? 'excellent' : b.condition==='Great' ? 'great' : 'good';
    return `
    <article class="bike-card" data-id="${b.id}">
      <div class="bike-img">
        <span class="badge ${condClass}">${b.conditionTag || b.condition}</span>
        <img src="${b.image}" data-fallback="${b.fallback}" alt="${b.brand} ${b.model}" loading="lazy" onerror="this.onerror=null;this.src=this.dataset.fallback">
      </div>
      <div class="bike-body">
        <div class="bike-brand">${b.brand}</div>
        <div class="bike-name">${b.model}</div>
        <div class="bike-specs">
          <span>${b.year}</span><span class="dot"></span>
          <span>${b.mileage.toLocaleString()} km</span><span class="dot"></span>
          <span>${b.batteryLabel}</span><span class="dot"></span>
          <span>${b.frameSize}</span>
        </div>
        <div class="bike-foot">
          <span class="bike-price">$${b.price.toLocaleString()}</span>
          <a class="bike-link" href="bike-details.html?id=${b.id}">View Details <i class="fa-solid fa-arrow-right"></i></a>
        </div>
      </div>
    </article>`;
  }

  function render(){
    const data = filtered();
    grid.innerHTML = data.map(cardHTML).join('');
    countEl.textContent = `${data.length} ${data.length===1?'E-Bike':'E-Bikes'} Available`;
    emptyEl.style.display = data.length ? 'none' : 'block';
    grid.style.display = data.length ? 'grid' : 'none';
    writeURL();
    syncUI();
  }

  function showSkeletons(){
    grid.innerHTML = Array(8).fill(0).map(()=>`
      <div class="bike-card skeleton">
        <div class="bike-img" style="background:#E8EAE5"></div>
        <div class="bike-body"><div style="height:14px;width:40%;background:#E8EAE5;border-radius:6px;margin-bottom:10px"></div><div style="height:18px;width:70%;background:#E8EAE5;border-radius:6px"></div></div>
      </div>`).join('');
  }

  // events
  function attach(){
    searchInput.addEventListener('input', e=>{ state.q=e.target.value.trim(); render(); });
    brandSelect.addEventListener('change', e=>{ state.brand=e.target.value; render(); });
    condSelect.addEventListener('change', e=>{ state.condition=e.target.value; render(); });
    battSelect.addEventListener('change', e=>{ state.battery=e.target.value; render(); });
    yearSelect.addEventListener('change', e=>{ state.year=e.target.value; render(); });
    priceSelect.addEventListener('change', e=>{ state.price=e.target.value; render(); });
    sortSelect.addEventListener('change', e=>{ state.sort=e.target.value; render(); });
    clearBtn.addEventListener('click', ()=>{
      state.q=''; state.brand='all'; state.condition='all'; state.battery='all'; state.year='all'; state.price='all'; state.sort='recommended';
      render(); searchInput.focus();
    });
    $('#emptyClear')?.addEventListener('click', ()=>{ state.q=''; state.brand='all'; state.condition='all'; state.battery='all'; state.year='all'; state.price='all'; render(); });

    // mobile filter sheet
    const openBtn = $('#openFilters');
    const closeBtn = $('#closeFilters');
    function openSheet(){ filterSheet.classList.add('open'); filterBackdrop.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeSheet(){ filterSheet.classList.remove('open'); filterBackdrop.classList.remove('open'); document.body.style.overflow=''; }
    openBtn?.addEventListener('click', openSheet);
    closeBtn?.addEventListener('click', closeSheet);
    filterBackdrop?.addEventListener('click', closeSheet);
  }

  // boot
  initFiltersFromData();
  readURL();
  syncUI();
  attach();
  showSkeletons();
  setTimeout(render, 320); // subtle loading

  // drawer (same as index)
  const drawer = document.getElementById('drawer');
  document.getElementById('openMenu')?.addEventListener('click',()=> drawer.classList.add('open'));
  document.getElementById('closeMenu')?.addEventListener('click',()=> drawer.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a=> a.addEventListener('click',()=> drawer.classList.remove('open')));
})();
