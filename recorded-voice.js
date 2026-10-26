import{dotOpeningIntro as e,dotCrackOn as t}from"./dot-opening-dialogue.js"
;export const normalizePhrase=e=>String(e).trim().toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g," ").replace(/[.!?]+$/,"")
;const n=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],r=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],o=e=>e<20?n[e]:e<100?r[Math.floor(e/10)]+(e%10?"-"+n[e%10]:""):void 0,i=new Set([...Array.from({
length:100},(e,t)=>o(t)),"point"]);export function recordedParts(n,r,{crack:c=!1,discovery:a=!1,dial:s=!1,templates:l=[]}={}){
const d=(e,t)=>e&&(!e.scope||s||"crack"===e.scope&&c||"discovery"===e.scope&&a||a&&i.has(t)),u=e=>{const t=normalizePhrase(e),n=r.get(t);if(d(n,t))return n;if(!c&&!a&&!s)return
;const i=t.replace(/\b\d+\b/g,e=>o(Number(e))??e),l=r.get(i);return d(l,i)?l:void 0},f=u(n);if(f)return[f];if(c){
const e="Follow my instructions. Remember - a deliberate and steady hand wins the day. To indicate direction I will just say, “Go clock” or “Go anti.”",t="Let’s crack on, shall we."
;for(const[o,i]of[["Good morning.","DOT001"],["Good afternoon.","DOT002"],["Good evening.","DOT003"],["Hello.","DOT004"]])if(n===`${o} ${e} ${t}`){
const e=e=>Array.from(r.values()).find(t=>t.id===e),t=[e(i),e("CRACK_INTRO"),e("DOT006")];return t.every(Boolean)?t:null}}if(s){
for(const o of["Good morning.","Good afternoon.","Good evening.","Hello."]){const i=`${o} ${e} ${t} `;if(String(n).startsWith(i)){
const c=[o,e,t].map(u),a=recordedParts(String(n).slice(i.length),r,{dial:!0});return c.every(Boolean)&&a?[...c,...a]:null}}
const i=String(n).match(/^Go (anti|clock) for (\d{1,2}) dot appearances\.$/);if(i){const e=[`Go ${i[1]} for`,o(Number(i[2])),"dot appearances."].map(u)
;return e.every(Boolean)?e:null}const c=String(n).search(/[.!?]\s+/);if(c>=0){const e=recordedParts(String(n).slice(0,c+1),r,{dial:!0
}),t=recordedParts(String(n).slice(c+1).trim(),r,{dial:!0});return e&&t?[...e,...t]:null}return null}if(a){
const e=normalizePhrase(n).replace(/\bwheel (\d)\b/g,(e,t)=>"wheel "+o(Number(t))),t=e=>e.replace(/[.*+?^$()|[\]\\]/g,"\\$&");for(const n of l){
const i=normalizePhrase(n.text),c=[],a=i.split(/(\{\w+\})/).map(e=>e.startsWith("{")?(c.push(e.slice(1,-1)),
"(\\d{1,2}(?:\\.\\d{1,2})?)"):t(e)).join(""),s=e.match(new RegExp("^"+a+"$"));if(!s)continue;const l=Object.fromEntries(c.map((e,t)=>[e,s[t+1]])),d=[]
;for(const e of n.assembly)if(e.clip){const t=Array.from(r.values()).find(t=>t.id===e.clip&&"discovery"===t.scope);if(!t)return null;d.push(t)}else{const t=l[e.variable]
;if(!t)return null;const[n,r]=t.split("."),i=[o(Number(n)),...r?["point",...r.split("").map(e=>o(Number(e)))]:[]];for(const e of i){const t=u(e);if(!t)return null;d.push(t)}}
return d}const i=String(n).search(/[.!?]\s+/);if(i>=0){const e=recordedParts(String(n).slice(0,i+1),r,{discovery:a,templates:l}),t=recordedParts(String(n).slice(i+1).trim(),r,{
discovery:a,templates:l});return e&&t?[...e,...t]:null}return null}if(c){
const e=String(n).match(/^Wheel four matches the clockwise gate near (\d{1,2})\.(\d)\. Three readings remain\.$/i);if(e){
const t=["Wheel four matches the clockwise gate near",o(Number(e[1])),"Point.",o(Number(e[2])),"Three readings remain."].map(e=>e&&u(e));return t.every(Boolean)?t:null}}
const h=(String(n).match(/[^.!?]+[.!?]?/g)??[]).map(u);return h.length&&h.every(Boolean)?h:null}
export function setupRecordedVoice({sounds:e,doc:t=document,win:n=window,fetcher:r=fetch,storage:o=null}={}){
const i=e=>t.getElementById(e),c=i("voice-status"),a=i("voice-enabled"),s=i("voice-test"),l=i("voice-stop"),d=i("voice-volume"),u=i("voice-phrase");try{o??=n.localStorage}catch{}
const f=e=>{try{return o?.getItem(e)}catch{return null}},h=(e,t)=>{try{o?.setItem(e,t)}catch{}};a.checked="false"!==f("safecrack.voiceEnabled"),
d&&(d.value=f("safecrack.recordedVoiceVolume")??".8");const m=new Map,p=new Map,g=new Set;let v=[],y=0,b=null,w=null,k=null,S=!1;function x(e="Voice stopped."){y++;const t=b
;if(b=null,t){t.source.onended=null;try{t.source.stop()}catch{}t.source.disconnect()}l.disabled=!0,e&&(c.textContent=e)}const E=r("./audio/jennifer/manifest.json").then(e=>{
if(!e.ok)throw Error("Voice manifest unavailable");return e.json()}).then(async e=>(v=e.discoveryTemplates??[],await Promise.all(e.clips.map(async e=>{
const t=await r("./audio/jennifer/"+e.file);if(!t.ok)throw Error("Voice clip unavailable: "+e.file);const n=await t.arrayBuffer(),o=normalizePhrase(e.text)
;m.has(o)&&e.scope||m.set(o,{...e,bytes:n})
})),S=!0,s.disabled=!a.checked,c.textContent="Jennifer ready. Recorded instructions mix with the lock sounds; unrecorded instructions appear as text.",
!0)).catch(e=>(c.textContent=e.message,!1));function P(t,n={}){if(!a.checked||!S)return!1;const r=recordedParts(t,m,{...n,templates:v});if(!r)return g.add(t),
c.textContent="Caption only — this instruction has not been recorded yet.",!1;if(b&&!1===n.interrupt)return!1;x(null);const o=y;return b={source:{stop(){},disconnect(){}}},
l.disabled=!1,(async()=>{try{if(await e.enable(),o!==y)return;const a=e.context;i("sound-enabled").checked||(e.enabled=!1),k!==a&&(w?.disconnect(),w=a.createGain(),
w.connect(a.destination),k=a,p.clear()),w.gain.value=Number(d?.value??.8);const s=[];for(const e of r){if(p.has(e.file)||p.set(e.file,await a.decodeAudioData(e.bytes.slice(0))),
o!==y)return;s.push(p.get(e.file))}const u=e=>{if(o!==y)return;if(e===s.length)return b=null,l.disabled=!0,c.textContent="Ready.",void n.onDone?.();const r=a.createBufferSource()
;r.buffer=s[e],r.connect(w),b={source:r},r.onended=()=>{r.disconnect(),o===y&&u(e+1)},c.textContent="Speaking: "+t,r.start()};u(0)}catch(e){if(o!==y)return
;x("Voice unavailable: "+e.message),n.onDone?.()}})(),!0}return s.disabled=!0,l.disabled=!0,s.addEventListener("click",()=>P(u.value,{crack:!0})),
l.addEventListener("click",()=>x()),a.addEventListener("change",()=>{x(a.checked?"Voice on.":"Voice off."),h("safecrack.voiceEnabled",String(a.checked)),s.disabled=!S||!a.checked
}),d?.addEventListener("input",()=>{w&&(w.gain.value=Number(d.value)),h("safecrack.recordedVoiceVolume",d.value)}),n.addEventListener("hashchange",()=>x(null)),
t.addEventListener("visibilitychange",()=>{t.hidden&&x(null)}),{speak:P,cancel:x,beginSession:function(){return x(null),a.checked=!0,h("safecrack.voiceEnabled","true"),S},
isBusy:()=>null!==b,loading:E,missing:g}}
