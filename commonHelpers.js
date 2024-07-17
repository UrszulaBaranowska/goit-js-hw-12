import{S as d,i as u}from"./assets/vendor-8c59ed88.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();const f="44933716-9a3a9b2f063fdc3971bf0291b",m="https://pixabay.com/api/",g=document.getElementById("search-form"),c=document.getElementById("gallery"),i=document.getElementById("loader"),y=r=>fetch(`${m}?key=${f}&q=${r}&image_type=photo&orientation=horizontal&safesearch=true`).then(e=>{if(!e.ok)throw new Error(e.status);return e.json()}),p=r=>r.map(e=>`
    <div class="gallery-item">
      <a href="${e.largeImageURL}" class="gallery-link">
        <img src="${e.webformatURL}" alt="${e.tags}" loading="lazy"/>
      </a>
      <div class="info">
        <p><strong>Likes:</strong> ${e.likes}</p>
        <p><strong>Views:</strong> ${e.views}</p>
        <p><strong>Comments:</strong> ${e.comments}</p>
        <p><strong>Downloads:</strong> ${e.downloads}</p>
      </div>
    </div>
  `).join(""),h=r=>{const e=p(r);c.innerHTML=e,new d(".gallery-link",{captionsData:"alt",captionDelay:250,captionPosition:"bottom"}).refresh()},l=r=>{u.error({title:"Error",message:r})},b=async r=>{r.preventDefault();const e=r.target.elements.query.value.trim();if(e){c.innerHTML="",i.style.display="flex";try{const s=(await y(e)).hits;s.length===0?l("Sorry, there are no images matching your search query. Please try again!"):h(s)}catch{l("Something went wrong. Please try again later.")}finally{i.style.display="none"}}};g.addEventListener("submit",b);
//# sourceMappingURL=commonHelpers.js.map
