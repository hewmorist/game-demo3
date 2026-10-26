import{dotOpeningIntro as t,dotCrackOn as i,dotOpeningFailure as e,dotGreeting as s}from"./dot-opening-dialogue.js"
;import{PassThroughOpening as n,passThroughInstructions as a}from"./pass-through.js";import{WheelPack as h,wrap as o}from"./wheel-pack.js"
;import{formatDial as r}from"./owner-guide.js";export function centredDialPlan(t,i){const e=new h;e.configureGates(t);const s=i.stops.map(i=>{
const s=i.wheel?t.length-i.wheel:0,n=e.settingAngle(s,i.direction),a=n+360*Math.round((i.target-n)/360);return{...i,target:a,number:r(a)}});let n=0;for(const t of s){
let i=o(t.target);for(;(i-n)*t.direction<=1e-7;)i+=360*t.direction;for(;(i-n)*t.direction>360+1e-7;)i-=360*t.direction;t.appearance=Math.round((t.target-i)*t.direction/360)+1,
e.turnTo(t.target,{allowBolt:!1}),n=t.target}return{...i,settings:[...t],stops:s,valid:e.fenceDown}}export function integerApproach(t,i,e=0){let s=t/3.6
;Math.abs(s-Math.round(s))<1e-7&&(s=Math.round(s));const n=3.6*(i>0?Math.floor(s)-1:Math.ceil(s)+1);let a=o(n);for(;(a-e)*i<=1e-7;)a+=360*i;for(;(a-e)*i>360+1e-7;)a-=360*i;return{
beforeGate:n,number:String(Math.round(o(-n)/3.6)%100).padStart(2,"0"),appearance:Math.round((n-a)*i/360)+1}}export function stopBeforeInstructions(t,i){const e=centredDialPlan(t,i)
;let s=0;const n=e.stops.map(t=>{const i=integerApproach(t.target,t.direction,s);return s=t.target,{wheel:t.wheel??null,direction:t.direction,position:Number(i.number),
appearance:i.appearance,then:"next-gate-click"}});return{method:"stop-before",from:"reset-zero",to:"fence-drop",valid:e.valid,stops:n}}export class MainDialGuide{
constructor(t,{pack:i,plan:e,beginClicks:s=()=>{},quietActions:n=!1,visual:h=!1,date:o=()=>new Date}={}){this.announce=t,this.pack=i,this.plan=a(i.gateSettings,e),
this.beginClicks=s,this.quietActions=n,this.visual=h,this.date=o,this.isDialInstructions=!0,this.script={gateAudio:"single"},this.running=!1,this.token=0}get stage(){
return this.opening?.stage??0}get step(){return this.plan.stops[this.stage]}get direction(){return this.step?.direction??1}get readingStep(){return 10}get numberOptions(){return{
silent:!0}}get catchGates(){return!1}get dot(){if(!this.visual||!this.running||"retry"===this.phase||this.opening?.failed)return null
;const t="hold"===this.phase&&this.nextAnnounced,i=this.plan.stops[this.stage+(t?1:0)]??this.step,e=(i.target-this.pack.dial)*i.direction,s=e<=36+1e-7&&e>=-3.6-1e-7;return{
position:i.position,direction:i.direction,wheel:i.wheel,colour:s?"red":i.direction<0?"blue":"green",finalApproach:s,handle:"handle"===this.phase}}get instruction(){
if(this.visual&&this.dot){const t=this.dot
;return t.handle?"Keep the dial still · Try handle":`${t.wheel?`Wheel ${t.wheel}`:"Clearing move"} · ${t.direction<0?"↶ Anticlockwise":"↷ Clockwise"}${t.finalApproach?" · Final approach":""}`
}
return"retry"===this.phase?"Reset dial to restart":"handle"===this.phase?"Keep the dial still · Try handle":`${this.direction<0?"↶ Anti":"↷ Clock"} · ${this.approachNumber} · appearance ${this.approachAppearance}`
}say(t,i=!1,e=()=>{}){this.message=t;const s=++this.token;this.waiting=!0,this.spokenAt=this.now,this.announce(t,{kind:"dial-instructions",silent:!1,duringAction:i,interrupt:!0,
onDone:()=>{this.running&&s===this.token&&(this.waiting=!1,e())}})}command(t){
return this.visual?`Go ${t.direction<0?"anti":"clock"} for ${t.appearance} dot appearances.`:`Go ${t.direction<0?"anti":"clock"}. ${t.wheel?`Wheel ${t.wheel}:`:"Clearing move:"} stop at ${String(t.position).padStart(2,"0")} on appearance ${t.appearance}.`
}start(e,a){this.stop(),this.pack.reset(),this.pack.alignmentTolerance=3.6+1e-7,this.opening=new n(this.pack,this.plan),this.now=a,this.lastMove=a,this.paused=!1,this.running=!0,
this.failureAnnounced=!1,this.introPending=!1,this.begin(!this.visual),this.visual&&(this.introPending=!0,this.say(`${s(this.date())} ${t} ${i} ${this.command(this.step)}`,!1,()=>{
this.introPending=!1}))}begin(t=!0){this.phase="turn",this.target=this.step.target,this.approachNumber=String(this.step.position).padStart(2,"0"),
this.approachAppearance=this.step.appearance,this.slow=!1,this.fine=!1,this.nextAnnounced=!1,this.beginClicks(this.pack.dial,this.direction),t&&this.say(this.command(this.step))}
beforeMove(t,i){this.now=i,this.visual&&this.introPending&&(this.introPending=!1,this.say(this.command(this.step)));const e=this.step,s=this.stage,n=this.opening.beforeMove(t)
;if(this.stage!==s){const t=this.nextAnnounced
;this.begin(!t&&!this.visual),this.visual&&!t&&this.say(`${e.wheel?`Wheel ${e.wheel} is set.`:"Clearing move complete."} ${this.command(this.step)}`)}return n}clickStops(){return[]
}move(t,i,e){if(this.now=e,Math.abs(t-this.pack.dial)>1e-7&&(this.lastMove=e),this.opening.moveTo(t),!this.running)return t;if(this.opening.failed)return this.fail(),t
;const s=(this.target-t)*this.direction;return this.opening.crossing&&Math.abs(t-this.target)<=3.6+1e-7?(this.phase="hold",
t):this.visual?(!this.fine&&this.dot?.finalApproach&&(this.fine=!0,this.slow=!0,this.say(`Go ${this.direction<0?"anti":"clock"} slow. Single clicks.`)),
t):(!this.fine&&s<=36&&s>0?(this.fine=!0,this.slow=!0,this.say(`Single clicks. Stop at ${this.approachNumber}.`,!0)):!this.slow&&s<=108&&s>0&&(this.slow=!0,
this.say(`Go ${this.direction<0?"anti":"clock"}, slowly.`,!0)),t)}tick(t){this.now=t,
!this.running||this.paused||t-this.lastMove<500||(this.waiting&&t-this.spokenAt>15e3&&(this.token++,this.waiting=!1),
this.waiting&&!this.visual||"hold"!==this.phase||(this.stage===this.plan.stops.length-1?(this.phase="handle",
this.say(this.visual?"Wheel four is set. Try the handle to retract bolt.":"Let’s try the bolt. Turn the handle.")):this.nextAnnounced||(this.nextAnnounced=!0,
this.say(`${this.visual?this.step.wheel?`Wheel ${this.step.wheel} is set. `:"Clearing move complete. ":""}${this.command(this.plan.stops[this.stage+1])}`))))}fail(){
this.phase="retry",this.opening.failed=!0,this.failureAnnounced||(this.failureAnnounced=!0,this.say(this.visual?e:"Press Reset dial to start the instructions again."))}tryHandle(){
return this.opening.tryHandle()}resetReversal(){}pause(){this.paused=!0}resume(t){this.paused=!1,this.lastMove=t}stop(){this.running=!1,this.token++,this.waiting=!1,
this.introPending=!1,this.pack.rest()}}
