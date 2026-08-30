// VOLTERRA — Used E-Bikes listing
// Canonical inventory comes from data/bikes.js (window.BIKES/window.bikes).
(function(){
  const STORAGE_KEY='ebike_bikes';
  const grid=document.getElementById('bikeGrid');
  if(!grid) return;
  const $=id=>document.getElementById(id);
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const normalize=b=>({
    ...b,
    id:Number(b.id), price:Number(b.price)||0, year:Number(b.year)||0, mileage:Number(b.mileage)||0,
    batteryLabel:b.batteryLabel || (typeof b.battery==='number'?`${b.battery} Wh`:String(b.battery||'—')),
    condition:b.condition||'Good', conditionTag:b.conditionTag||b.condition||'Good',
    image:(b.image&&String(b.image).startsWith('assets/'))?b.image:`assets/images/bikes/bike-${b.id}.jpg`,
    images:Array.isArray(b.images)&&b.images.length?b.images:[`assets/images/bikes/bike-${b.id}.jpg`]
  });
  function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY));if(Array.isArray(x)&&x.length)return x.map(normalize)}catch(e){} return (window.BIKES||window.bikes||[]).map(normalize)}
  let all=load(), q='', brand='all', condition='all', battery='all', year='all', price='all', sort='featured';
  function fallback(img){if(img.dataset.failed)return;img.dataset.failed='1';const p=document.createElement('div');p.className='img-fallback';p.innerHTML='<i class="fa-solid fa-image"></i><span>Image coming soon</span>';p.style.cssText='position:absolute;inset:0;display:grid;place-items:center;background:#EEEDE8;color:#6B706C;font-size:11px;text-align:center';img.style.display='none';img.parentNode&&img.parentNode.appendChild(p)}
  function card(b){return `<article class="bike-card" data-id="${b.id}"><div class="bike-img"><span class="badge-card">${esc(b.conditionTag)}</span><img src="${esc(b.image)}" alt="${esc(b.brand+' '+b.model)}" loading="lazy" onerror="this.onerror=null;this.style.display='none';const p=document.createElement('div');p.className='img-fallback';p.textContent='Image coming soon';this.parentNode.appendChild(p)"></div><div class="bike-body"><div class="bike-brand">${esc(b.brand)} · ${b.year}</div><div class="bike-name">${esc(b.model)}</div><div class="bike-specs"><span>${b.mileage.toLocaleString()} km</span><span class="dot"></span><span>${esc(b.batteryLabel)}</span><span class="dot"></span><span>${esc(b.frameSize||'M')}</span></div><div class="bike-foot"><span class="bike-price">$${b.price.toLocaleString()}</span><a class="bike-link" href="bike-details.html?id=${b.id}">View Details <i class="fa-solid fa-arrow-right"></i></a></div></div></article>`}
  function pass(b){
    const text=(b.brand+' '+b.model).toLowerCase(); if(q&&!text.includes(q.toLowerCase()))return false;
    if(brand!=='all'&&b.brand!==brand)return false; if(condition!=='all'&&b.condition!==condition)return false;
    const bw=Number(b.battery)||parseInt(b.batteryLabel)||0; if(battery!=='all'){const n=Number(battery);if(n===360&&bw>400)return false;if(n===500&&(bw<401||bw>625))return false;if(n===750&&(bw<626||bw>800))return false;if(n===1000&&bw<=800)return false}
    if(year!=='all'&&String(b.year)!==year)return false; if(price==='under2000'&&b.price>=2000)return false;if(price==='2000-3000'&&(b.price<2000||b.price>3000))return false;if(price==='over3000'&&b.price<=3000)return false; return true;
  }
  function render(){let data=all.filter(pass); if(sort==='price-low')data.sort((a,b)=>a.price-b.price);if(sort==='price-high')data.sort((a,b)=>b.price-a.price);if(sort==='year-new')data.sort((a,b)=>b.year-a.year);grid.innerHTML=data.map(card).join('');$('resultCount')&&($('resultCount').textContent=`${data.length} e-bikes`);const empty=$('emptyState');if(empty)empty.style.display=data.length?'none':'block'}
  function bindSelect(id,fn){$(id)?.addEventListener('change',e=>{fn(e.target.value);render()})}
  const brands=[...new Set(all.map(b=>b.brand))].sort(); const bf=$('brandFilter');if(bf){bf.innerHTML='<option value="all">All brands</option>'+brands.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('')}
  $('searchInput')?.addEventListener('input',e=>{q=e.target.value.trim();render()}); bindSelect('brandFilter',v=>brand=v);bindSelect('conditionFilter',v=>condition=v);bindSelect('batteryFilter',v=>battery=v);bindSelect('yearFilter',v=>year=v);bindSelect('priceFilter',v=>price=v);bindSelect('sortFilter',v=>sort=v);
  $('clearFilters')?.addEventListener('click',()=>{q='';brand=condition=battery=year=price='all';sort='featured';document.querySelectorAll('#searchInput,#brandFilter,#conditionFilter,#batteryFilter,#yearFilter,#priceFilter,#sortFilter').forEach(e=>{if(e)e.value=e.id==='searchInput'?'':e.id==='brandFilter'?'all':e.id==='conditionFilter'?'all':e.id==='batteryFilter'?'all':e.id==='yearFilter'?'all':e.id==='priceFilter'?'all':'featured'});render()});
  $('emptyClear')?.addEventListener('click',()=>$('clearFilters')?.click());
  document.querySelectorAll('[data-sync]').forEach(el=>el.addEventListener('change',()=>{const t=$(el.dataset.sync);if(t){t.value=el.value;t.dispatchEvent(new Event('change'))}}));
  $('openFilters')?.addEventListener('click',()=>$('filterSheet')?.classList.add('open'));$('closeFilters')?.addEventListener('click',()=>$('filterSheet')?.classList.remove('open'));$('filterBackdrop')?.addEventListener('click',()=>$('filterSheet')?.classList.remove('open'));
  const drawer=$('drawer');$('openMenu')?.addEventListener('click',()=>drawer?.classList.add('open'));$('closeMenu')?.addEventListener('click',()=>drawer?.classList.remove('open'));drawer?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>drawer.classList.remove('open')));
  render();
})();
