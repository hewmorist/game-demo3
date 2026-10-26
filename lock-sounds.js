export const soundRecipes={tick:{duration:.065,hits:[[0,.22,1700,.018]],modes:[[910,.13,.014],[2370,.07,.009]]},pickup:{duration:.24,hits:[[0,.55,2400,.024],[.027,.18,1300,.018]],
modes:[[430,.22,.055],[1133,.19,.045],[2687,.09,.025]]},gate:{duration:.4,hits:[[0,.13,1e3,.022]],modes:[[322,.25,.11],[797,.17,.08],[1463,.06,.05]]},wheel3gate:{duration:.22,
hits:[[0,.1,2800,.012]],modes:[[1320,.22,.035],[2780,.08,.02]]},wheel2gate:{duration:.3,hits:[[0,.1,1600,.018]],modes:[[660,.24,.065],[1570,.08,.035]]},wheel1gate:{duration:.4,
hits:[[0,.12,800,.022]],modes:[[275,.26,.09],[730,.1,.055]]},settle:{duration:.28,hits:[[0,.45,850,.032],[.024,.14,3100,.012]],modes:[[172,.33,.06],[487,.2,.045],[1829,.08,.025]]},
fence:{duration:.35,hits:[[0,.48,2100,.027],[.047,.4,1600,.035]],modes:[[278,.25,.08],[931,.23,.065],[2213,.13,.035]]},blocked:{duration:.3,
hits:[[0,.35,450,.025],[.075,.12,700,.018]],modes:[[105,.3,.055],[247,.12,.04]]},bolt:{duration:1.25,scrape:!0,hits:[[.64,.75,900,.065],[.695,.25,1900,.03]],
modes:[[83,.48,.16],[191,.31,.12],[613,.17,.075]]}};export const defaultSoundDesign={pitch:0,volume:1,duration:1,resonance:1,texture:1};export function normalizeSoundDesign(e={}){
const t={pitch:[-12,12],volume:[0,1.5],duration:[.5,2],resonance:[0,2],texture:[0,2]};return Object.fromEntries(Object.entries(defaultSoundDesign).map(([n,s])=>{
const i=Number(e?.[n]);return[n,Number.isFinite(i)?Math.max(t[n][0],Math.min(t[n][1],i)):s]}))}export function synthesizeSound(e,t=44100,n={}){const s=soundRecipes[e]
;if(!s)throw new Error(`Unknown lock sound: ${e}`);const i=normalizeSoundDesign(n),o=2**(i.pitch/12),a=s.duration*i.duration,c=new Float32Array(Math.ceil(a*t));let r=78391,h=0,u=0
;const d=()=>(r=Math.imul(r,1664525)+1013904223|0,(r>>>0)/2147483648-1);for(let e=0;e<c.length;e++){const n=e/t/i.duration;let r=0;for(const[e,a,c,u]of s.hits){const s=n-e
;if(s>=0&&s<9*u){h+=(1-Math.exp(-2*Math.PI*c*o/t))*(d()-h),r+=h*a*i.texture*Math.exp(-s/u)*Math.min(1,s/7e-4)}}const l=n-(s.scrape?.64:0)
;if(l>=0&&i.resonance>0)for(const[e,t,n]of s.modes)r+=Math.sin(2*Math.PI*e*o*l*i.duration)*t*Math.exp(-l/(n*i.resonance))*Math.min(1,l/.001);if(s.scrape&&n<.64){u+=.13*(d()-u)
;const e=Math.sin(Math.PI*n/.64)**.7,t=.5+.5*Math.sin(2*Math.PI*(28*n+14*n*n));r+=.27*u*i.texture*e*t}c[e]=.72*Math.tanh(1.6*r)*Math.min(1,(a-e/t)/.012)}return c}
export const fanfareDuration=4.8;export function synthesizeFanfare(e=44100){const t=new Float32Array(Math.ceil(4.8*e)),n=[]
;for(const e of[0,.23])for(const t of[60,64,67])n.push([e,.18,t,.13]);for(const[e,t,s]of[[.5,.26,67],[.84,.26,72],[1.18,.26,76],[1.52,.42,79]])n.push([e,t,s,.25])
;for(const e of[60,64,67,72,76,84])n.push([2.04,2.5,e,.13]);let s=17933;for(let i=0;i<t.length;i++){const o=i/e;let a=0;for(const[e,t,s,i]of n){const n=o-e;if(n<0||n>t)continue
;const c=Math.min(1,n/.018)*Math.min(1,(t-n)/Math.min(.35,.4*t)),r=2*Math.PI*(440*2**((s-69)/12))*n+.008*Math.sin(2*Math.PI*5*n)
;a+=i*c*(Math.sin(r)+.32*c*Math.sin(2*r)+.14*c*Math.sin(3*r))}for(const e of[0,.23,.5,2.04]){const t=o-e
;t>=0&&t<.6&&(a+=.22*Math.sin(2*Math.PI*(65*t+1.8*(1-Math.exp(25*-t))))*Math.exp(-t/.12)*Math.min(1,t/.003))}o>=2.04&&(s=Math.imul(s,1664525)+1013904223|0,
a+=.075*((s>>>0)/2147483648-1)*Math.exp(-(o-2.04)/.65)),t[i]=.68*Math.tanh(1.3*a)*Math.min(1,(4.8-o)/.1)}return t}export function dialClickEvents(e,t,n,s=[]){
const i=Math.sign(t-e),o=[];if(!i)return{anchor:n,events:o};const a=[...s].sort((e,t)=>(e-t)*i);for(let s=0;s<1e4;s++){const s=n+3.6*i;if((t-s)*i<-1e-7)break
;const c=a.find(e=>(e-s)*i>=-1e-7&&(e-s)*i<3.6-1e-7),r=c??s;if((t-r)*i<-1e-7)break;n=r,(r-e)*i>=-1e-7&&o.push({position:r,gate:void 0!==c})}return{anchor:n,events:o}}
export class LockSounds{constructor(e=globalThis.AudioContext??globalThis.webkitAudioContext){this.Context=e,this.context=null,this.buffers=new Map,this.sources=new Set,
this.enabled=!1,this.volume=.45,this.previous=0,this.clickPosition=0,this.lastTick=-1/0,this.levels=new Map,this.effects=new Map,this.quietTicksUntil=-1/0,this.speechPaused=!1,
this.resumePending=null,this.suspension=null,this.failedContext=null,this.settings=Object.fromEntries(Object.keys(soundRecipes).map(e=>[e,{...defaultSoundDesign}]))}configure(e,t){
if(!Object.hasOwn(soundRecipes,e))throw new Error("Unknown sound");this.settings[e]=normalizeSoundDesign({...this.settings[e],...t}),this.buffers.delete(e)}duration(e){
return"fanfare"===e?4.8:soundRecipes[e].duration*this.settings[e].duration}resetContext(){this.stop(),this.enabled=!1;const e=this.context;this.context=null,this.gain=null,
this.buffers.clear(),this.failedContext=null,this.resumePending=null,this.suspension=null;try{e?.close?.()?.catch?.(()=>{})}catch{}}pauseForSpeech(){this.stop()
;const e=this.context;if(!e||"closed"===e.state||!e.suspend)return Promise.resolve();const t={context:e,promise:null};try{t.promise=Promise.resolve(e.suspend()).catch(()=>{})
}catch{t.promise=Promise.resolve()}return this.suspension=t,t.promise.then(()=>{this.suspension===t&&(this.suspension=null)}),t.promise}async enable(){
if(!this.Context)throw new Error("Web Audio is unavailable in this browser.");if(this.speechPaused)return void(this.enabled=!0)
;if(this.failedContext===this.context&&this.context)if("running"!==this.context.state){const e=this.enabled;this.resetContext(),this.enabled=e}else this.failedContext=null
;if(this.suspension?.context===this.context&&await this.suspension.promise,this.speechPaused)return void(this.enabled=!0);if(!this.context){try{
globalThis.navigator?.audioSession&&(globalThis.navigator.audioSession.type="playback")}catch{}this.context=new this.Context,this.gain=this.context.createGain(),
this.gain.gain.value=this.volume,this.gain.connect(this.context.destination)}const e=this.context;if("running"!==e.state){let t=this.resumePending;if(!t||t.context!==e){
const n=e.resume();t={context:e,promise:n},this.speechExclusive&&(t.promise=new Promise((t,s)=>{const i=setTimeout(()=>{this.context===e&&"running"!==e.state?(this.failedContext=e,
s(Object.assign(new Error("Mechanical audio interrupted. Tap again to restore sounds."),{retryable:!0}))):t()},1500);Promise.resolve(n).then(()=>{clearTimeout(i),t()},e=>{
clearTimeout(i),s(e)})})),this.resumePending=t}try{await t.promise}finally{this.resumePending===t&&(this.resumePending=null)}}if(this.context===e){
if(this.speechPaused)return this.enabled=!0,void await this.pauseForSpeech();if("running"!==e.state)throw new Error("Tap again to enable sound.");this.enabled=!0}}setVolume(e){
this.volume=Math.max(0,Math.min(1,Number(e)||0)),this.gain&&this.gain.gain.setTargetAtTime(this.volume,this.context.currentTime,.015)}play(e,t=0,n=1){
if(this.speechPaused||!this.enabled||"running"!==this.context?.state)return!1;if(!this.buffers.has(e)){
const t="fanfare"===e?synthesizeFanfare(this.context.sampleRate):synthesizeSound(e,this.context.sampleRate,this.settings[e]),n=this.context.createBuffer(1,t.length,this.context.sampleRate)
;n.getChannelData(0).set(t),this.buffers.set(e,n)}const s=this.context.createBufferSource();s.buffer=this.buffers.get(e);const i=this.context.createGain()
;return i.gain.value=Math.max(0,Math.min(1,n))*(this.settings[e]?.volume??1)*("pickup"===e?.1:1),s.connect(i),i.connect(this.gain),this.sources.add(s),this.levels.set(s,i),
this.effects.set(s,e),s.onended=()=>{s.disconnect(),i.disconnect?.(),this.sources.delete(s),this.levels.delete(s),this.effects.delete(s)},
"tick"!==e&&(this.quietTicksUntil=this.context.currentTime+t+this.duration(e)+.1),s.start(this.context.currentTime+t),!0}resetDial(e=0){this.previous=e/3.6,this.clickPosition=e}
startIntegerClicks(e,t){let n=e/3.6;Math.abs(n-Math.round(n))<1e-7&&(n=Math.round(n)),this.previous=e/3.6,this.clickPosition=3.6*(t>0?Math.ceil(n):Math.floor(n))}
nextClickStop(e,t,n){const s=e.dial+7.2*t,i=n??e.previewGateStops(s+3.6*t)
;return dialClickEvents(e.dial,s,this.clickPosition,i).events.find(n=>(n.position-e.dial)*t>1e-7)?.position??e.dial+3.6*t}move(e,t=!1,{gateStops:n=[],gateAudible:s=!1}={}){
const i=3.6*this.previous;this.previous=e/3.6;const o=dialClickEvents(i,e,this.clickPosition,n);if(this.clickPosition=o.anchor,
!this.enabled||!this.context||"running"!==this.context.state)return;const a=o.events.at(-1);if(!a||!a.gate&&this.context.currentTime-this.lastTick<.025)return
;if(a.gate&&s)return void(this.lastTick=this.context.currentTime);const c=this.context.currentTime<this.quietTicksUntil;this.play("tick",0,a.gate?.5:c?.18:.5),
this.lastTick=this.context.currentTime}stop(){for(const e of this.sources){try{e.stop()}catch{}e.disconnect(),this.levels.get(e)?.disconnect?.()}this.sources.clear(),
this.levels.clear(),this.effects.clear(),this.lastTick=-1/0,this.quietTicksUntil=-1/0}stopEffect(e){for(const[t,n]of this.effects)if(n===e){try{t.stop()}catch{}t.onended()}}
disable(){this.enabled=!1,this.stop()}}export function iPhoneSafari(e=globalThis.navigator){const t=e?.userAgent??""
;return/iPhone|iPod/.test(t)&&/Safari\//.test(t)&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(t)}
export function setupSounds({doc:e=document,win:t=window,engine:n=new LockSounds,exclusiveSpeech:s=!1}={}){const i=t=>e.getElementById(t),o=i("sound-status"),a=i("sound-enabled")
;let c=0,r=null;n.preparingSpeech=!1;const h=()=>{c++,r=null,n.preparingSpeech=!1,n.stop()};async function u(e){const t=++c;n.stop();try{if(await n.enable(),
t!==c)return void(a.checked||n.disable());if(a.checked=!0,"all"===e){let e=0
;["tick","pickup","wheel3gate","wheel2gate","wheel1gate","gate","settle","fence","bolt","blocked"].forEach(t=>{n.play(t,e),e+=Math.max(.35,n.duration(t)+.2)}),
o.textContent="Playing: tick, pickup, wheel 3 gate, wheel 2 gate, wheel 1 gate, legacy approach, settling, fence, bolt, blocked bolt."}else n.play(e),
o.textContent=`Playing ${i(`sound-${e}`).textContent.toLowerCase()}. Turn the dial to hear its ticks.`}catch(e){e.retryable||(a.checked=!1,n.disable()),o.textContent=e.message}}
n.speechExclusive=s,n.cancelPreparation=()=>{r&&(h(),n.speechPaused=!1)},n.canTurn=()=>!s||!a.checked||!n.preparingSpeech&&!n.speechPaused&&"running"===n.context?.state,
n.prepareSpeechSession=async()=>{if(!s)return!0;const t=++c,i={};let h;r=i,n.preparingSpeech=!0,a.checked=!0,n.speechPaused=!1,n.stop(),
o.textContent="Preparing mechanical audio before the spoken instruction…";try{const s=n.enable(),i=n.context;if(i){const e=i.createBufferSource()
;e.buffer=i.createBuffer(1,1,i.sampleRate),e.connect(i.destination),e.onended=()=>{try{e.disconnect()}catch{}},e.start()}const r=new Promise((e,t)=>{
h=setTimeout(()=>t(new Error("Mechanical audio could not start. Tap the starting button again.")),3e3)});return await Promise.race([s,r]),
t!==c||e.hidden||!a.checked?(a.checked||n.disable(),!1):(n.speechPaused=!0,await Promise.race([n.pauseForSpeech(),r]),t!==c||e.hidden||!a.checked?(a.checked||n.disable(),
!1):(o.textContent="Listen to the instruction. Mechanical audio resumes automatically when speech finishes.",!0))}catch(e){return t===c&&(n.speechPaused=!1,
n.failedContext=n.context,n.stop(),o.textContent=e.message),!1}finally{clearTimeout(h),r===i&&(r=null,n.preparingSpeech=!1)}},n.setSpeechActive=t=>{s&&(t=Boolean(t),
n.speechPaused!==t&&(n.speechPaused=t,
t?(n.pauseForSpeech(),a.checked&&(o.textContent="Mechanical sounds paused while the assistant speaks.")):a.checked&&!e.hidden&&(o.textContent="Mechanical sounds ready. Turn the dial to listen.",
n.context&&n.enabled&&!n.failedContext&&n.resumeFromGesture())))},n.startSession=async({confirm:e=!1,fresh:t=!1}={})=>{const i=++c;r=null,n.preparingSpeech=!1,
t&&!s&&n.resetContext?n.resetContext():n.stop(),a.checked=!0;try{return await n.enable(),i!==c?(a.checked||n.disable(),
!1):(o.textContent=n.speechPaused?"Mechanical sounds paused while the assistant speaks.":"Live mechanism: ticks, wheel pickups, gate sounds, fence and bolt. Voice off lets you learn the sounds.",
e&&n.play("tick"),!0)}catch(e){return i===c&&(e.retryable||(a.checked=!1,n.disable()),o.textContent=e.message),!1}},n.resumeFromGesture=async()=>{
if(!a.checked||n.speechPaused||e.hidden)return!1;if("running"===n.context?.state)return!0;const t=c;try{return await n.enable(),
t===c&&a.checked?n.speechPaused?(o.textContent="Mechanical sounds paused while the assistant speaks.",
!1):(o.textContent="Live mechanism: ticks, wheel pickups, gate sounds, fence and bolt. Voice off lets you learn the sounds.",!0):(a.checked||n.disable(),!1)}catch(e){
return t===c&&a.checked&&(o.textContent=e.message),!1}},n.resumeDuringMovement=()=>{
!s||n.speechPaused||n.resumePending||n.failedContext||"running"===n.context?.state||n.resumeFromGesture()},e.addEventListener("pointerdown",()=>{n.resumeFromGesture()},{capture:!0
}),e.addEventListener("keydown",()=>{n.resumeFromGesture()},{capture:!0}),e.addEventListener("touchend",()=>{n.resumeFromGesture()},{capture:!0}),e.addEventListener("click",()=>{
n.resumeFromGesture()},{capture:!0})
;for(const e of["tick","pickup","wheel3gate","wheel2gate","wheel1gate","gate","settle","fence","bolt","blocked","all"])i(`sound-${e}`)?.addEventListener("click",()=>u(e))
;return a.addEventListener("change",async()=>{if(!a.checked)return h(),n.disable(),void(o.textContent="Mechanical sounds off.");const e=++c;try{if(await n.enable(),
e!==c)return void(a.checked||n.disable());n.play("tick"),o.textContent="Sound on. Turn the dial, or audition an effect."}catch(e){e.retryable||(a.checked=!1),
o.textContent=e.message}}),i("sound-volume").addEventListener("input",e=>n.setVolume(e.target.value/100)),i("sound-stop")?.addEventListener("click",()=>{h(),
o.textContent="Audition stopped."}),t.addEventListener("hashchange",h),e.addEventListener("visibilitychange",()=>{e.hidden&&h()}),i("sound-design-effect")&&setupSoundDesigner({
doc:e,win:t,engine:n,preview:u}),n}export function setupSoundDesigner({doc:e=document,win:t=window,engine:n,preview:s}){
const i=t=>e.getElementById(t),o=i("sound-design-effect"),a=i("sound-design-status"),c="safecrack.soundDesign.v1";let r;Object.hasOwn(soundRecipes,o.value)||(o.value="tick");try{
r=t.localStorage;const e=JSON.parse(r?.getItem(c)||"{}");for(const t of Object.keys(soundRecipes))e?.[t]&&n.configure(t,e[t])}catch{}function h(){try{
if(!r)throw new Error("unavailable");r.setItem(c,JSON.stringify(n.settings)),a.textContent="Saved on this device. These settings apply during play."}catch{
a.textContent="Applied for this visit. Device storage is unavailable."}}function u(){const e=n.settings[o.value]
;for(const t of Object.keys(defaultSoundDesign))i(`design-${t}`).value=e[t],
i(`design-${t}-value`).textContent="pitch"===t?`${e[t]>0?"+":""}${e[t]} semitones`:`${Math.round(100*e[t])}%`
;i("sound-design-duration").textContent=`Effect length: ${n.duration(o.value).toFixed(2)} seconds.`}
for(const e of Object.keys(defaultSoundDesign))i(`design-${e}`).addEventListener("input",t=>{n.configure(o.value,{[e]:Number(t.target.value)}),u(),h()})
;o.addEventListener("change",u),i("sound-design-preview").addEventListener("click",()=>s(o.value)),i("sound-design-reset").addEventListener("click",()=>{
n.configure(o.value,defaultSoundDesign),u(),h()}),i("sound-design-reset-all").addEventListener("click",()=>{
for(const e of Object.keys(soundRecipes))n.configure(e,defaultSoundDesign);u(),h()}),u()}
