export const TAB_PLAY=352;const t=176,e=[80,-40,70],s=[80,-40,70,120];export const STOPS=[-1170,-252,-864,-828];export const wrap=t=>(t%360+360)%360
;export const roundedWheelReading=(t,e)=>Math.round(wrap(e-t)/3.6)%100;export const settingReadable=t=>Math.min(wrap(t),360-wrap(t))<1.8-1e-9
;const i=t=>Math.min(wrap(t),360-wrap(t));function h(e,s){let i=s;return e.map(e=>{const s=Math.max(i-t,Math.min(i+t,e));return i=s,s})}let a=[...e]
;for(const t of STOPS.slice(0,3))a=h(a,t);export const GATE_OFFSETS=a.map(t=>wrap(-t));export class WheelPack{constructor(t=()=>{}){this.onEvent=t,this.initial=[...e],
this.gateOffsets=[...GATE_OFFSETS],this.reset()}get gateSettings(){return this.gateOffsets.map((t,e)=>wrap(this.initial[e]+t)/3.6)}configureGates(t){
if(!Array.isArray(t)||![3,4].includes(t.length)||t.some(t=>!Number.isFinite(t)||t<0||t>=100))throw new RangeError("Three or four gate numbers from 0 to less than 100 required")
;this.initial=[...4===t.length?s:e],this.gateOffsets=t.map((t,e)=>wrap(3.6*t-this.initial[e])),this.reset()}settingAngle(e,s){return-this.gateOffsets[e]+s*t*(e+1)}reset(){
this.dial=0,this.wheels=[...this.initial],this.contacts=this.initial.map(()=>0),this.moving=this.initial.map(()=>!1),this.pickupArmed=this.initial.map(()=>!0),
this.pickupFaces=this.initial.map(()=>0),this.fenceDown=!1,this.boltTravel=0,this.open=!1,this.latched=new Set,this.candidates=new Set,this.training=!1,this.alignmentTolerance=.6}
parkCandidate(t,e){this.wheels[t]=e+360*Math.round((this.wheels[t]-e)/360),this.latched.add(t),this.candidates.add(t)}releaseCandidates(){
for(const t of this.candidates)this.latched.delete(t);this.candidates.clear()}latch(t){
this.latched.has(t)||(this.wheels[t]=-this.gateOffsets[t]+360*Math.round((this.wheels[t]+this.gateOffsets[t])/360),this.latched.add(t),this.onEvent({type:"set",wheel:t}))}
turnTo(e,{emitPickups:s=!0,emitGates:h=s,allowBolt:a=!0}={}){const n=e-this.dial,l=[...this.wheels],o=this.fenceDown,r=[];this.dial=e;let c=e;this.wheels=this.wheels.map((e,s)=>{
const i=this.latched.has(s)?e:Math.max(c-t,Math.min(c+t,e));return c=i,i});let p=e;this.wheels.forEach((i,a)=>{this.moving[a]=Math.abs(i-l[a])>1e-7
;const o=p-i,c=this.latched.has(a)?0:Math.abs(o-t)<1e-6?1:Math.abs(o+t)<1e-6?-1:0,d=this.pickupFaces[a];d&&t-d*o>=1&&(this.pickupArmed[a]=!0),
c&&this.pickupArmed[a]&&(s&&Math.abs(n)>1e-7&&r.push({type:"pickup",wheel:a,dial:l[a]+Math.sign(n)*t*(a+1)}),this.pickupArmed[a]=!1,this.pickupFaces[a]=c)
;const f=l[a]+this.gateOffsets[a],g=i+this.gateOffsets[a],u=g>f?Math.floor((g+1e-7)/360)-Math.floor((f+1e-7)/360):Math.ceil((f-1e-7)/360)-Math.ceil((g-1e-7)/360)
;if(h&&!this.latched.has(a)&&this.moving[a]&&u>0){const s=g>f?360*(Math.floor((f+1e-7)/360)+1):360*(Math.ceil((f-1e-7)/360)-1),i=e-(g-s);let h=i;const n=[];l.forEach((e,s)=>{
const i=this.latched.has(s)?e:Math.max(h-t,Math.min(h+t,e));h=i,Math.abs(i-e)>1e-7&&n.push(this.wheels.length-s)}),r.push({type:"gatepass",wheel:a,direction:Math.sign(g-f),count:u,
dial:i,movingWheels:n})}this.contacts[a]=c,p=i
}),this.fenceDown=(!this.training||this.latched.size===this.wheels.length)&&this.wheels.every((t,e)=>i(t+this.gateOffsets[e])<=this.alignmentTolerance),this.fenceDown&&!o&&r.push({
type:"fence"}),this.fenceDown?("function"==typeof a?a():a)&&o&&n>0&&(this.boltTravel=Math.min(36,this.boltTravel+n),this.boltTravel>=35.999999&&!this.open&&(this.open=!0,r.push({
type:"open"}))):(this.boltTravel=0,this.open=!1);for(const t of r)this.onEvent(t);return r}previewGateStops(t){if(t===this.dial)return[];const e=new WheelPack
;for(const[t,s]of Object.entries(this))"onEvent"!==t&&"function"!=typeof s&&(e[t]=structuredClone(s));const s=Math.sign(t-this.dial);return e.turnTo(t,{allowBolt:!1
}).filter(t=>"gatepass"===t.type).flatMap(t=>Array.from({length:t.count},(e,i)=>t.dial+360*s*i)).sort((t,e)=>(t-e)*s)}nextGateStop(t){
return this.fenceDown||t===this.dial?t:this.previewGateStops(t)[0]??t}nearGateCapture(e){if(this.training||this.latched.size||this.open)return null;let s=this.dial,i=-1
;for(let h=0;h<this.wheels.length&&!(Math.abs(s-this.wheels[h]-e*t)>1e-6);h++)i=h,s=this.wheels[h]
;for(;i>0&&this.gateAligned(i)&&this.wheels.slice(0,i).some((t,e)=>!this.gateAligned(e));)i--;if(i<0||this.wheels.some((t,e)=>e>i&&!this.gateAligned(e)))return null
;const h=this.wheels[i],a=-this.gateOffsets[i]+360*Math.round((h+this.gateOffsets[i])/360);return Math.abs(a-h)<=7.2+1e-7?{wheel:i,target:a}:null}
captureNearGate({wheel:t,target:e}){const s=e-this.wheels[t];if(Math.abs(s)>7.2+1e-7)return 0;for(let e=0;e<=t;e++)this.wheels[e]+=s;return this.dial+=s,this.turnTo(this.dial,{
emitPickups:!1,emitGates:!1,allowBolt:!1}),s}retractBolt(){return this.turnTo(this.dial,{emitPickups:!1}),!(!this.fenceDown||this.open)&&(this.boltTravel=36,this.open=!0,
this.onEvent({type:"open"}),!0)}rest(){this.moving=this.initial.map(()=>!1)}gateAligned(t){return i(this.wheels[t]+this.gateOffsets[t])<=this.alignmentTolerance}snapshot(){return{
dial:this.dial,wheels:this.wheels.map((t,e)=>({angle:t,gate:wrap(t+this.gateOffsets[e]),parent:e?this.wheels[e-1]:this.dial,moving:this.moving[e],aligned:this.gateAligned(e),
saved:this.latched.has(e)&&!this.candidates.has(e),candidate:this.candidates.has(e),contact:this.contacts[e]})),fenceDown:this.fenceDown,bolt:this.boltTravel/36,open:this.open}}}
