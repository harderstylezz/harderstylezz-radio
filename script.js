'use strict';
const data=window.HARDERSTYLEZZ_DATA;
const $=id=>document.getElementById(id);
function safeUrl(value){try{const u=new URL(value);return ['https:','http:','mailto:'].includes(u.protocol)?value:null}catch{return null}}
function assignLink(id,url){const el=$(id),safe=safeUrl(url);if(!el)return;if(safe){el.href=safe}else{el.removeAttribute('href');el.setAttribute('aria-disabled','true')}}
const links=data.links;
[['spotify-playlist',links.spotifyPlaylist],['youtube-playlist',links.youtubePlaylist],['spotify-artist',links.spotifyArtist],['all-albums',links.spotifyArtist],['all-singles',links.spotifyArtist],['community-link',links.community],['social-youtube',links.youtube],['social-spotify',links.spotifyArtist],['social-instagram',links.instagram],['social-tiktok',links.tiktok],['social-email',links.email]].forEach(([id,url])=>assignLink(id,url));
$('year').textContent=new Date().getFullYear();
function buildCovers(id,items){const root=$(id);root.replaceChildren();items.forEach((item)=>{
  const gated=Boolean(item.unlockAt);
  const card=document.createElement(gated?'article':(item.url?'a':'div'));card.className='cover'+(gated?' cover-gated':'');
  if(!gated&&item.url){const url=safeUrl(item.url);if(url){card.href=url;card.target='_blank';card.rel='noopener noreferrer'}}
  const art=document.createElement('div');art.className='cover-art';if(item.art){const img=document.createElement('img');img.src=item.art;img.alt=item.title+' cover artwork';img.loading='lazy';art.append(img)}else{const symbol=document.createElement('span');symbol.className='placeholder-symbol';symbol.textContent='✧';symbol.setAttribute('aria-hidden','true');art.append(symbol)}
  const title=document.createElement('p');title.className='cover-title';title.textContent=item.title;card.append(art,title);
  if(gated){
    if(item.subtitle){const subtitle=document.createElement('p');subtitle.className='cover-subtitle';subtitle.textContent=item.subtitle;card.append(subtitle)}
    const status=document.createElement('p');status.className='cover-release-status';
    const button=document.createElement('a');button.className='button show-button cover-release-button';button.textContent='COMING SOON · 20 NOV · 00:00';button.removeAttribute('href');button.setAttribute('aria-disabled','true');button.classList.add('show-locked');
    const releaseTime=new Date(item.unlockAt).getTime(),url=safeUrl(item.url);
    function updateCoverGate(){const remain=releaseTime-Date.now();if(remain<=0){status.hidden=true;button.textContent='▶ WATCH ON YOUTUBE ↗';button.classList.remove('show-locked');button.removeAttribute('aria-disabled');if(url){button.href=url;button.target='_blank';button.rel='noopener noreferrer'}}else{const total=Math.floor(remain/1000),d=Math.floor(total/86400),h=Math.floor(total%86400/3600),m=Math.floor(total%3600/60),sec=total%60;status.textContent=`AVAILABLE IN ${d}D ${h}H ${m}M ${sec}S`;button.textContent='AVAILABLE 20 NOVEMBER · 00:00 CET';button.removeAttribute('href');button.setAttribute('aria-disabled','true');button.classList.add('show-locked')}}
    updateCoverGate();card.append(status,button);if(Number.isFinite(releaseTime)&&Date.now()<releaseTime){const timer=setInterval(()=>{updateCoverGate();if(Date.now()>=releaseTime)clearInterval(timer)},1000)}
  }
  root.append(card)
})}
buildCovers('albums',data.albums);buildCovers('singles',data.singles);
const release=data.release; $('release-title').textContent=release.title.toUpperCase();$('release-description').textContent=release.description;$('release-art').src=release.artwork;
const date=new Date(release.date);const formatter=new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Amsterdam'});$('release-date').textContent=formatter.format(date).toUpperCase();
function updateCountdown(){const diff=date.getTime()-Date.now();if(diff<=0){$('countdown').hidden=true;$('released').hidden=false;if(release.link){assignLink('release-link',release.link);$('release-link').hidden=false}return}const seconds=Math.floor(diff/1000);const values=[Math.floor(seconds/86400),Math.floor(seconds%86400/3600),Math.floor(seconds%3600/60),seconds%60];['days','hours','minutes','seconds'].forEach((id,i)=>$(id).textContent=String(values[i]).padStart(2,'0'))}
updateCountdown();setInterval(updateCountdown,1000);
const menu=document.querySelector('.menu-toggle'),nav=$('nav');menu.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));

// Spotlight content can be changed monthly in site-data.js.
(function buildSpotlight(){const s=data.spotlight;if(!s)return;$('spotlight-art').src=s.art;$('spotlight-art').alt=s.title+' original cover artwork';$('spotlight-title').textContent=s.title.toUpperCase();$('spotlight-artist').textContent=s.artist.toUpperCase();const eyebrow=document.querySelector('#spotlight-track .eyebrow');if(eyebrow)eyebrow.textContent='MONTHLY FEATURE · '+s.month;assignLink('spotlight-link',s.url)})();
// Release gate uses an absolute timestamp (October 31, 2026 at 18:00 Europe/Amsterdam = UTC+01:00).
// Note: this is a front-end button lock, not a security restriction on a public YouTube video.
function buildShows(){const root=$('shows-grid');if(!root||!Array.isArray(data.shows))return;root.replaceChildren();data.shows.slice(0,6).forEach(item=>{const card=document.createElement('article');card.className='show-card';const art=document.createElement('img');art.src=item.art;art.alt=item.title+' original cover artwork';art.loading='lazy';const content=document.createElement('div');content.className='show-info';const category=document.createElement('span');category.className='eyebrow';category.textContent=item.category;const title=document.createElement('h3');title.textContent=item.title;const sub=document.createElement('p');sub.className='show-subtitle';sub.textContent=item.subtitle;const desc=document.createElement('p');desc.className='show-description';desc.textContent=item.description;const link=document.createElement('a');link.className='button show-button';const url=safeUrl(item.url);const releaseTime=item.unlockAt?new Date(item.unlockAt).getTime():null;const status=document.createElement('p');status.className='show-release-status';function updateGate(){const locked=releaseTime!==null&&Number.isFinite(releaseTime)&&Date.now()<releaseTime;if(locked){link.textContent='COMING SOON · '+new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Europe/Amsterdam'}).format(new Date(releaseTime)).toUpperCase();link.removeAttribute('href');link.removeAttribute('target');link.setAttribute('aria-disabled','true');link.classList.add('show-locked');const remain=releaseTime-Date.now();const days=Math.floor(remain/86400000),hours=Math.floor(remain%86400000/3600000),minutes=Math.floor(remain%3600000/60000),seconds=Math.floor(remain%60000/1000);status.textContent=`RELEASE IN ${days}D ${hours}H ${minutes}M ${seconds}S`;status.hidden=false}else{link.textContent='▶ WATCH ON YOUTUBE ↗';link.classList.remove('show-locked');link.removeAttribute('aria-disabled');status.hidden=true;if(url){link.href=url;link.target='_blank';link.rel='noopener noreferrer'}}}updateGate();if(releaseTime!==null&&Number.isFinite(releaseTime)&&Date.now()<releaseTime){const timer=setInterval(()=>{updateGate();if(Date.now()>=releaseTime)clearInterval(timer)},1000)}content.append(category,title,sub,desc,status,link);card.append(art,content);root.append(card)})}buildShows();

// Community score display, starting at 4,678 on 27 Oct 2026.
(function(){const el=document.getElementById('community-counter');if(!el)return;const start=Date.UTC(2026,9,27),day=86400000;const days=Math.max(0,Math.floor((Date.now()-start)/day));let count=4678;for(let i=0;i<days;i++){count+=8+((i*17+11)%18)}el.textContent=new Intl.NumberFormat('en-US').format(count)})();
// The news feed is pre-generated by GitHub Actions. No third-party scripts on visitors' devices.

