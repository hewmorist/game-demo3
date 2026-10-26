import{WheelPack as t,TAB_PLAY as i,wrap as s}from"./wheel-pack.js";export const formatDial=t=>(Math.round(s(-t)/3.6*100)/100%100).toFixed(2).padStart(5,"0")
;export function dialInstructions(s){const e=new t;e.configureGates(s);let h=0;const n=s.length,a=Array.from({length:n
},(t,s)=>[n-1-s,(n-s)%2?-1:1,s?(n-s)*i:360*n]).map(([t,i,s])=>{let a=e.settingAngle(t,i);for(;(a-h)*i<=1e-7;)a+=360*i;for(;(a-h)*i>360+1e-7;)a-=360*i;let o=a
;for(;(o-h)*i<s-1e-7;)o+=360*i;const r=Math.round((o-a)*i/360)+1;return h=o,{wheel:n-t,direction:i,appearance:r,target:o,number:formatDial(o)}});for(const t of a)e.turnTo(t.target)
;return e.turnTo(h+36),{settings:[...s],stops:a,valid:e.open,bolt:{target:h+36,number:formatDial(h+36)}}}export class OwnerGuide{constructor(t,{pack:i,plan:s,gateAudio:e}={}){
this.isOwnerPractice=!0,this.announce=t,this.pack=i,this.plan=s,this.script={gateAudio:e},this.running=!1,this.token=0}get direction(){
return this.stage===this.plan.stops.length?1:this.plan.stops[this.stage]?.direction??-1}get readingStep(){return this.fine?1:this.slow?5:10}get numberOptions(){return{silent:!0}}
get instruction(){
return this.running?"restart"===this.phase?this.practiceFailed?"Opening practice unsuccessful. Reset dial.":"Overshot. Restart Dial Instructions.":"hold"===this.phase?"Stop, Set Position Reached.":this.direction<0?"↶ Anti · Owner’s sequence":"↷ Clock · Owner’s sequence":"open"===this.phase?"Door open. Congratulations!":""
}say(t,i){const s=++this.token;this.waiting=!0,this.spokenAt=this.now,this.after=i,this.announce(t,{kind:"command",interrupt:!0,onDone:()=>{if(this.running&&s===this.token){
this.waiting=!1;const t=this.after;this.after=null,t?.()}}})}start(t,i){this.stop(),this.pack.reset(),this.pack.alignmentTolerance=7.2+1e-7,this.practiceFailed=!1,
this.securedSettings=new Map,this.rotation=0,this.stage=0,this.now=i,this.lastMove=i,this.paused=!1,this.running=!0,this.begin()}begin(){if(this.phase="turn",this.slow=!1,
this.fine=!1,this.reachedStop=!1,this.resetReversal(this.now),this.legPeak=this.pack.dial*this.direction,this.stage===this.plan.stops.length)return this.target=this.rotation+36,
void this.say("Let’s retract the bolt. Go clock.");const t=this.plan.stops[this.stage];this.target=t.target,
this.say(`Go ${this.direction<0?"anti":"clock"}. Stop at ${t.number} on the ${["","first","second","third","fourth","fifth"][t.appearance]} appearance.`)}move(t,i,s){
const e=t-this.rotation;if(this.rotation=t,this.now=s,Math.abs(e)>1e-7&&(this.lastMove=s),this.running&&!this.practiceFailed){const i=t*this.direction
;i<this.legPeak-10.8&&this.failPractice("The dial reversed before the next instructed move."),this.legPeak=Math.max(this.legPeak,i)}if(this.pack.turnTo(t,{
allowBolt:()=>!this.practiceFailed&&void 0===this.lostPracticeSetting()}),!this.checkPracticeSettings()||!this.running||"restart"===this.phase)return t
;if(this.stage===this.plan.stops.length)return this.pack.open&&"hold"!==this.phase&&(this.phase="hold",this.say("Stop.")),t;const h=(this.target-t)*this.direction
;return h<-7.2-1e-7?this.failPractice("The dial passed the accepted stop."):h<=.5||this.reachedStop&&h<=10.8&&this.pack.gateAligned(this.pack.wheels.length-this.plan.stops[this.stage].wheel)?(this.reachedStop=!0,
"hold"!==this.phase&&(this.phase="hold",this.say("Stop, Set Position Reached"))):"hold"===this.phase?(this.phase="turn",
this.say(`Go ${this.direction<0?"anti":"clock"}, slowly.`)):!this.fine&&h<=36?(this.fine=!0,this.slow=!0,
this.say(`Single clicks. Stop at ${this.plan.stops[this.stage].number}. Use fine control for the fraction.`)):!this.slow&&h<=108?(this.slow=!0,
this.say(`Go ${this.direction<0?"anti":"clock"}, slow.`)):e*this.direction<-7.2&&s>(this.regripUntil??0)&&s-(this.correction??-1/0)>6e3&&(this.correction=s,
this.say(`Other way. Go ${this.direction<0?"anti":"clock"}.`)),t}lostPracticeSetting(){
for(const[t,i]of this.securedSettings??[])if(!this.pack.gateAligned(t)||Math.abs(this.pack.wheels[t]-i)>this.pack.alignmentTolerance)return t}checkPracticeSettings(){
if(this.practiceFailed)return!1;const t=this.lostPracticeSetting()
;return void 0===t||(this.failPractice(`Wheel ${this.pack.wheels.length-t}'s previously set gate moved out of its accepted position.`),!1)}failPractice(t){
this.practiceFailed||(this.practiceFailed=!0,
this.phase="restart",this.say(`${t} This opening practice is unsuccessful. Press Reset dial to start the complete instructions again. Reverse only when the next instruction calls for it.`))
}tick(t){if(this.now=t,this.checkPracticeSettings()&&this.running&&!this.paused){if(this.waiting&&t-this.spokenAt>15e3){this.token++,this.waiting=!1;const t=this.after
;this.after=null,t?.()}if(!(this.waiting||"hold"!==this.phase||t-this.lastMove<500))if(this.stage===this.plan.stops.length)this.pack.open&&(this.phase="open",this.running=!1,
this.token++,this.announce("Door open. The Dial Instructions worked.",{kind:"open",interrupt:!0
}));else if((this.target-this.rotation)*this.direction<=(this.reachedStop?10.8:.5)&&(this.target-this.rotation)*this.direction>=-7.2-1e-7){const t=this.plan.stops[this.stage]
;this.securedSettings.set(this.pack.wheels.length-t.wheel,this.pack.wheels[this.pack.wheels.length-t.wheel]),this.stage++,this.begin()}}}resetReversal(t){this.regripUntil=t+300}
pause(){this.paused=!0}resume(t){this.paused=!1,this.now=t,this.lastMove=t}stop(){this.running=!1,this.token++,this.waiting=!1,this.after=null,this.pack.rest()}}
