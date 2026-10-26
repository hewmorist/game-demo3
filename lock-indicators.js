const e=e=>e>0?"Clock":"Anti",t=e=>(Math.round((-e/3.6%100+100)%100*100)/100%100).toFixed(2).padStart(5,"0");export function setupIndicators({doc:o=document}={}){
const n=e=>o.getElementById(e),s=new Map;let i;function r(){i={pickup:0,gate:0};for(const e of["pickup","gate"])clearTimeout(s.get(e)),
n(`sensor-${e}`).classList.remove("sensor-active"),n(`sensor-${e}-reading`).textContent="No event yet",n(`sensor-${e}-count`).textContent="0";n("sensor-positioned").hidden=!0,
n("sensor-positioned").classList.remove("sensor-active"),n("sensor-positioned-wheel").textContent="",n("sensor-positioned-reading").textContent="No trial position yet",
clearTimeout(s.get("positioned")),s.clear()}return r(),{record:function(o,{from:r,to:c}){const a=Math.sign(c-r);if(!a)return;const d={};for(const e of o){
if(!["pickup","gatepass"].includes(e.type)||!Number.isFinite(e.dial))continue;const t="pickup"===e.type?"pickup":"gate",o="gate"===t?e.count:1;if(!Number.isInteger(o)||o<1)continue
;i[t]+=o;const n=e.dial+(o-1)*a*360;(void 0===d[t]||(n-d[t])*a>0)&&(d[t]=n)}for(const o of Object.keys(d)){const r=n(`sensor-${o}`);clearTimeout(s.get(o)),
r.classList.add("sensor-active"),n(`sensor-${o}-reading`).textContent=`${e(a)} · ${t(d[o])}`,n(`sensor-${o}-count`).textContent=String(i[o]),
s.set(o,setTimeout(()=>r.classList.remove("sensor-active"),650))}},reset:r,positioned:function({wheel:o,trial:i,dial:r,direction:c}){const a=n("sensor-positioned")
;clearTimeout(s.get("positioned")),a.hidden=!1,a.classList.add("sensor-active"),n("sensor-positioned-wheel").textContent=`Wheel ${o}`,
n("sensor-positioned-reading").textContent=`Trial ${i}\n${e(c)} · ${t(r)}`,a.title=`Wheel ${o} · Trial ${i} · ${e(c)} · ${t(r)} · assignment to test`,
s.set("positioned",setTimeout(()=>a.classList.remove("sensor-active"),1600))}}}
