import{dialInstructions as e}from"./owner-guide.js";import{setupIndicators as t}from"./lock-indicators.js";import{WheelPack as n}from"./wheel-pack.js"
;import{loadPuzzleCatalog as o,gateSoundEffect as i,validatePuzzle as s}from"./puzzle-script.js";import{createDailyPuzzle as a,dailyDate as r}from"./daily-lock.js"
;import{setupPostOpen as l,anticlockwisePlan as c}from"./post-open.js";import{PostOpenGuide as d}from"./post-open-guide.js";import{MainDialGuide as u}from"./main-dial-guide.js"
;import{parseSavedLock as p,serializeSavedLock as h,savedLockMaxBytes as g}from"./saved-lock.js";import{PassThroughOpening as m,passThroughInstructions as f}from"./pass-through.js"
;let v,w=[],k="",b="intro";try{const e=await o(fetch,"./puzzles/four-wheel-index.json");v=e[1],w=[{...e[0],title:"Introductory lock"},a(v)]}catch(e){w=[],k=e.message}
import{setupXray as y}from"./xray.js";import{setupSounds as x}from"./lock-sounds.js";import{DialAnnouncer as C}from"./dial-announcer.js";import{LockGuide as L}from"./lock-guide.js"
;import{HypothesisGuide as S}from"./hypothesis-guide.js";import{OneGateGuide as A}from"./one-gate-guide.js";import{setupCelebration as E}from"./celebration.js"
;import{angleAt as I,angularDelta as D,DialMotion as O,GateCaptureGesture as P}from"./dial-motion.js";const R=e=>document.getElementById(e);function M(){
return"off"!==new URLSearchParams(location.search??"").get("gateCatch")}const j=R("dial"),$=new O,T=new P;let N=null;const F=t(),W=l({onChange:()=>de(),onComplete:()=>Te()})
;let B=null,q=null,G=null;const z=new Set;let U=null,V=null,X=null,Y=0,K=0;function H(){return"saved"===b&&X===Pe?.id}function J(e){return"saved"===e?V:w["intro"===e?0:1]}
function Q(){return G===Pe?.id}function Z(){return"intro"===b||("saved"===b?H():Q())}function _(){return("daily"===b&&Q()||H())&&!Re.isOwnerPractice}
let ee,te,ne=!1,oe=!1,ie=null,se=null,ae=0,re=null,le=null;const ce="http://www.w3.org/2000/svg";for(let e=0;e<100;e++){const t=document.createElementNS(ce,"g")
;t.setAttribute("transform",`rotate(${3.6*e} 200 200)`);const n=document.createElementNS(ce,"path");if(n.setAttribute("d","M200 26v"+(e%5==0?16:8)),
n.setAttribute("stroke","#e7d5a7"),n.setAttribute("stroke-width",e%5==0?"2":"1"),t.append(n),e%5==0){const n=document.createElementNS(ce,"text");n.setAttribute("x","200"),
n.setAttribute("y","62"),n.setAttribute("text-anchor","middle"),n.setAttribute("fill","#e7d5a7"),n.setAttribute("font-family","Georgia,serif"),n.setAttribute("font-size","15"),
n.textContent=e.toString(),t.append(n)}R("graduations").append(t)}function de(){R("main-dial-ai").hidden=!z.has(Pe?.id),R("main-dial-ai").disabled=!be,
R("dot-guide-help").hidden=!Re.visual||!Re.running;const e=Re.dot;if(R("dial-target-dot").style.display=e?"":"none",e){const t=e.position*Math.PI/50
;R("dial-target-dot").setAttribute("cx",String(200+154*Math.sin(t))),R("dial-target-dot").setAttribute("cy",String(200-154*Math.cos(t))),R("dial-target-dot").setAttribute("fill",{
blue:"#218cff",green:"#22c56e",red:"#ff4149"}[e.colour]),R("dial-target-dot").setAttribute("data-colour",e.colour),
R("dial-target-dot").setAttribute("data-position",String(e.position))}e?.handle?R("solo-bolt").classList.add("dot-ready"):R("solo-bolt").classList.remove("dot-ready"),
R("main-dial-ai").textContent=Re.isDialInstructions&&Re.running?"Restart Dial Open With AI":"Dial Open With AI",R("main-dial-stop").hidden=!Re.isDialInstructions||!Re.running,
R("lock-event-indicators").hidden=!R("register-events").checked,R("xray-open").hidden=!Z(),R("xray-open").disabled=!Z(),R("dial-guidance").textContent=Re.instruction,
R("model-dial-controls").hidden=!_(),
R("guide-start").disabled=!be,be?"Loading Jennifer…"===R("guide-start").textContent&&(R("guide-start").textContent="Crack Open With AI"):R("guide-start").textContent="Loading Jennifer…"
;const t=Re.isDialInstructions&&Re.running&&"handle"===Re.phase,n=Re.running&&"bolt"===Re.phase&&"function"==typeof Re.blockedHandle,o=ne||Re.isOwnerPractice||!Re.isPostOpen&&!Re.isReplay
;R("solo-bolt").hidden=!1,R("solo-bolt").setAttribute("data-open",String(Le.open)),R("gate-catch-test-notice").hidden=M(),R("post-guide-stop").hidden=!Re.isPostOpen||!Re.running,
Re.isPostOpen&&(Re.running||"done"===Re.phase)&&(R("post-guide-status").textContent=Re.message),
R("solo-bolt").disabled=!o||Re.practiceFailed||!Le.fenceDown&&!n&&!t&&!ne&&!N||Le.open,
Re.isOwnerPractice&&Re.practiceFailed&&(R("owner-validity").textContent="Opening practice unsuccessful. Reset dial to test the complete instructions from the beginning."),
o&&(R("solo-bolt").textContent=Re.practiceFailed?"Retract bolt · Reset practice first":Le.open?"Bolt retracted":Le.fenceDown?"Retract bolt":n||t||ne||N?"Try handle":"Retract bolt · align all gates first"),
o||(R("solo-bolt").textContent="Retract bolt · unavailable during discovery and sequence tests"),R("dial-art").style.transform=`rotate(${$.rotation%360}deg)`
;const i=(Math.round(10*$.position)/10%100).toFixed(1).padStart(4,"0"),s=Math.abs($.velocity)<.001?"Stationary":$.velocity>0?"Clockwise":"Anticlockwise";R("position").value=i,
R("motion").value=s,R("travel").value=`${($.travel/360).toFixed(2)} turns`,j.setAttribute("aria-valuenow",i),j.setAttribute("aria-valuetext",`${i}, ${s.toLowerCase()}`)
;const a=Re.isPostOpen?Re.entry:null;if(R("post-step-form").hidden=!a,a){if(R("xray-panel").classList.add("has-reply"),R("post-step-label").textContent=a.label,
R("post-step-number").setAttribute("aria-label",a.label+" reply"),R("post-step-number").setAttribute("step",a.countField?"0.01":"1"),
R("post-step-number").setAttribute("inputmode",a.countField?"decimal":"numeric"),R("post-step-count-label").hidden=!a.countField,
R("post-step-count").required=Boolean(a.countField),re!==a.key){const e=W.value(a.field),t=a.countField?W.value(a.countField):NaN
;R("post-step-number").value=Number.isFinite(e)?String(e):"",R("post-step-count").value=Number.isFinite(t)?String(t):"",R("post-step-feedback").textContent=""}
}else R("xray-panel").classList.remove("has-reply");re=a?.key??null,Se.render()}function ue(){clearTimeout(ee),T.reset(),$.stop(),Le.rest(),de()}
function pe(e,t,{clickStep:n=!1}={}){if(!we.canTurn())return;const o=performance.now();if(Re.isDialInstructions&&Re.running){const n=Re.beforeMove(e,o);n&&$.move(n,t)}if(N){
const n=N.beforeMove(e);n&&($.move(n,t),R("guide-status").textContent="Gate crossing verified — wheel centred. Continue with the next row.")}T.reset();let i=$.rotation+e
;n&&(i=we.nextClickStop(Le,Math.sign(e),Re.isDialInstructions&&Re.running?Re.clickStops(Le.dial+10.8*Math.sign(e)):void 0),e=i-$.rotation),
!N&&(ne||Re.catchGates||!Re.running&&["daily","saved"].includes(b)&&Z())&&M()&&(i=Le.nextGateStop(i),e=i-$.rotation)
;const s=e?Re.isDialInstructions&&Re.running?Re.clickStops(i+3.6*Math.sign(e)):Le.previewGateStops(i+3.6*Math.sign(e)):[];B=[],
Re.running||Re.isOwnerPractice?Re.move(i,t,o):N?N.moveTo(i):Le.turnTo(i,{allowBolt:!(Re.isPostOpen||Re.isReplay&&!0!==Re.isOwnerPractice)}),
N?.failed&&(R("guide-status").textContent="Pass-through sequence interrupted or stop passed. Press Reset dial and follow the dial instructions."),F.record(B,{from:$.rotation,to:i,
travel:$.travel}),B=null,$.move(e,t),we.move($.rotation,!1,{gateStops:s,gateAudible:R("register-events").checked}),Ae.move($.rotation,o,Re.running?Re.readingStep:10,ne?{silent:!0
}:Re.numberOptions),de(),(ne||Re.isOwnerPractice)&&Le.open&&!oe&&(Re.stop(),clearInterval(Ee),ke.cancel(null),oe=!0,he(),Se.show(),ye.show()),
j.dispatchEvent(new CustomEvent("dialmotion",{bubbles:!0,detail:{rotation:$.rotation,position:$.position,travel:$.travel,velocity:$.velocity}})),clearTimeout(ee),
ee=setTimeout(ue,120)}function he(){clearInterval(te),te=null,le=null;const e=ie;ie=null,se=null,Re.resetReversal(performance.now()),j.classList.remove("dragging"),
null!==e&&j.hasPointerCapture(e)&&j.releasePointerCapture(e),ue()}j.addEventListener("pointerdown",e=>{!e.isPrimary||"mouse"===e.pointerType&&0!==e.button||(null!==ie&&he(),
Re.resetReversal(performance.now()),e.preventDefault(),we.enabled&&"running"!==we.context?.state&&we.enable().catch(()=>{}),ie=e.pointerId,
se=I(e.clientX,e.clientY,j.getBoundingClientRect()),ae=e.timeStamp,j.setPointerCapture(ie),j.focus({preventScroll:!0}),j.classList.add("dragging"))}),
j.addEventListener("pointermove",e=>{if(e.pointerId!==ie)return;if("mouse"===e.pointerType&&0===e.buttons)return void he();we.resumeDuringMovement()
;const t=I(e.clientX,e.clientY,j.getBoundingClientRect());null!==t&&null!==se&&pe(D(se,t),e.timeStamp-ae),se=t,ae=e.timeStamp})
;for(const e of["pointerup","pointercancel","lostpointercapture"])j.addEventListener(e,e=>{e.pointerId===ie&&he()})
;for(const e of["pointerup","pointercancel"])window.addEventListener(e,e=>{e.pointerId===ie&&he()});j.addEventListener("dragstart",e=>e.preventDefault()),
j.addEventListener("keydown",e=>{if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))return;e.preventDefault()
;pe((["ArrowRight","ArrowUp"].includes(e.key)?1:-1)*(e.shiftKey?.36:3.6),100,{clickStep:!e.shiftKey})})
;for(const[e,t,n]of[["model-acw",-1,!1],["model-cw",1,!1],["model-fast-acw",-1,!0],["model-fast-cw",1,!0]]){const o=R(e),i=()=>{
_()&&!R("xray-panel").hidden&&pe(t*(n?3.6:.72),n?40:100)};if(o.addEventListener("click",e=>{n&&0!==e.detail||i()}),n){o.addEventListener("pointerdown",e=>{
!e.isPrimary||void 0!==e.button&&0!==e.button||(e.preventDefault(),he(),le={id:e.pointerId,button:o},o.setPointerCapture(e.pointerId),i(),te=setInterval(()=>{
le&&!R("xray-panel").hidden&&!document.hidden&&_()?i():he()},40))});for(const e of["pointerup","pointercancel","lostpointercapture"])o.addEventListener(e,e=>{
le?.id===e.pointerId&&he()})}}function ge(){he(),Me()
;const e=location.hash.replace(/^#/,""),t="intro"===e&&V?"saved":e,n=Boolean((["intro","daily"].includes(t)||"saved"===t&&V)&&2===w.length)
;if(R("daily-date").textContent=`${r()} · A new lock at midnight Pacific`,n){if("daily"===t&&w[1].id!==`daily-${r()}`)try{w[1]=a(v)}catch(e){
return R("room-status").textContent=e.message,void(location.hash="room")}const e=J(t);b===t&&Pe?.id===e.id||je(t)}else Se.hide();R("room").hidden=n,R("lock-page").hidden=!n,
document.title=n?`${Pe.title} · Safecrack`:"Safecrack",R(n?"lock-title":"welcome-title").focus({preventScroll:!0}),window.scrollTo(0,0)}
R("xray-close").addEventListener("click",he),document.addEventListener("keydown",e=>{"Escape"===e.key&&he()}),window.addEventListener("blur",()=>{he(),T.reset()}),
document.addEventListener("visibilitychange",()=>{document.hidden&&(he(),T.reset())}),
R("reset").addEventListener("click",()=>Re.isReplay&&Re.running||Re.isOwnerPractice||Re.isDialInstructions&&Re.running?(he(),ke.cancel(null),Fe(),we.startSession({confirm:!0,
fresh:!0}),Re.start(0,performance.now()),clearInterval(Ee),Ee=setInterval(()=>{document.hidden||(Re.tick(performance.now()),de())},100),void de()):Re.isPostOpen&&Re.running?(he(),
ke.cancel(null),Re.restartTask(performance.now()),void de()):(he(),$.reset(),F.reset(),Le.reset(),ne&&(Le.alignmentTolerance=3.6+1e-7),oe=!1,we.resetDial(),we.stop(),Ae.reset(),
de(),Me(),void(ne&&($e(),de())))),R("model-reset").addEventListener("click",()=>R("reset").click()),R("open-lock").addEventListener("click",()=>{location.hash=V?"saved":"intro",
ge()}),R("open-daily").addEventListener("click",()=>{location.hash="daily"}),R("back").addEventListener("click",()=>{location.hash="room"}),window.addEventListener("hashchange",ge)
;import{guidanceSpeechAllowed as me}from"./voice.js";import{setupRecordedVoice as fe}from"./recorded-voice.js";import{setupAudioDiagnostics as ve}from"./audio-diagnostics.js"
;const we=x();R("iphone-audio-policy").hidden=!we.speechExclusive;const ke=fe({sounds:we});let be=!ke.loading;ke.loading?.then(e=>{be=e,de()}),ve({sounds:we,voice:ke});const ye=E({
sounds:we}),xe={blocked:"Bolt blocked — the candidate pattern did not open the lock.",wheel3gate:"Wheel 3 gate passing — high metallic touch.",
wheel2gate:"Wheel 2 gate passing — middle metallic note.",wheel1gate:"Wheel 1 gate passing — low hollow note.",pickup:"Wheel pickup — tabs engaging.",
gate:"Gate approach — listen for the low ring.",settle:"Setting saved — the wheel has settled.",fence:"Fence down — all gates aligned.",
bolt:"Bolt retracting — scrape, then the opening clunk."};function Ce(e,t=1){
if(["pickup","gate","wheel3gate","wheel2gate","wheel1gate","settle"].includes(e)&&!R("register-events").checked)return!1;const n=we.play(e,"fence"===e?.16:0,t)
;return n&&(R("sound-status").textContent=xe[e]),n}R("register-events").addEventListener("change",()=>{if(T.reset(),
!R("register-events").checked)for(const e of["pickup","gate","wheel3gate","wheel2gate","wheel1gate","settle"])we.stopEffect(e)
;R("sound-status").textContent=we.enabled?R("register-events").checked?"Lock event registration on.":"Lock event registration off. Dial clicks, fence and bolt sounds remain on.":"Mechanical sounds off.",
de()});const Le=new n(e=>{B?.push(e),"open"===e.type&&(!function(){if(!Le.open)return;if(z.add(Pe.id),"saved"===b){if(!Le.open)return;return X=Pe.id,void Te()}if("daily"===b){
if(!Le.open)return;return G=Pe.id,W.show(Pe.gates,Pe.id,Pe.title),void(R("win-challenge").hidden=!1)}Te()}(),Se.show());const t="gatepass"===e.type?i(4===Le.wheels.length?{
gateAudio:"single"}:Re?.script,e.wheel):{pickup:"pickup",set:"settle",fence:"fence",open:"bolt"}[e.type];if(t){
!Ce(t)||"gatepass"!==e.type||4!==Le.wheels.length&&"single"!==Re?.script?.gateAudio||(R("sound-status").textContent="Gate sound — the same high note for every wheel.")}})
;Le.configureGates(w[0]?.gates??[93,62,58,79]);const Se=y(Le,{available:Z}),Ae=new C(e=>{we.speechExclusive||ke.speak(e,{interrupt:!1})});let Ee=null;async function Ie(){
ke.isBusy()&&ke.cancel(null);const e=await we.prepareSpeechSession();return e||(R("guide-status").textContent=R("sound-status").textContent,de()),e}function De(e,t={}){
Ae.reserveGuidance(performance.now()),R("guide-status").textContent=e,R("xray-command").textContent=e;!(!(t.silent||!me(t,we.speechExclusive))&&ke.speak(e,{interrupt:t.interrupt,
queue:!1,crack:Re instanceof A,dial:Re instanceof u,discovery:Re instanceof d||"post-guide-complete"===t.kind,onDone:t.onDone}))&&t.onDone&&t.onDone(),
"replay-complete"===t.kind&&["daily","saved"].includes(b)&&Te(!0),de(),"open"===t.kind&&(he(),Se.show(),ye.show()),Re.running||(clearInterval(Ee),
R("guide-start").textContent="Crack Open With AI")}function Oe(e){return new("single"===e?.gateAudio?A:"hypothesis"===e?.mode?S:L)(De,{pack:Le,script:e,
quietActions:we.speechExclusive,..."hypothesis"===e?.mode?{onCue:Ce,onPlacementCue:({wheel:t,wheelNumber:n,trial:o,dial:s,direction:a,soundNeeded:r})=>{
ke.isBusy()&&ke.cancel(null),F.positioned({wheel:n,trial:o,dial:s,direction:a});const l=i(e,t)
;return r&&Ce(l)&&(R("sound-status").textContent="Trial assignment positioned — see POSITIONED; GATE records actual crossings."),Math.max(350,1e3*we.duration(l)+100)}}:{},
boltDuration:()=>1e3*we.duration("bolt")})}let Pe=w[0],Re=Oe(Pe);function Me(){N&&(N=null,R("pass-through-panel").hidden=!0),T.reset(),void 0!==Re&&(we.cancelPreparation(),
Re.stop(),clearInterval(Ee),ke.cancel(null),ye.hide(),R("guide-start").textContent="Crack Open With AI",
R("guide-status").textContent=ne?"No AI assistant. Listen to the mechanism, observe the mechanism, and solve the lock yourself.":"Choose AI assistance or solve by listening. "+("intro"===b?"AR-X-Ray Lock Model is available for this introduction.":Z()?`Lock Model is unlocked for this ${"saved"===b?"saved":"daily"} lock.`:`Open the ${"saved"===b?"saved":"daily"} lock to unlock Lock Model.`),
R("xray-command").textContent="Free dial",de())}function je(e){W.hide(),R("win-challenge").hidden=!0,q=null,R("owner-result").hidden=!0,R("win-print").hidden=!0,he(),Me(),
we.stop(),ke.cancel(null),Se.hide(),b=e,Pe=J(e),Le.configureGates(Pe.gates),ne&&(Le.alignmentTolerance=3.6+1e-7),$.reset(),F.reset(),oe=!1,we.resetDial(),Ae.reset(),Re=Oe(Pe),
R("lock-title").textContent=`${Pe.title} · Four wheels`;const t="intro"===e?"AR-X-Ray Lock Model":"Lock Model";R("xray-open").textContent=t,
R("xray-open").setAttribute("data-model-kind",e),R("xray-close").setAttribute("aria-label",`Close ${t}`),
R("xray-title").textContent="intro"===e?"AR-X-Ray Lock Model · Introduction":`Lock Model · ${Pe.title}`,
R("guide-status").textContent=ne?"No AI assistant. Listen to the mechanism and solve the lock yourself.":"intro"===e?"Explore with AR-X-Ray Lock Model, follow the AI assistant, or solve by listening.":"Listen, make observations, and test your trials. AI assistance is optional; Lock Model unlocks after opening the lock.",
"saved"===e&&(R("guide-status").textContent="Previously cracked lock loaded. Lock Model and saved dial instructions are available. Open it independently or use Dial Open With AI."),
"daily"===e&&Q()&&(W.show(Pe.gates,Pe.id,Pe.title),R("win-challenge").hidden=!1),"saved"===e&&H()&&Te(),de()}function $e(){
const t="saved"===b?U.plan:"intro"===b?e(Le.gateSettings):c(Le.gateSettings),n=f(Le.gateSettings,t);N=n.valid?new m(Le,n):null,R("pass-through-panel").hidden=!N||!z.has(Pe.id),
R("pass-through-rows").textContent=n.stops.map((e,t)=>`${e.wheel?`Wheel ${e.wheel}`:"Clear"}: ${e.direction<0?"ACW":"CW"} ${String(e.position).padStart(2,"0")} — appearance ${e.appearance}${t===n.stops.length-1?" → try handle":" → reverse"}`).join("\n")
}function Te(t=!1){const n="daily"===b,o="saved"===b,i=n||o;if(o&&!H())return;if(n&&(!W.settingsOK||!W.instructionsOK))return
;if(q=o?structuredClone(U.plan):n?W.replay:e(Le.gateSettings),!q)return;R("owner-table").hidden=!q.valid,R("owner-print").disabled=!q.valid,R("win-print").disabled=!q.valid,
R("owner-sequence-label").textContent=o?"Saved dial instructions":n?"Your verified dial instructions":"Owner’s Dial Instructions",
R("owner-sequence-note").textContent=i?`Start ${q.stops[0].direction<0?"anticlockwise":"clockwise"} from Reset at zero. Stop at fence drop, then use the Retract bolt handle on the front of the safe to open the door. Do not turn the dial further.`:"Start from Reset at zero.",
R("owner-tolerance").textContent="Pass each gate and stop at the stated integer and appearance. Reverse for the next row; on the final row keep the dial still and try the handle. No extra click or timed pause. A verified crossing is centred when the leg ends. Choose Dial Open With AI for target dots and spoken guidance.",
R("owner-validity").textContent=q.valid?i?t?"Sequence successful. All gates are aligned and the fence is down.":"Your sequence has been verified against the free-moving mechanism.":"Verified against the free-moving mechanism.":"This lock needs assisted wheel holds in the current model. Direct owner practice is unavailable.",
R("owner-result").hidden=!1,R("win-print").hidden=!1,R("owner-lock-name").textContent=Pe.title,
R("owner-settings").textContent=q.settings.map(e=>Math.abs(e-Math.round(e))<1e-7?String(Math.round(e)).padStart(2,"0"):e.toFixed(2)).join(" / ");const s=f(q.settings,q)
;R("owner-stops").replaceChildren(),R("owner-gates").replaceChildren();for(const e of s.stops){const t=document.createElement("tr")
;for(const n of[null===e.wheel?"Clear":String(e.wheel),e.direction<0?"ACW":"CW",String(e.position).padStart(2,"0"),String(e.appearance)]){const e=document.createElement("td")
;e.textContent=n,t.append(e)}R("owner-stops").append(t)}for(const e of q.stops){const t=document.createElement("tr")
;for(const n of[null===e.wheel?"Clear":String(e.wheel),e.direction<0?"ACW":"CW",Number(e.number).toFixed(2),String(e.appearance)]){const e=document.createElement("td")
;e.textContent=n,t.append(e)}R("owner-gates").append(t)}}function Ne(){if(!q?.valid)return;const e=h({title:"saved"===b?U.title:Pe.title,source:"saved"===b?U.source:{kind:b,
id:Pe.id},settings:q.settings,plan:q}),t=URL.createObjectURL(new Blob([e],{type:"application/json"})),n=document.createElement("a");n.href=t,
n.download=`lock-details-${Pe.id.replace(/[^a-z0-9-]/gi,"-")}.json`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),1e3)}function Fe(){$.reset(),Le.reset(),F.reset(),
we.resetDial(),we.stop(),Ae.reset(),oe=!1}function We(e){R("saved-lock-status").textContent=e}R("open-lock").disabled=R("open-daily").disabled=2!==w.length,
R("room-status").textContent=k?`Locks unavailable: ${k}. Reload to try again.`:"",2===w.length&&je("intro"),R("solo-bolt").addEventListener("click",function(){
const e=N??(Re.isDialInstructions?Re.opening:null);if(e?.tryHandle()&&($.rotation=Le.dial,$.stop(),we.resetDial(Le.dial)),
Re.isPostOpen||Re.isReplay&&!Re.isOwnerPractice||Re.practiceFailed||!1===Re.checkPracticeSettings?.())return
;const t=!ne&&!Re.isOwnerPractice&&Re.running,n=Number.isInteger(Re.attemptIndex)?Re.attemptIndex+1:null,o=Le.retractBolt();!o&&Re.visual&&Re.running&&Re.fail(),o?(Re.stop(),
clearInterval(Ee),ke.cancel(null),oe=!0,he(),Se.show(),ye.show(),t&&(Re.phase="open",
De(Re.visual||Pe.recordedCrack?"Door open. Congratulations! You cracked it!":(n?`That ends trial ${n}. `:"")+"Door open. Congratulations!",{kind:"handle-open",interrupt:!0
}))):Re.blockedHandle?.(performance.now())?he():ne&&(R("guide-status").textContent="Bolt remains blocked. Follow the dial instructions and try the handle again."),de()}),
R("solo-start").addEventListener("click",()=>{he(),Me(),ne=!0,oe=!1,R("register-events").checked=!0,$.reset(),Le.reset(),Le.alignmentTolerance=3.6+1e-7,F.reset(),we.resetDial(),
we.stop(),Ae.reset(),ke.cancel(null),we.startSession({confirm:!0,fresh:!0}),$e(),
R("guide-status").textContent="No AI assistant. Pass each gate and stop at the instructed integer, then reverse. On the final wheel, try the handle. No extra click or timed pause.",
R("xray-command").textContent="No AI assistant",de(),R("lock-title").scrollIntoView?.({block:"start",behavior:"smooth"})}),R("guide-start").addEventListener("click",async()=>{
ne=!1,oe=!1,R("register-events").checked=!0,Re.stop(),Re=Oe(Pe),Re.script&&(clearInterval(Ee),he(),we.speechExclusive&&!await Ie()||(ke.beginSession(),we.startSession({fresh:!0}),
$.reset(),F.reset(),Le.reset(),ne&&(Le.alignmentTolerance=3.6+1e-7),oe=!1,we.resetDial(),we.stop(),Ae.reset(),de(),Re.start($.rotation,performance.now()),Se.render(),
R("guide-start").textContent="Crack Open With AI",R("lock-title").scrollIntoView?.({block:"start",behavior:"smooth"}),Ee=setInterval(()=>{
document.hidden||(Re.tick(performance.now()),de())},100)))}),document.addEventListener("visibilitychange",()=>{document.hidden?Re.pause():Re.resume(performance.now())}),
window.history.replaceState(null,"","#room"),ge(),R("main-dial-ai").addEventListener("click",()=>async function(){if(!z.has(Pe.id))return;const e=c(Pe.gates),t=new u(De,{pack:Le,
plan:e,visual:!0,quietActions:we.speechExclusive,beginClicks:(e,t)=>we.startIntegerClicks(e,t)});t.plan.valid?(he(),Me(),ne=!1,Fe(),Se.hide(),
we.speechExclusive&&!await Ie()||(ke.beginSession(),Re=t,we.startSession({confirm:!0,fresh:!0}),Re.start(0,performance.now()),de(),R("lock-title").scrollIntoView?.({block:"start",
behavior:"smooth"}),Ee=setInterval(()=>{document.hidden||(Re.tick(performance.now()),de())
},100))):R("guide-status").textContent="These Dial Instructions could not be verified. Please use the lock tasks to check the sequence."}()),
R("main-dial-stop").addEventListener("click",()=>{he(),Me(),Re.message="Dial Instructions stopped.",de()}),R("owner-print").addEventListener("click",Ne),
R("win-print").addEventListener("click",Ne),R("win-challenge").addEventListener("click",()=>{ye.hide(),R("post-title").focus(),R("post-open").scrollIntoView?.({block:"start",
behavior:"smooth"})}),R("post-guide-start").addEventListener("click",async()=>{"daily"===b&&Q()&&W.plan?.valid&&(he(),Me(),ne=!1,
we.speechExclusive&&!await Ie()||(ke.beginSession(),we.startSession(),Re=new d(De,{pack:Le,post:W,reset:Fe}),Se.show(),Re.start(0,performance.now()),de(),
R("lock-title").scrollIntoView?.({block:"start",behavior:"smooth"}),Ee=setInterval(()=>{document.hidden||(Re.tick(performance.now()),de())},100)))}),
R("post-guide-stop").addEventListener("click",()=>{
he(),Me(),R("post-guide-status").textContent="Task guidance stopped. Your entries are kept; continue independently or start the walkthrough again."}),
R("post-step-form").addEventListener("submit",e=>{if(e.preventDefault(),!Re.isPostOpen||!Re.entry)return
;const t=R("post-step-number").value.trim(),n=R("post-step-count").value.trim(),o=Re.submitEntry(""===t?NaN:Number(t),""===n?NaN:Number(n),performance.now())
;o.valid?(document.activeElement?.blur?.(),de()):R("post-step-feedback").textContent=o.message}),R("load-saved-lock").addEventListener("click",()=>R("saved-lock-file").click()),
R("saved-lock-file").addEventListener("change",async()=>{const e=R("saved-lock-file").files?.[0];if(!e)return;const t=++K;R("saved-lock-file").value="";try{
if(e.size>g)throw new Error("This saved-lock file is too large.");const n=await e.text();if(t!==K)return;const o=p(n),i="intro"===o.source.kind?w[0]:v,a=s({...structuredClone(i),
id:"saved-"+ ++Y,title:`Saved lock · ${o.title}`,gates:[...o.settings]});U=o,V=a,X=a.id,ne=!1,z.add(a.id),R("first-lock-name").textContent=`Saved lock · ${o.title}`,
R("first-lock-description").textContent="Previously cracked · Lock Model available",R("open-lock").setAttribute("aria-label",`Open saved lock · ${o.title}`),je("saved"),
We("Saved lock replaces the introductory lock. Today’s Daily lock is unchanged."),location.hash="saved",ge()}catch(e){t===K&&We(`Could not load lock: ${e.message}`)}});
