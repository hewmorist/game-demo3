import{OPENING_TOLERANCE as t,openingStopState as e,openingRecoveryMessage as s}from"./post-open.js";const i=10.8,a=t+.025;export class OpeningReplay{
constructor(t,{pack:e,plan:s,assisted:i=!0,reset:a}={}){this.announce=t,this.pack=e,this.plan=structuredClone(s),this.assisted=i,this.resetDial=a,this.isReplay=!0,this.script={
gateAudio:"single"},this.running=!1,this.token=0}get stopTolerance(){return this.isOwnerPractice?7.2+.025:a}get instruction(){return this.message??""}get numberOptions(){return{
silent:!0}}get readingStep(){return 10}get catchGates(){return this.running}say(t,e=!1){this.message=t;const s=++this.token;this.waiting=!0,this.spokenAt=this.now,this.announce(t,{
kind:"replay",duringAction:e,silent:!this.assisted,interrupt:!0,onDone:()=>{this.running&&this.token===s&&(this.waiting=!1)}})}start(t,e){this.stop(),this.resetDial(),
this.pack.alignmentTolerance=this.stopTolerance,this.practiceFailed=!1,this.securedSettings=new Map,this.rotation=0,this.stage=0,this.targetOffset=0,this.now=e,this.lastMove=e,
this.paused=!1,
this.running=!0,this.assisted?this.begin():(this.phase="free",this.say(`Sequence test: start ${this.plan.stops[0].direction<0?"anticlockwise":"clockwise"} from Reset and follow your verified instructions below. I will confirm when the fence drops. Your answers are kept.`))
}begin(){this.phase="turn",this.slow=!1,this.fine=!1,this.approachPosition=void 0;const t=this.plan.stops[this.stage];this.target=t.target+this.targetOffset,
this.legPeak=this.pack.dial*t.direction,
this.say(`${0===this.stage?`The dial is reset. Start ${this.plan.stops[0].direction<0?"anticlockwise":"clockwise"}. ${this.isOwnerPractice?"Previously set gates must stay aligned throughout this opening practice. ":""}`:""}Go ${t.direction<0?"anti":"clock"}. Stop at ${t.number} on appearance ${t.appearance}${t.wheel?`, to set wheel ${t.wheel}`:", for the clearing move"}.`)
}move(t,s,a){if(Math.abs(t-this.pack.dial)>1e-7&&(this.lastMove=a),this.now=a,this.rotation=t,
this.isOwnerPractice&&"complete"===this.phase&&!this.practiceFailed&&(t<this.boltPeak-i&&this.failPractice("The dial reversed during the clockwise bolt-opening move."),
this.boltPeak=Math.max(this.boltPeak,t)),this.isOwnerPractice&&this.running&&!this.practiceFailed){const e=this.plan.stops[this.stage],s=t*e.direction
;s<this.legPeak-10.8?this.failPractice(`Wheel ${e.wheel??4}: the dial reversed ${((this.legPeak-s)/3.6).toFixed(1)} divisions before the next instructed move.`):(this.target-t)*e.direction<-this.stopTolerance&&this.failPractice("The dial passed the accepted stop."),
this.legPeak=Math.max(this.legPeak,s)}if(this.pack.turnTo(t,{allowBolt:()=>!0===this.isOwnerPractice&&!this.practiceFailed&&void 0===this.lostPracticeSetting()}),
!this.checkPracticeSettings()||!this.running||!this.assisted||"recover"===this.phase)return t;const h=this.plan.stops[this.stage],r=(this.target-t)*h.direction
;return Math.abs(r)<=this.stopTolerance&&e(this.pack,h).ready&&(this.approachPosition=t),r<-this.stopTolerance?this.recover(h):!this.fine&&r<=36?(this.fine=!0,this.slow=!0,
this.say(`Single clicks. Stop at ${h.number} on appearance ${h.appearance}.`,!0)):!this.slow&&r<=108&&(this.slow=!0,
this.say(`Go ${h.direction<0?"anti":"clock"}, slowly. Stop at ${h.number}.`,!0)),t}lostPracticeSetting(){
if(this.isOwnerPractice)for(const[t,e]of this.securedSettings??[])if(!this.pack.gateAligned(t)||Math.abs(this.pack.wheels[t]-e)>this.stopTolerance)return t}checkPracticeSettings(){
if(this.practiceFailed)return!1;const t=this.lostPracticeSetting();return void 0===t||(this.failPractice(`Wheel ${4-t}'s previously set gate moved out of its accepted position.`),
!1)}failPractice(t){this.practiceFailed||(this.practiceFailed=!0,this.phase="restart",
this.say(`${t} This opening practice is unsuccessful. Press Reset dial to try again. Reverse only after the next instruction.`))}recover(t){
this.isOwnerPractice?this.failPractice("The required wheel was not set by this move."):(this.phase="recover",this.recoveryMessage="",this.recoveryPrefix="",this.updateRecovery(t))}
updateRecovery(t){const i=e(this.pack,t).earlier;if(i>=0){const e=4-i;this.stage=this.plan.stops.findIndex(t=>t.wheel===e),t=this.plan.stops[this.stage],
this.target=t.target+this.targetOffset,
this.approachPosition=void 0,this.recoveryPrefix=`Wheel ${e}'s gate left alignment. We will correct that wheel; the earlier correct settings are kept. `}
const a=this.recoveryPrefix+s(this.pack,t);a!==this.recoveryMessage&&(this.recoveryMessage=a,this.say(a,!0))}tick(t){if(this.now=t,
!this.checkPracticeSettings()||!this.running||this.paused)return
;if(t-this.lastMove>=500&&this.pack.fenceDown&&(!this.isOwnerPractice||this.stage===this.plan.stops.length-1))return void this.complete()
;if(this.waiting&&t-this.spokenAt>15e3&&(this.token++,this.waiting=!1),this.waiting||t-this.lastMove<500)return;if(!this.assisted)return void(this.pack.fenceDown&&this.complete())
;if(!["turn","recover"].includes(this.phase))return;const s=void 0===this.approachPosition?this.stopTolerance:Math.max(this.stopTolerance,i)
;if("turn"===this.phase&&Math.abs(this.pack.dial-this.target)>s)return
;const a=this.plan.stops[this.stage],h=e(this.pack,a),r=void 0!==this.approachPosition&&(this.approachPosition-this.pack.dial)*a.direction<=10.8000001
;h.ready||r&&h.aligned&&h.earlier<0&&Math.abs(this.pack.dial-this.target)<=s?("recover"===this.phase&&(this.targetOffset=360*Math.round((this.pack.dial-a.target)/360)),
this.stage!==this.plan.stops.length-1?(this.isOwnerPractice&&a.wheel&&this.securedSettings.set(4-a.wheel,this.pack.wheels[4-a.wheel]),this.stage++,
this.begin()):this.pack.fenceDown&&this.complete()):"turn"===this.phase?this.recover(a):this.updateRecovery(a)}complete(){if(this.boltPeak=this.pack.dial,
this.isOwnerPractice)for(let t=0;t<this.pack.wheels.length;t++)this.securedSettings.set(t,this.pack.wheels[t]);this.running=!1,this.phase="complete",this.token++,this.waiting=!1,
this.message="Sequence successful. All gates are aligned and the fence is down."+(this.isOwnerPractice?" Keep the dial still. Use the Retract bolt handle on the front of the safe to open the door; do not turn the dial further.":""),
this.announce(this.message,{kind:"replay-complete",silent:!this.assisted,interrupt:!0})}resetReversal(){}pause(){this.paused=!0}resume(t){this.paused=!1,this.lastMove=t}stop(){
this.running=!1,this.token++,this.waiting=!1,this.pack.rest()}}
