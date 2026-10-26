import{verifyInstructions as e}from"./post-open.js";import{wrap as t}from"./wheel-pack.js";import{passThroughInstructions as o}from"./pass-through.js"
;import{stopBeforeInstructions as s}from"./main-dial-guide.js";export const savedLockFormat="safecrack-lock";export const savedLockMechanism="four-wheel-tabs-352-v1"
;export const savedLockMaxBytes=65536;const r=e=>{throw new Error(e)},n=e=>"string"==typeof e&&e.trim().length>0&&e.length<=160,i=e=>"clockwise"===e?1:"anticlockwise"===e?-1:0
;export function validateSavedLock(c){c?.format===savedLockFormat&&1===c.version||r("Choose a Safecrack saved-lock JSON file (version 1)."),
c.mechanism!==savedLockMechanism&&r("This file uses a different lock mechanism."),
n(c.title)&&n(c.source?.id)&&["intro","daily"].includes(c.source?.kind)||r("The saved lock description is invalid."),
Array.isArray(c.wheelOrder)&&4===c.wheelOrder.length&&!c.wheelOrder.some((e,t)=>e!==4-t)||r("Wheel settings must be ordered 4, 3, 2, 1.");const l=c.settings
;Array.isArray(l)&&4===l.length&&!l.some(e=>!Number.isFinite(e)||e<0||e>=100)||r("Four wheel settings from 0 to less than 100 are required.");const d=c.sequence,p=d?.stops
;"reset-zero"===d?.from&&"fence-drop"===d.to&&Array.isArray(p)&&[4,5].includes(p.length)||r("A complete sequence from Reset to fence drop is required.")
;const h=5===p.length,m=i(p[0]?.direction);m||r("The sequence direction is invalid."),p.forEach((e,t)=>{const o=h?0===t?null:t:t+1
;e&&e.wheel===o&&i(e.direction)===m*(t%2?-1:1)||r("The sequence must set wheels 1, 2, 3, 4 in alternating directions."),
(!Number.isFinite(e.number)||e.number<0||e.number>=100||!Number.isInteger(e.appearance)||e.appearance<1||e.appearance>20)&&r("A stopping number or appearance count is invalid.")})
;const u=e(l,m,p);u.valid||r("These settings and dial instructions do not open the lock from Reset.");let f=0;const k=p.map(e=>{const o=i(e.direction);let s=t(3.6*-e.number)
;for(;(s-f)*o<=1e-7;)s+=360*o;for(;(s-f)*o>360+1e-7;)s-=360*o;s+=360*o*(e.appearance-1),f=s
;const r=Math.abs(100*e.number-Math.round(100*e.number))<1e-7?e.number.toFixed(2):String(e.number);return{wheel:e.wheel,direction:o,target:s,number:r,appearance:e.appearance}}),v={
...u,startDirection:m,settings:[...l],stops:k},g=o(l,v);if(void 0!==c.dialInstructions){const e=c.dialInstructions,t=a("stop-before"===e?.method?s(l,v):g)
;e&&!["method","from","to"].some(o=>e[o]!==t[o])&&Array.isArray(e.stops)&&e.stops.length===t.stops.length&&!e.stops.some((e,o)=>!e||["wheel","direction","position","appearance","then"].some(s=>e[s]!==t.stops[o][s]))||r("The integer Dial Instructions do not match this lock.")
}return{title:c.title.trim(),source:{kind:c.source.kind,id:c.source.id},savedAt:"string"==typeof c.savedAt?c.savedAt.slice(0,64):null,settings:[...l],plan:v,instructions:g}}
function a(e){return{method:e.method,from:e.from,to:e.to,stops:e.stops.map((t,o)=>({wheel:t.wheel??null,direction:t.direction>0?"clockwise":"anticlockwise",position:t.position,
appearance:t.appearance,then:"pass-through"===e.method?o===e.stops.length-1?"try-handle":"reverse":t.then}))}}export function parseSavedLock(e){let t
;("string"!=typeof e||e.length>65536)&&r("This saved-lock file is too large.");try{t=JSON.parse(e)}catch{
r("Choose a saved-lock JSON file. Older HTML instructions cannot be loaded.")}return validateSavedLock(t)}
export function serializeSavedLock({title:e,source:t,settings:s,plan:n},i=new Date){n?.valid||r("Verify the dial instructions before saving this lock.");const c={
format:savedLockFormat,version:1,mechanism:savedLockMechanism,title:e,source:{kind:t.kind,id:t.id},savedAt:i.toISOString(),wheelOrder:[4,3,2,1],settings:[...s],
dialInstructions:a(o(s,n)),sequence:{from:"reset-zero",to:"fence-drop",stops:n.stops.map(e=>({wheel:e.wheel??null,direction:e.direction>0?"clockwise":"anticlockwise",
number:Number(e.number),appearance:e.appearance}))}};return validateSavedLock(c),JSON.stringify(c,null,2)+"\n"}
