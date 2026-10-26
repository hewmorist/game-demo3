import{HypothesisGuide as t}from"./hypothesis-guide.js";import{TAB_PLAY as i,wrap as e}from"./wheel-pack.js";const s=(t,i)=>Math.abs(e(t-i+180)-180)
;export class OneGateGuide extends t{constructor(t,i){if(super(t,i),"blind"===this.script.discovery){const{gates:t,attempts:i,id:e,title:s,...r}=this.script
;this.script=structuredClone(r)}}start(...t){this.readings=[],this.pickupReadings=[],this.identified=null,this.gateCount=0,
"blind"===this.script.discovery&&delete this.script.attempts,super.start(...t)}safeReturnOrigin(t){return this.readings.every(s=>{let r=e(t-(s.dial-i));for(;r<i-1e-7;)r+=360
;return r>=i+3.6&&r<2*i-4})}beginSearch(){this.searchOrigin=this.rotation,super.beginSearch()}gateText(){return this.gateCount=this.readings.length,
["One.","Two.","Three.","Four."][this.gateCount-1]??`${this.gateCount}.`}say(t,i={}){if(this.quietActions&&i.gate)return super.say(t,i)
;if(!i.gate)return i.urgent&&(this.queue=this.queue.filter(t=>!t.gate),this.active?.gate&&(this.active.gate=!1)),super.say(t,i);this.queue=this.queue.filter(t=>!t.gate);const e={
text:t,gate:!0,kind:"gate",after:i.after,notBefore:this.now,expires:this.now+1e3};i.urgent&&this.active&&(this.generation++,this.active=null),
this.active?this.queue.push(e):this.speak(e)}pump(){for(;!this.active&&this.queue[0]?.gate&&this.now>this.queue[0].expires;){const t=this.queue.shift();t.after?.()}super.pump()}
handleEvents(t,r){if("search"!==r||"search"!==this.phase||!this.gateNarrationEnabled)return;if("progressive"===this.script.discovery)return void this.handleProgressive(t,r)
;const h="clock"===this.search.direction?1:-1,n=t.filter(t=>"gatepass"===t.type).flatMap(t=>Array.from({length:t.count},(i,e)=>({dial:t.dial+e*t.direction*360,direction:t.direction
}))).sort((t,i)=>(t.dial-i.dial)*t.direction);let a=!1;for(const t of n){if("search"!==this.phase)break;if(!this.gateNarrationEnabled)continue;let n=!1
;if("search"===r&&t.direction===h&&!a)if(0===this.searchIndex){let i=this.readings.find(i=>s(i.dial,t.dial)<.1);if(!i){const e=this.script.signatures[this.readings.length];e&&(i={
sound:e,dial:t.dial,direction:h},this.readings.push(i),this.records.set(`${e}:${h}`,i),n=!0)}}else{
const r=(t.dial-this.searchOrigin)*h,n=r>=i-1e-7&&r<2*i-1e-7,c=e(-t.dial+h*i/2),o=e(i/2-c),d=this.readings.filter(t=>s(t.dial,o)<.1)
;n&&1===d.length&&this.records.set(`${d[0].sound}:${h}`,{dial:t.dial,direction:h,isolated:!0}),a=!0,this.phase="search-rest"}if(a){this.say(this.line("stop"),{urgent:!0});continue}
if(!n)continue;const c=this.gateText(),o=0===this.searchIndex&&this.search.until.readings===this.readings.length;if(o&&this.script.recordedCrack)continue;this.gateComments.push({
dial:t.dial,text:c});const d=o&&(!this.script.recordedCrack||this.safeReturnOrigin(this.rotation));d&&(this.phase="search-rest"),this.say(c,{gate:!0,urgent:o,
after:d?()=>this.say(this.line("stop"),{urgent:!0}):void 0})}const c=this.script.recordedCrack&&0===this.searchIndex&&this.readings.length===this.wheelCount
;c&&"search"===this.phase&&this.safeReturnOrigin(this.rotation)&&(this.phase="search-rest",this.gateComments.push({dial:this.readings[this.wheelCount-1].dial,text:"Four."}),
this.say("Four.",{gate:!0,urgent:!0,after:()=>this.say(this.line("stop"),{urgent:!0})})),
!c&&"search"===r&&0===this.searchIndex&&(this.rotation-this.searchOrigin)*h>=this.search.until.degrees&&(this.phase="search-rest",this.say(this.line("stop"),{urgent:!0}))}
handleProgressive(t,i){const e=t.filter(t=>"pickup"===t.type||"gatepass"===t.type).flatMap(t=>"pickup"===t.type?[{type:t.type,dial:t.dial}]:Array.from({length:t.count},(i,e)=>({
type:t.type,dial:t.dial+e*t.direction*360,direction:t.direction}))).sort((t,i)=>t.dial-i.dial);for(const t of e){if("search"!==this.phase)break;if("pickup"===t.type){
"search"!==i||"search"!==this.phase||this.pickupReadings.some(i=>Math.abs(i-t.dial)<7.2)||this.pickupReadings.push(t.dial);continue}if(!this.gateNarrationEnabled)continue
;let e,r=!1,h=!1;if("search"===i&&"search"===this.phase&&1===t.direction){let i=this.readings.find(i=>s(i.dial,t.dial)<.1);if(!i&&this.readings.length<this.wheelCount){
const s=this.script.signatures[this.readings.length],n=this.pickupReadings.length;if(i={sound:s,dial:t.dial,direction:1,pickups:n,wheel:this.wheelCount+1-n},this.readings.push(i),
this.records.set(`${s}:1`,i),h=!0,n!==this.readings.length)return this.phase="restart",void this.say(this.script.confidence.mismatch,{urgent:!0})
;e=this.search.observations.find(t=>t.sound===s&&1===t.occurrence)?.say,r=this.readings.length===this.search.until.readings,r&&(this.phase="search-rest")}}if(!h)continue
;const n=this.gateText();this.gateComments.push({dial:t.dial,text:n}),this.say(n,{gate:!0,urgent:r,after:r?()=>this.say(this.line("stop"),{urgent:!0}):e?()=>this.say(e,{
duringAction:!0}):void 0})}}searchComplete(){if("blind"===this.script.discovery&&this.searchIndex===this.script.searches.length-1){
const t=this.records.get(`${this.identified}:1`),i=(Math.round(e(-t.dial)/3.6*10)/10%100).toFixed(1);return this.search.complete.replace("{number}",i)}return this.search.complete}
finishSearch(){if(0===this.searchIndex&&this.readings.length!==this.wheelCount)return this.phase="restart",void this.say(this.script.confidence.mismatch,{urgent:!0})
;super.finishSearch()}beginAttempt(){if("blind"===this.script.discovery&&!this.script.attempts){const t=this.readings.filter(t=>t.sound!==this.identified).map(t=>t.sound)
;if(!this.identified||t.length!==this.wheelCount-1)return this.phase="restart",void this.say(this.script.confidence.mismatch,{urgent:!0})
;const i=t=>t.length?t.flatMap((e,s)=>i(t.filter((t,i)=>i!==s)).map(t=>[e,...t])):[[]],e=i(t);4===this.wheelCount&&(e.reverse(),e.splice(3)),this.script.attempts=e.map((t,i,e)=>({
command:this.line(i?"nextPairing":"firstPairing"),assignments:[...t.map((t,i)=>({wheel:i+1,sound:t,fromDirection:"clock"})),{wheel:this.wheelCount,sound:this.identified,
fromDirection:"anti"}],failure:this.line(i===e.length-1?"pairingsFailed":"swapPairing")}))}super.beginAttempt()}verifyConfidence(){if("blind"===this.script.discovery){
this.identified=null;const t=this.readings.filter(t=>{const e=this.records.get(`${t.sound}:-1`);return e?.isolated&&s(-t.dial+i/2,-e.dial-i/2)<.1})
;return this.readings.length===this.wheelCount&&1===t.length&&(this.identified=t[0].sound,!0)}
return"progressive"===this.script.discovery?this.readings.length===this.wheelCount&&this.readings.every((t,i)=>t.pickups===i+1&&t.wheel===this.wheelCount-i):this.readings.length===this.wheelCount&&super.verifyConfidence()
}}
