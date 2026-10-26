export function setupAudioDiagnostics({sounds:e,voice:t,doc:n=document,win:o=window,href:s=globalThis.location?.href??"",now:i=()=>performance.now()}={}){
if("1"!==new URL(s,"https://safecrack.invalid").searchParams.get("audioDebug"))return null;const r=[],a=i(),c={},d=new WeakSet;let l=-1/0;const p=n.createElement("details")
;p.open=!0,p.style.cssText="margin:16px;padding:12px;background:#fff;color:#173b34;border:2px solid #173b34;border-radius:8px;";const u=n.createElement("summary")
;u.textContent="Audio diagnostic report";const g=n.createElement("p");g.textContent="Reproduce the sound problem, then copy this report. Nothing is sent automatically."
;const h=n.createElement("button");h.type="button",h.textContent="Copy audio report",
h.style.cssText="position:fixed;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:10000;background:#fff;color:#173b34;border:2px solid #173b34;box-shadow:0 2px 12px #0005;"
;const x=n.createElement("textarea");function v(){const s=e.context,i=o.navigator?.audioSession??globalThis.navigator?.audioSession;return{context:s?.state??"none",
clock:s?.currentTime,enabled:e.enabled,masterGain:e.gain?.gain?.value,speechExclusive:e.speechExclusive,speechPaused:e.speechPaused,preparingSpeech:e.preparingSpeech,
voiceBusy:t.isBusy(),speaking:o.speechSynthesis?.speaking,pending:o.speechSynthesis?.pending,paused:o.speechSynthesis?.paused,sessionType:i?.type,sessionState:i?.state,
selectedVoice:n.getElementById("voice-select")?.value??"Jennifer UK recorded",voiceVolume:n.getElementById("voice-volume")?.value,missingRecordings:t.missing?[...t.missing]:void 0}
}function b(){return JSON.stringify({revision:n.getElementById("revision")?.textContent,userAgent:o.navigator?.userAgent??globalThis.navigator?.userAgent,current:v(),effects:c,
events:r},null,2)}function f(e,t={}){r.push({ms:Math.round(i()-a),event:e,...t,...v()}),r.length>180&&r.shift(),x.value=b()}function m(){const t=e.context;t&&!d.has(t)&&(d.add(t),
f("context observed"),t.addEventListener?.("statechange",()=>f("context statechange",{observedState:t.state,currentContext:e.context===t})))}x.readOnly=!0,
x.setAttribute("aria-label","Audio diagnostic report"),x.style.cssText="display:block;width:100%;box-sizing:border-box;min-height:220px;font:12px/1.4 monospace;",p.append(u,g,x),
n.body.append(p,h);const y=e.enable;e.enable=function(...e){f("enable called");const t=y.apply(this,e);return m(),
Promise.resolve(t).then(()=>f("enable resolved"),e=>f("enable rejected",{error:String(e)})),t};const k=e.play;e.play=function(e,t=0,n=1){
const o=k.call(this,e,t,n),s=`${e}:${o?"started":"skipped"}`;return c[s]=(c[s]??0)+1,("tick"!==e||i()-l>=500)&&("tick"===e&&(l=i()),f("effect requested",{name:e,delay:t,level:n,
started:o})),o};const w=t.speak;t.missing&&(t.speak=function(e,t={}){const n=w.call(this,e,{...t,onDone:()=>{f("recorded speech ended",{text:e}),t.onDone?.()}})
;return f("recorded speech requested",{text:e,accepted:n}),n});const E=o.speechSynthesis;if(E){const e=E.speak;E.speak=function(t){f("speech requested",{text:t.text,
volume:t.volume,voice:t.voice?.voiceURI});for(const e of["start","end","error","pause","resume"])t.addEventListener?.(e,()=>f(`speech ${e}`));return e.call(this,t)}}
for(const e of["pointerdown","touchend","click","keydown"])o.addEventListener(e,t=>{f(`input ${e}`,{target:t.target?.id||t.target?.tagName})},{capture:!0})
;return h.addEventListener("click",async()=>{x.value=b();try{await o.navigator.clipboard.writeText(x.value),h.textContent="Report copied"}catch{x.focus(),x.select(),
h.textContent="Select and copy the report below"}}),m(),f("diagnostics ready"),{report:b,records:r}}
