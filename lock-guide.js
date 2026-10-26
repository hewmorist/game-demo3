import{WheelPack as t}from"./wheel-pack.js";import{dialNumber as i,dialNumberName as e}from"./dial-announcer.js";import{validatePuzzle as s}from"./puzzle-script.js"
;export function greeting(t=new Date){const i=t.getHours();return`Good ${i<12?"morning":i<18?"afternoon":"evening"}, Peter.`}export class LockGuide{
constructor(i,{pack:e=new t,onCue:n=()=>{},boltDuration:h=()=>1250,script:r}={}){this.script=r?s(r):null,this.announce=i,this.pack=e,this.onCue=n,this.boltDuration=h,
this.running=!1,this.commandId=0}setScript(t){this.running&&this.stop(),this.script=t?s(t):null}get step(){return this.script.steps[this.stage]}get direction(){
return"anti"===this.step.direction?-1:1}line(t,i={}){return this.script.lines[t].replace(/\{(\w+)\}/g,(t,e)=>i[e]??"")}beginLesson(){this.script.exploration?(this.phase="explore",
this.exploreWrongTravel=0,this.observed=new Map,this.spokenObservations=new Set,this.exploreDirection="anti"===this.script.exploration.direction?-1:1,this.resetReversal(this.now),
this.command(this.script.exploration.command)):this.beginStage()}exploreEvents(t,i){if(i*this.exploreDirection<=0)return this.exploreWrongTravel+=Math.abs(i),
void(this.exploreWrongTravel>=7.2&&(this.phase="explore-restart",this.command(this.script.exploration.restart)))
;this.exploreWrongTravel=Math.max(0,this.exploreWrongTravel-Math.abs(i));for(const i of t){if(!["pickup","gatepass"].includes(i.type))continue
;const t=3-i.wheel,e=`${i.type}:${t}`,s=(this.observed.get(e)??0)+1;this.observed.set(e,s)
;for(const[e,n]of this.script.exploration.observations.entries())if(!this.spokenObservations.has(e)&&n.event===i.type&&n.wheel===t&&n.occurrence===s){
if(this.spokenObservations.add(e),n.finish)return this.phase="explore-rest",void this.command(n.say);this.command(n.say)}}}start(t,i,e=new Date){
if(!this.script)throw new Error("Select a puzzle script before starting guidance");this.pack.reset(),this.pack.training=!0,this.rotation=t,this.pack.turnTo(t,{emitPickups:!1}),
this.stage=0,this.now=i,this.running=!0,this.slow=!1,this.fine=!1,this.lastHint=-1/0,this.phase="briefing",this.wrongWay=!1,this.lastCorrection=-1/0,this.lastMove=i,this.paused=!1,
this.resetReversal(i),this.command(this.line("greeting",{greeting:greeting(e)}),()=>this.beginLesson())}command(t,i){const e=++this.commandId;this.waiting=!0,
this.waitSince=this.now,this.afterCommand=i,this.lastHint=this.now,this.announce(t,{kind:"command",interrupt:!0,onDone:()=>this.acknowledge(e)})}acknowledge(t=this.commandId){
if(!this.running||!this.waiting||t!==this.commandId)return;this.waiting=!1;const i=this.afterCommand;this.afterCommand=null,i?.()}beginStage(){this.phase="turn",this.slow=!1,
this.fine=!1,this.wrongWay=!1,this.closestBand=1/0,this.stepDirection=this.direction,this.reportedPickups=new Set,this.resetReversal(this.now);const t=this.direction
;if(3===this.stage)this.target=this.rotation+this.step.degrees;else{const i=360*(this.step.appearances-1)
;for(this.target=this.pack.settingAngle(3-this.step.wheel,t);(this.target-this.rotation)*t<i-1e-7;)this.target+=360*t
;for(;(this.target-this.rotation)*t>=i+360-1e-7;)this.target-=360*t}this.command(this.step.command)}get instruction(){
if(!this.running)return"open"===this.phase?"Door open. Congratulations!":"";if("explore-restart"===this.phase)return"Restart the guided lock to repeat the listening test."
;if("explore-complete"===this.phase)return"Listen, then turn.";if("explore"===this.phase)return this.exploreDirection<0?"↶ Anticlockwise · Listening":"↷ Clockwise · Listening"
;if("step"===this.phase)return this.targetError()<0?"↶ Step anti":"↷ Step clock"
;if("turn"!==this.phase)return"briefing"===this.phase?"Listen, then turn.":["stop-number","await-rest","explore-rest"].includes(this.phase)?"Stop. Let the dial settle.":"Setting saved."
;return`${this.direction<0?"↶ Anticlockwise":"↷ Clockwise"}${this.fine?" · Single clicks":this.slow?" · Slow":""}${this.wrongWay?" — other way. Progress saved.":""}`}
get readingStep(){return this.fine?1:this.slow?5:10}get numberOptions(){return{silent:this.running&&"turn"!==this.phase,
excludeNumber:this.running&&this.stage<3&&this.fine?i(this.target):void 0}}targetError(){const t=((this.target-this.rotation+180)%360+360)%360-180
;return Math.abs(t+180)<1e-7?180*this.direction:t}atTarget(t=this.stepDirection){const e=i(this.rotation),s=i(this.target);return e===s||e===(s-t+100)%100}setWheel(){
this.phase="confirm",this.pack.latch(3-this.step.wheel),this.pack.turnTo(this.rotation,{emitPickups:!1}),this.command(this.step.set,()=>{this.stage++,this.beginStage()})}
reviewStep(){const t=this.targetError();this.atTarget()?this.setWheel():(this.stepDirection=t<0?-1:1,this.stepReviewRotation=this.rotation,
this.command(this.line(t<0?"stepAnti":"stepClock")))}resetReversal(t=this.now){this.wrongTravel=0,this.reverseSince=null,this.regripUntil=t+300,this.wrongWay=!1}move(t,i,s){
const n=this.rotation;this.rotation=t,this.now=s;const h=t-n,r=this.direction;if(Math.abs(h)>1e-5&&(this.lastMove=s),this.running&&"step"===this.phase&&!this.paused){
const i=Math.abs(h)>1e-5?Math.sign(h):this.stepDirection;if(this.atTarget(i))return this.pack.turnTo(t),this.setWheel(),t}if(this.running&&"explore"===this.phase){
const i=this.pack.turnTo(t);return this.exploreEvents(i,h),t}if(!this.running||"turn"!==this.phase)return this.pack.turnTo(t),t;const o=this.stage<3?this.target-3.6*r:this.target
;if(h*r>0&&(n-o)*r<=1e-7&&(t-o)*r>=-1e-7)return this.stage<3?(this.pack.turnTo(t),this.phase="stop-number",this.wrongWay=!1,this.command(e(o),()=>{this.phase="await-rest",
this.command(this.line("stop"))}),t):(this.pack.turnTo(o),this.pack.turnTo(t),this.phase="stopped",this.wrongWay=!1,3===this.stage&&(this.boltSoundEnds=s+this.boltDuration()),
this.command(this.line("stop"),()=>{this.phase="bolt"}),t);const a=this.pack.turnTo(t);if(h*r<0)return null===this.reverseSince&&(this.reverseSince=s),
this.wrongTravel+=Math.abs(h),this.wrongTravel>=7.2&&s-this.reverseSince>=250&&s>=this.regripUntil&&(this.wrongWay=!0,s-this.lastCorrection>6e3&&(this.lastCorrection=s,
this.announce(this.line("wrongWay",{command:this.step.command}),{kind:"correction",interrupt:!0,queue:!1}))),t;if(!h)return t;this.wrongTravel=Math.max(0,this.wrongTravel-h*r),
(h*r>=1.8||this.wrongTravel<.3)&&(this.wrongTravel=0,this.reverseSince=null),this.wrongWay=!1;const p=Math.abs(this.target-t)/3.6;if(this.stage<3){
const t=p<=5?5:p<=10?10:p<=30?30:1/0;t<this.closestBand&&(this.closestBand=t,this.onCue("gate",5===t?1:10===t?.8:.6))}
if(this.stage<3&&!this.slow&&p<=this.step.slowAt+1e-7)this.slow=!0,this.command(this.line("slow",{command:this.step.command.replace(/\.$/,"")
}));else if(this.stage<3&&!this.fine&&p<=this.step.fineAt+1e-7)this.fine=!0,this.command(this.line("singleClicks"));else{
const t=a.filter(t=>"pickup"===t.type&&!this.pack.latched.has(t.wheel)&&!this.reportedPickups.has(t.wheel));for(const i of t)this.reportedPickups.add(i.wheel);const i=t.at(-1)
;i?this.announce(t.length>1?this.line("engagedMany",{count:3===t.length?"Three":"Two"}):this.line("engagedOne",{wheel:["three","two","one"][i.wheel]}),{kind:"report",interrupt:!1,
queue:!1}):s-this.lastHint>18e3&&p>25&&(this.lastHint=s,this.announce(this.line("keepGoing"),{kind:"report",interrupt:!1}))}return t}tick(t){if(this.now=t,
this.running&&!this.paused){if(this.waiting&&t-this.waitSince>1e4&&this.acknowledge(),
"explore-rest"===this.phase&&!this.waiting&&t-this.lastMove>=500)return this.phase="explore-complete",void this.command(this.script.exploration.complete,()=>this.beginStage())
;if("await-rest"===this.phase&&!this.waiting&&t-this.lastMove>=500)return this.phase="step",this.slow=!0,this.fine=!0,this.resetReversal(t),void this.reviewStep()
;if("step"===this.phase&&!this.waiting&&t-this.lastMove>=500){const t=Math.abs(this.rotation-this.stepReviewRotation)
;if(t>1e-5&&(t>=.36||this.atTarget()))return void this.reviewStep()}"bolt"!==this.phase||t>=this.boltSoundEnds&&this.pack.open&&(this.running=!1,this.phase="open",
this.announce(this.line("open"),{kind:"open",interrupt:!0}))}}pause(){this.paused=!0}resume(t){this.paused=!1,this.now=t,this.lastMove=t}stop(){this.running=!1,this.commandId++,
this.waiting=!1,this.afterCommand=null,this.pack.rest()}}
