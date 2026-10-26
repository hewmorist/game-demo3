import{WheelPack as e,TAB_PLAY as t,wrap as n}from"./wheel-pack.js";import{formatDial as s}from"./owner-guide.js";export const OPENING_TOLERANCE=1.8
;export function openingStopState(e,t,{preserveEarlier:n=!0}={}){const s=t.wheel?4-t.wheel:0;let r=-1;t.wheel&&n&&e.wheels.forEach((t,n)=>{n>s&&!e.gateAligned(n)&&(r=n)})
;const o=e.gateAligned(s),a=e.contacts.slice(0,s+1).every(e=>e===t.direction);return{aligned:o,directionOK:a,earlier:r,ready:o&&a&&r<0}}
export function openingRecoveryMessage(e,t,n){const s=openingStopState(e,t,n),r=t.direction<0?"anti":"clock",o=t.direction<0?"clock":"anti"
;return s.earlier>=0?`Wheel ${4-s.earlier}'s gate is out of alignment. You may restore it by turning freely, then reapproach wheel ${t.wheel??4}. Reset remains available if you prefer.`:s.aligned&&!s.directionOK?`${e.fenceDown?"The fence is down: all gates are aligned. ":`Wheel ${t.wheel??4}'s gate is aligned. `}For this recorded move, approach ${r}. Turn ${r} to take up the slack and reach this gate again. ${!1===n?.preserveEarlier?"Other wheels may move; their recorded readings are kept.":"Keep the earlier gates aligned."}`:`You passed the stop. To correct wheel ${t.wheel??4}, turn ${o} until that wheel is picked up and its gate is near the top, then turn ${r} to take up the slack and approach its gate again. A small reverse may only take up slack. Your earlier entries are kept; Reset is optional.`
}const r=t=>{const n=new e;return n.configureGates(t),n.alignmentTolerance=1e-5,n};export function directPlan(e,n=1,o=[]){
if(![1,-1].includes(n))throw Error("Invalid start direction");const a=r(e),i=o.map(e=>({wheel:null,direction:-1,target:e,number:s(e),appearance:Math.ceil(Math.abs(e)/360)}))
;let l=0,c=0;for(const e of i)a.turnTo(e.target,{emitPickups:!1}),c+=Math.abs(e.target-l),l=e.target;for(let o=0;o<e.length;o++){const u=e.length-1-o,p=n*(o%2?-1:1),g=[...a.wheels]
;let h=a.settingAngle(u,p);for(;(h-l)*p<=1e-7;)h+=360*p;for(;(h-l)*p>360+1e-7;)h-=360*p;const d=h;let f=null;for(;(h-l)*p<=e.length*t+360;h+=360*p){const t=r(e)
;for(const e of i)t.turnTo(e.target,{emitPickups:!1});t.turnTo(h,{emitPickups:!1})
;const n=t.contacts[u]===p&&Math.abs(t.wheels[u]-g[u])>1e-7,s=g.every((e,n)=>n<=u||Math.abs(t.wheels[n]-e)<1e-6);if(n&&s&&t.gateAligned(u)){f=h;break}}if(null===f)return{valid:!1,
startDirection:n,stops:i,total:null};c+=Math.abs(f-l),i.push({wheel:o+1,direction:p,target:f,number:s(f),appearance:Math.round((f-d)*p/360)+1}),a.turnTo(f,{emitPickups:!1}),l=f}
return{valid:a.fenceDown,startDirection:n,stops:i,total:c,turns:c/360}}export function anticlockwisePlan(e){const t=directPlan(e,-1);if(t.valid)return t
;let n=r(e).settingAngle(0,-1);for(;n>1e-7-360;)n-=360;return{...directPlan(e,1,[n]),startDirection:-1}}export function compareDirections(e){
const t=directPlan(e,1),n=directPlan(e,-1),s=t.valid?t.total:1/0,r=n.valid?n.total:1/0;return{clock:t,anti:n,
best:Number.isFinite(Math.min(s,r))?Math.abs(s-r)<1e-6?"equal":s<r?"clock":"anti":null}}export function verifyInstructions(e,t,s){
if(![1,-1].includes(t)||![e.length,e.length+1].includes(s.length))return{valid:!1,message:"Enter all four gate positions and appearance numbers."};const o=r(e)
;o.alignmentTolerance=1.825;let a=0,i=0;const l=s.length===e.length+1;for(let r=0;r<s.length;r++){
const c=l&&0===r?"clearing move":`wheel ${r+(l?0:1)}`,{number:u,appearance:p}=s[r],g=t*(r%2?-1:1),h=e.length-1-r+(l?1:0)
;if(!Number.isFinite(u)||u<0||u>=100||!Number.isInteger(p)||p<1||p>20)return{valid:!1,message:`Check the number and appearance count for ${c}.`};let d=n(3.6*-u)
;for(;(d-a)*g<=1e-7;)d+=360*g;for(;(d-a)*g>360+1e-7;)d-=360*g;d+=360*g*(p-1);const f=[...o.wheels];if(o.turnTo(d,{emitPickups:!1}),l&&0===r)i+=Math.abs(d-a),a=d;else{
if(o.contacts[h]!==g||Math.abs(o.wheels[h]-f[h])<1e-7||!o.gateAligned(h))return{valid:!1,
message:`The ${c} did not reach its gate centre after pickup. Review that stop and its appearance count.`};if(o.wheels.some((e,t)=>t>h&&!o.gateAligned(t)))return{valid:!1,
message:`Setting ${c} moved an earlier gate out of alignment.`};i+=Math.abs(d-a),a=d}}return{valid:o.fenceDown,total:i,
message:o.fenceDown?"Sequence successful. All gates are aligned and the fence is down.":"The fence did not drop."}}export function replayPlan(e,t){
const s=verifyInstructions(e,-1,t);if(!s.valid)return{...s,stops:[]};let r=0;const o=t.length===e.length+1,a=t.map(({number:e,appearance:t},s)=>{const a=s%2?1:-1;let i=n(3.6*-e)
;for(;(i-r)*a<=1e-7;)i+=360*a;for(;(i-r)*a>360+1e-7;)i-=360*a;return i+=360*a*(t-1),r=i,{wheel:o?0===s?null:s:s+1,direction:a,target:i,number:Number(e).toFixed(2),appearance:t}})
;return{...s,settings:[...e],stops:a}}export function setupPostOpen({doc:e=document,onComplete:t=()=>{},onChange:n=()=>{}}={}){const s=t=>e.getElementById(t),r=new Map;let o=null
;const a=e=>{const t=String(s(e).value).trim();return""===t?NaN:Number(t)},i=[...Array.from({length:4},(e,t)=>"post-setting-"+(4-t)),...Array.from({length:5
},(e,t)=>[`post-stop-${t+1}`,`post-count-${t+1}`]).flat()];function l(){o&&(o.draft=Object.fromEntries(i.map(e=>[e,s(e).value])))}function c(){
o.settingsOK&&o.instructionsOK?(o.complete=!0,s("post-progress").textContent="Both tasks solved. Your owner’s reference is now available.",
t()):s("post-progress").textContent=`${[o.settingsOK,o.instructionsOK].filter(Boolean).length} of 2 tasks solved.`,n()}function u(){if(!o)return;l();const e=Array.from({length:4
},(e,t)=>a("post-setting-"+(4-t)));o.settingsOK=e.every((e,t)=>Number.isInteger(e)&&e>=0&&e<100&&e===Math.round(o.settings[t])%100),
s("post-settings-result").textContent=o.messages.settings=o.settingsOK?"All four lock settings are correct.":"Those settings do not yet match all four wheels.",c()}function p(){
if(!o)return;l();const e=replayPlan(o.settings,o.plan.stops.map((e,t)=>({number:a(`post-stop-${t+1}`),appearance:a(`post-count-${t+1}`)})));o.instructionsOK=e.valid,
o.replay=e.valid?e:null,s("post-instructions-result").textContent=o.messages.instructions=e.message,c()}
for(const e of i.filter(e=>e.startsWith("post-setting-")))for(const t of["input","change"])s(e).addEventListener(t,()=>{if(!o)return
;i.filter(e=>e.startsWith("post-setting-")).every(e=>""!==String(s(e).value).trim())?u():(l(),o.settingsOK=!1,s("post-settings-result").textContent=o.messages.settings="",c())})
;function g(){if(!o)return;l();o.plan.stops.every((e,t)=>["stop","count"].every(e=>""!==String(s(`post-${e}-${t+1}`).value).trim()))?p():(o.instructionsOK=!1,o.replay=null,
s("post-instructions-result").textContent=o.messages.instructions="",c())}for(const e of i.filter(e=>/^post-(stop|count)-/.test(e)))s(e).addEventListener("input",g),
s(e).addEventListener("change",g);return{show:function(e,t,n){l(),r.has(t)||r.set(t,{settings:[...e],plan:anticlockwisePlan(e),draft:{},messages:{},settingsOK:!1,instructionsOK:!1,
complete:!1}),o=r.get(t),s("post-open").hidden=!1,s("post-lock").textContent=n;for(const e of i)s(e).value=o.draft[e]??"";for(let e=0;e<5;e++){const t=o.plan.stops[e]
;s(`post-row-${e+1}`).hidden=!t,s(`post-wheel-${e+1}`).textContent=t?t.wheel??"Clear":"",s(`post-direction-${e+1}`).textContent=t?t.direction<0?"Anti":"Clock":"",
s(`post-stop-${e+1}`).setAttribute("aria-label",t?.wheel?`Wheel ${t.wheel} gate position`:"Clearing gate position"),
s(`post-count-${e+1}`).setAttribute("aria-label",t?.wheel?`Wheel ${t.wheel} appearance count`:"Clearing appearance count")}s("post-clearing-note").hidden=4===o.plan.stops.length,
s("post-guide-start").disabled=!o.plan.valid;for(const e of["settings","instructions"])s(`post-${e}-result`).textContent=o.messages[e]??"";c()},hide:function(){l(),o=null,
s("post-open").hidden=!0},value:a,checkSettings:u,checkInstructions:p,setValue(e,t){o&&i.includes(e)&&(s(e).value=String(t),l())},get replay(){
return o?.replay?structuredClone(o.replay):null},get plan(){return o?.plan},get settingsOK(){return Boolean(o?.settingsOK)},get instructionsOK(){return Boolean(o?.instructionsOK)},
get complete(){return Boolean(o?.complete)}}}
