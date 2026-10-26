const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#main-nav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
document.querySelector('#year').textContent=new Date().getFullYear();
function renderReleases(items,id){
 const container=document.getElementById(id);
 items.forEach(item=>{
  const a=document.createElement('a');a.className='release-item';a.target='_blank';a.rel='noopener noreferrer';
  a.href=item.url || ('https://open.spotify.com/search/'+encodeURIComponent(item.title+' HarderstyleZZ'));
  a.setAttribute('aria-label','Find '+item.title+' on Spotify');
  const img=document.createElement('img');img.src=item.image;img.alt=item.title+' cover';img.loading='lazy';
  const title=document.createElement('h4');title.textContent=item.title;
  const artist=document.createElement('small');artist.textContent='HarderstyleZZ';
  a.append(img,title,artist);container.append(a);
 });
}
renderReleases(albums,'albums-grid');renderReleases(singles,'singles-grid');
