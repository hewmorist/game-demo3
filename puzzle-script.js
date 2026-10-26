export function validatePuzzle(e){const s=e=>{throw new Error(`Invalid puzzle: ${e}`)}
;1===e?.version&&"string"==typeof e.id&&"string"==typeof e.title||s("version, id and title required");const n=e?.gates?.length
;Array.isArray(e.gates)&&[3,4].includes(n)&&!e.gates.some(e=>!Number.isFinite(e)||e<0||e>=100)||s("gates must be three or four nearest-to-farthest numbers from 0 to less than 100"),
Array.isArray(e.steps)&&e.steps.length===n+1||s("wheel steps and one bolt step required");const i=e=>"string"==typeof e&&e.trim().length>0&&e.length<=500;e.steps.forEach((e,t)=>{
["clock","anti"].includes(e.direction)&&i(e.command)||s("step direction and command required"),
t<n?(("wheel"!==e.type||e.wheel!==t+1||!Number.isInteger(e.appearances)||e.appearances<1||e.appearances>10||!i(e.set))&&s("invalid wheel step"),
e.slowAt>e.fineAt&&e.fineAt>1&&e.slowAt<=100||s("invalid approach thresholds")):"bolt"===e.type&&"clock"===e.direction&&Number.isFinite(e.degrees)&&36===e.degrees||s("bolt must retract 36 degrees clockwise")
});for(const n of["greeting","stop","singleClicks","stepAnti","stepClock","keepGoing","open","wrongWay","slow","engagedOne","engagedMany"])i(e.lines?.[n])||s(`missing line ${n}`)
;const t=e.exploration
;if(t&&(["clock","anti"].includes(t.direction)&&i(t.command)&&Array.isArray(t.observations)&&t.observations.length&&i(t.complete)&&i(t.restart)||s("invalid exploration"),
t.observations.forEach((e,r)=>{
["pickup","gatepass"].includes(e.event)&&e.wheel>=1&&e.wheel<=n&&Number.isInteger(e.occurrence)&&!(e.occurrence<1)&&i(e.say)&&Boolean(e.finish)===(r===t.observations.length-1)||s("invalid observation/last finish")
})),void 0===e.discovery||["progressive","blind"].includes(e.discovery)&&"single"===e.gateAudio||s("invalid discovery strategy"),
void 0===e.gateAudio||"single"===e.gateAudio&&"hypothesis"===e.mode&&void 0===e.gateLabels||s("invalid single gate audio mode"),
void 0!==e.gateLabels&&"ordinal"!==e.gateLabels&&s("unknown gate label mode"),"ordinal"===e.gateLabels&&"hypothesis"!==e.mode&&s("ordinal gate labels require hypothesis mode"),
void 0!==e.mode&&"hypothesis"!==e.mode&&s("unknown mode"),"hypothesis"===e.mode){
Array.isArray(e.signatures)&&e.signatures.length===n&&new Set(e.signatures).size===n&&!e.signatures.some(s=>"string"!=typeof s||!i(e.noteNames?.[s]))||s("one named signature per wheel required")
;const t=s=>e.signatures.includes(s);for(const n of["gateComment","gateMultiple","searchPickup","candidatePlaced","restartSearch"])i(e.lines[n])||s(`missing hypothesis line ${n}`)
;(!Array.isArray(e.searches)||e.searches.length<("progressive"===e.discovery?1:2))&&s("searches required");for(const r of e.searches){
["clock","anti"].includes(r.direction)&&i(r.command)&&i(r.complete)&&("single"===e.gateAudio?"progressive"===e.discovery?1===e.searches.length&&"clock"===r.direction&&r.until?.readings===n:r===e.searches[0]?r.until?.degrees===360*n:1===r.until?.gateCount:t(r.until?.sound)&&Number.isInteger(r.until?.occurrence)&&r.until.occurrence>=1)&&Array.isArray(r.observations)||s("invalid hypothesis search")
;for(const e of r.observations)t(e.sound)&&Number.isInteger(e.occurrence)&&!(e.occurrence<1)&&i(e.say)||s("invalid hypothesis observation")}
if(("blind"===e.discovery?void 0===e.confidence?.sound:t(e.confidence?.sound))&&e.confidence?.wheel===n&&i(e.confidence.mismatch)&&i(e.confidence.unisolated)||s("invalid confidence check"),
"blind"===e.discovery){
void 0===e.attempts&&2===e.searches.length&&"clock"===e.searches[0].direction&&"anti"===e.searches[1].direction||s("blind discovery needs two ordered searches and no preset attempts")
;for(const n of["firstPairing","nextPairing","swapPairing","pairingsFailed"])i(e.lines[n])||s(`missing blind line ${n}`)
}else Array.isArray(e.attempts)&&e.attempts.length||s("candidate attempts required")
;for(const r of e.attempts??[])i(r.command)&&i(r.failure)&&Array.isArray(r.assignments)&&r.assignments.length===n||s("invalid attempt"),
new Set(r.assignments.map(e=>e.sound)).size!==n&&s("each signature must be assigned once"),r.assignments.forEach((e,n)=>{
e.wheel===n+1&&t(e.sound)&&["clock","anti"].includes(e.fromDirection)||s("invalid candidate assignment")})}return e}export function matchesGates(e,s){
return e.gates.length===s.length&&e.gates.every((e,n)=>Math.abs(e-s[n])<1e-6)}export async function loadPuzzleCatalog(e=fetch,s="./puzzles/index.json"){async function n(s){
const n=await e(s);if(!n.ok)throw new Error(`Could not load ${s}`);return n.json()}const i=await n(s)
;if(1!==i?.version||!Array.isArray(i.files)||i.files.some(e=>!/^\.\/puzzles\/[a-z0-9-]+\.json$/.test(e)))throw new Error("Invalid puzzle catalog")
;const t=await Promise.all(i.files.map(async e=>validatePuzzle(await n(e))));if(new Set(t.map(e=>e.id)).size!==t.length)throw new Error("Duplicate puzzle IDs");return t}
export function gateSoundEffect(e,s){return"single"===e?.gateAudio?"wheel3gate":`wheel${3-s}gate`}
