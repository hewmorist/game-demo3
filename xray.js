import{roundedWheelReading as e,settingReadable as t}from"./wheel-pack.js";export function setupXray(n,{doc:a=document,win:i=window,available:r=()=>!0}={}){
const l=e=>a.getElementById(e),d=l("xray-panel"),s=l("xray-handle"),o=l("xray-open"),c=l("xray-close"),h=l("xray-art");let x=null;const g=(e,t,n,a)=>{const i=(e-90)*Math.PI/180
;return[n+t*Math.cos(i),a+t*Math.sin(i)]},p=(e,t,n,a,i,r="none")=>{const[l,d]=g(e,t,n,a);return`<circle cx="${l}" cy="${d}" r="3.5" fill="${i}" stroke="${r}" stroke-width="2"/>`}
;function y(){if(!r())return void $();if(d.hidden)return;const a=n.snapshot(),i=89
;let s=`<line x1="48" y1="89" x2="${4===a.wheels.length?468:368}" y2="89" stroke="#8b9a89" stroke-width="3" stroke-dasharray="3 5"/>`
;s+='<circle cx="49" cy="89" r="33" fill="#254039" stroke="#d6b06a" stroke-width="3"/>';const o=g(a.dial,27,49,i)
;s+=`<line x1="49" y1="89" x2="${o[0]}" y2="${o[1]}" stroke="#d6b06a" stroke-width="3"/>${p(a.dial,27,49,i,"#f4d48b")}`,
s+='<text x="49" y="151" text-anchor="middle">Drive</text><text x="49" y="169" text-anchor="middle" class="xray-small">Dial shaft</text>',a.wheels.forEach((e,t)=>{
const n=150+t*(4===a.wheels.length?100:105),r=e.moving?"#edc371":e.aligned?"#a9cf9d":"#79928a"
;s+=`<circle cx="${n}" cy="89" r="36" fill="#213c36" stroke="${r}" stroke-width="10"/>`,s+=`<path d="M${n-5} 46h10v17h-10z" fill="#102b29" transform="rotate(${e.gate} ${n} 89)"/>`,
s+=`<line x1="${n}" y1="89" x2="${g(e.angle,18,n,i)[0]}" y2="${g(e.angle,18,n,i)[1]}" stroke="${r}" stroke-width="2"/>`,
s+=p(e.angle+180,26,n,i,"#c69462")+p(e.parent,26,n,i,"none","#f4d48b")+p(e.angle,34,n,i,"#e4c279"),
s+=`<text x="${n}" y="151" text-anchor="middle">Wheel ${a.wheels.length-t}</text><text x="${n}" y="169" text-anchor="middle" class="xray-small">${0===t?"Nearest":t===a.wheels.length-1?"Farthest":`Position ${t+1}`}</text>`,
s+=`<text x="${n}" y="191" text-anchor="middle" class="xray-small">${e.candidate?"Candidate placed":e.saved?"Setting saved":e.moving?"Turning":Math.min(e.gate,360-e.gate)<.025?"Gate centred":e.aligned?"Gate aligned":"Resting"}</text>`
});const c=a.fenceDown?52:39
;s+=`<path d="M138 ${c}h${(a.wheels.length-1)*(4===a.wheels.length?100:105)+24}${a.wheels.map((e,t)=>`M${150+t*(4===a.wheels.length?100:105)} ${c}v12`).join("")}" fill="none" stroke="${a.fenceDown?"#bde4a8":"#c6c4a6"}" stroke-width="5"/>`,
s+=`<text x="255" y="21" text-anchor="middle" class="xray-small">${a.fenceDown?"Fence down":"Fence waiting for all gates"}</text>`,
s+=`<rect x="121" y="207" width="226" height="10" rx="3" fill="#243f39"/><rect x="${121+55*a.bolt}" y="207" width="170" height="10" rx="3" fill="#c6ad73"/>`,
s+=`<text x="255" y="237" text-anchor="middle" class="xray-small">${a.open?"Bolt retracted · OPEN":a.bolt>0?"Bolt retracting":"Bolt locked"}</text>`,h.innerHTML=s,
l("xray-wheels").innerHTML=a.wheels.map((i,r)=>{const l=String(e(i.angle,n.initial[r])).padStart(2,"0"),d=Math.min(i.gate,360-i.gate)<.025,s=t(i.gate)
;return`<div class="${s?"centred":""}"><span>Wheel ${a.wheels.length-r}</span><strong>${l}</strong><span>${d?"Gate centred":s?"Setting readable":"Wheel reading"}</span></div>`
}).join(""),
l("xray-reading").innerHTML=`<span class="model-index">Index <strong>${((-a.dial/3.6%100+100)%100).toFixed(1)}</strong></span><span class="model-turning">${a.wheels.filter(e=>e.moving).length} wheels turning</span>`
}function $(){d.hidden=!0,o.setAttribute("aria-expanded","false"),x=null}o.addEventListener("click",()=>{r()?(d.hidden=!d.hidden,o.setAttribute("aria-expanded",String(!d.hidden)),
y()):$()}),c.addEventListener("click",$),s.addEventListener("pointerdown",e=>{if(void 0!==e.button&&0!==e.button)return;e.preventDefault();const t=d.getBoundingClientRect();x={
id:e.pointerId,x:e.clientX-t.left,y:e.clientY-t.top},s.setPointerCapture(e.pointerId)}),s.addEventListener("pointermove",e=>{if(!x||x.id!==e.pointerId)return
;const t=d.getBoundingClientRect();d.style.left=`${Math.max(4,Math.min(i.innerWidth-t.width-4,e.clientX-x.x))}px`,
d.style.top=`${Math.max(4,Math.min(i.innerHeight-50,e.clientY-x.y))}px`,d.style.right="auto"})
;for(const e of["pointerup","pointercancel","lostpointercapture"])s.addEventListener(e,()=>{x=null});return a.addEventListener("keydown",e=>{"Escape"!==e.key||d.hidden||($(),
o.focus())}),i.addEventListener("resize",()=>{r()?d.hidden||(d.style.left="",d.style.top="",d.style.right=""):$()}),{render:y,show:function(){r()?(d.hidden=!1,
o.setAttribute("aria-expanded","true"),y()):$()},hide:$}}
