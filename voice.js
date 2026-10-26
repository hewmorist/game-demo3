export function guidanceSpeechAllowed(e={},n=!1){return!(e.silent||n&&(e.duringAction||"gate"===e.kind))}export function recommendedVoices(e){
const n=e.filter(e=>!0===e.localService),t=n.filter(e=>/^en(?:[-_]|$)/i.test(e.lang)),c=t.length?t:n,o=e=>{const n=`${e.name} ${e.voiceURI}`
;return(/premium|enhanced|natural|neural/i.test(n)?100:0)-(/espeak|formant|novelty|whisper|trinoids|zarvox|boing|bells|bubbles|bad news|good news/i.test(n)?100:0)-(/android/i.test(n)?20:0)-(/compact/i.test(n)?5:0)
},i=[...c].sort((e,n)=>o(n)-o(e)||Number(n.default)-Number(e.default)||e.name.localeCompare(n.name)||e.voiceURI.localeCompare(n.voiceURI)),a=i[0];if(!a)return[]
;const l=o(a)>=0?0:o(a),s=new Set,r=new Set;return i.filter(e=>{if(o(e)<l||r.has(e.voiceURI))return!1
;const n=`${e.name.toLowerCase().replace(/\b(premium|enhanced|natural|neural|compact)\b/g,"").replace(/[^a-z0-9]/g,"")}:${e.lang.toLowerCase().replace("_","-")}`
;return!s.has(n)&&(s.add(n),r.add(e.voiceURI),!0)}).slice(0,6)}export function allEnglishVoices(e){const n=new Set
;return e.filter(e=>!(!0!==e.localService||!/^en(?:[-_]|$)/i.test(e.lang)||n.has(e.voiceURI))&&(n.add(e.voiceURI),
!0)).sort((e,n)=>Number(/^en[-_]GB$/i.test(n.lang))-Number(/^en[-_]GB$/i.test(e.lang))||e.name.localeCompare(n.name)||e.lang.localeCompare(n.lang)||e.voiceURI.localeCompare(n.voiceURI))
}export function setupVoice({synth:e=window.speechSynthesis,Utterance:n=window.SpeechSynthesisUtterance,doc:t=document,storage:c=null,onSpeechActivity:o=()=>{}}={}){
const i=e=>t.getElementById(e),a=i("voice-select"),l=i("voice-status"),s=i("voice-test"),r=i("voice-stop"),d=i("voice-enabled"),u=i("voice-phrase"),v=i("voice-all")
;let h=[],p=0,g=null,f=null;const b=()=>o(null!==g);try{c??=window.localStorage}catch{}const m=e=>{try{return c?.getItem(e)}catch{return null}},k=(e,n)=>{try{c?.setItem(e,n)
}catch{}};let w=m("safecrack.voice");function y(n="Speech stopped.",t=!1){p++,g=null,f=null,e?.cancel(),t||b(),r.disabled=!0,n&&(l.textContent=n)}function C(){const n=a.value||w
;h=(v?.checked?allEnglishVoices:recommendedVoices)(e.getVoices()),a.replaceChildren();for(const e of h){const n=t.createElement("option");n.value=e.voiceURI,
n.textContent=`${e.name} · ${e.lang}`,a.append(n)}const c=h.find(e=>e.voiceURI===n)??h.find(e=>e.voiceURI===w)??h[0];c&&(a.value=c.voiceURI),a.disabled=!c,
s.disabled=!c||!d.checked,
l.textContent=c?d.checked?"Choose a voice, then tap Test voice. Uses an on-device voice.":"Voice off.":"Waiting for on-device voices. If none appear, check your device’s speech settings."
}function S(t,c={}){if(!d.checked)return b(),!1;if(h.length||C(),!h.length)return l.textContent="No on-device voice is ready yet. Choose a voice below, then tap Test voice.",b(),!1
;if(g&&!1===c.interrupt)return c.queue&&(f={text:t,options:c,expires:Date.now()+6e3}),!1;if(!d.checked||!h.length)return!1;const o=h.find(e=>e.voiceURI===a.value);if(!o)return b(),
!1;g||e.speaking||e.pending?y(null,!0):(p++,f=null),e.paused&&e.resume();const i=p,s=new n(t);g=s,b(),s.voice=o,s.lang=o.lang,s.rate=.9,s.pitch=1,s.volume=1,
l.textContent="Starting voice…",r.disabled=!1,s.onstart=()=>{i===p&&(l.textContent=`Speaking: ${t}`)},s.onend=()=>{if(i!==p)return;g=null,r.disabled=!0,l.textContent="Ready."
;const e=f;f=null,c.onDone?.(),!g&&e&&Date.now()<e.expires&&S(e.text,e.options),b()},s.onerror=e=>{i===p&&(g=null,r.disabled=!0,
l.textContent=`Speech unavailable (${e.error||"unknown error"}). Tap Test voice to try again.`,f=null,c.onDone?.(),b())};try{e.speak(s)}catch{return g=null,r.disabled=!0,
l.textContent="Could not start speech. Try another voice.",b(),!1}return!0}if(d.checked="false"!==m("safecrack.voiceEnabled"),
v&&(v.checked="false"!==m("safecrack.voiceAllEnglish")),!e||!n)return a.disabled=s.disabled=r.disabled=d.disabled=!0,v&&(v.disabled=!0),
l.textContent="Speech synthesis is unavailable in this browser.",{speak:()=>!1,cancel:()=>{},isBusy:()=>!1,beginSession:()=>!1};return C(),e.addEventListener("voiceschanged",C),
s.addEventListener("click",()=>{C(),S(u.value)}),v?.addEventListener("change",()=>{y(null),k("safecrack.voiceAllEnglish",String(v.checked)),C()}),
r.addEventListener("click",()=>y()),a.addEventListener("change",()=>{y("Ready. Tap Test voice to hear this voice."),w=a.value,k("safecrack.voice",w)}),
d.addEventListener("change",()=>{y(d.checked?"Voice on. Tap Test voice.":"Voice off."),k("safecrack.voiceEnabled",String(d.checked)),s.disabled=!d.checked||!h.length}),
window.addEventListener("hashchange",()=>y(null)),t.addEventListener("visibilitychange",()=>{t.hidden&&y(null)}),{speak:S,cancel:y,beginSession:function(){return d.checked=!0,
k("safecrack.voiceEnabled","true"),g||e.speaking||e.pending?y(null,!0):(p++,f=null),e.paused&&e.resume(),C(),o(h.length>0),h.length>0},isBusy:()=>null!==g}}
