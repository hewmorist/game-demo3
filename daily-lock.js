import{WheelPack as t,TAB_PLAY as e,wrap as r}from"./wheel-pack.js";import{dialInstructions as o}from"./owner-guide.js";import{validatePuzzle as n}from"./puzzle-script.js"
;import{anticlockwisePlan as a}from"./post-open.js";import{integerApproach as i}from"./main-dial-guide.js";export const FRIENDLY_STOP_MARGIN=10.8
;export function supportsFriendlyOpening(t){const e=a(t);if(!e.valid||4!==e.stops.length)return!1;let r=0;for(const t of e.stops){const e=i(t.target,t.direction,r)
;if(e.appearance<1)return!1;for(const o of[-10.8,10.8]){if(i(t.target,t.direction,r+o).appearance!==e.appearance)return!1}r=t.target}return!0}export function dailyDate(t=new Date){
const e=new Intl.DateTimeFormat("en-US",{timeZone:"America/Los_Angeles",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(t),r=t=>e.find(e=>e.type===t).value
;return`${r("year")}-${r("month")}-${r("day")}`}const s=(t,e)=>Math.abs(r(t-e+180)-180);export function supportsDailySearch(r){if(!o(r).valid)return!1;const n=new t
;n.configureGates(r);const a=n.turnTo(1440).filter(t=>"gatepass"===t.type).flatMap(t=>Array.from({length:t.count},(e,r)=>t.dial+360*r)).sort((t,e)=>t-e),i=[]
;for(const t of a)i.some(e=>s(e,t)<.1)||i.push(t);if(4!==i.length||i.some((t,e)=>i.slice(e+1).some(e=>s(t,e)<3.6)))return!1;for(let o=0;o<=90;o+=3.6){const n=new t
;n.configureGates(r);const a=1440+o;n.turnTo(a);const l=n.nextGateStop(a-2*e),c=a-l;if(c<e+3.6||c>=2*e-3.6)return!1
;if(1!==n.turnTo(l).filter(t=>"gatepass"===t.type).length||1!==i.filter(t=>s(t,l+e)<.1).length)return!1}return!0}export function dailyTrialCount(e){const r=new t
;r.configureGates(e);const o=r.turnTo(1440).filter(t=>"gatepass"===t.type).flatMap(t=>Array.from({length:t.count},(e,r)=>({dial:t.dial+360*r,wheel:t.wheel
}))).sort((t,e)=>t.dial-e.dial),n=[];for(const t of o)n.includes(t.wheel)||n.push(t.wheel)
;const a=n.filter(t=>0!==t),i=t=>t.length?t.flatMap((e,r)=>i(t.filter((t,e)=>e!==r)).map(t=>[e,...t])):[[]],s=i(a).reverse().findIndex(t=>"3,2,1"===t.join(","));return s<0?1/0:s+1}
const l={"2026-10-21":"THER"};function c(t,e,r){const o=structuredClone(t);return o.id=`daily-${e}`,o.title=`Daily lock · ${e}`,o.gates=r,n(o)}
export function createDailyPuzzle(t,e=dailyDate()){if(!/^\d{4}-\d{2}-\d{2}$/.test(e)||new Date(`${e}T12:00:00Z`).toISOString().slice(0,10)!==e)throw new Error("Invalid daily date")
;const r=l[e];if(r){const o=Array.from(r,t=>t.charCodeAt(0)-64)
;if(!supportsDailySearch(o)||dailyTrialCount(o)>3||e>="2026-10-25"&&!supportsFriendlyOpening(o))throw new Error("The literary lock does not support the daily search and opening requirements.")
;return c(t,e,o)}let o=2166136261;for(const t of`safecrack-daily-v2:${e}`)o=Math.imul(o^t.charCodeAt(0),16777619)>>>0;const n=()=>{o=o+1831565813>>>0;let t=o
;return t=Math.imul(t^t>>>15,1|t),t^=t+Math.imul(t^t>>>7,61|t),((t^t>>>14)>>>0)/4294967296},a=n(),i=e<"2026-10-27"?a<.2?1:a<.8?2:3:a<.85?1:a<.95?2:3;for(let r=0;r<1e4;r++){
const r=Array.from({length:4},()=>Math.floor(100*n()));if((!(e>="2026-10-25")||supportsFriendlyOpening(r))&&(dailyTrialCount(r)===i&&supportsDailySearch(r)))return c(t,e,r)}
throw new Error("Could not prepare today’s lock. Please try again later.")}
