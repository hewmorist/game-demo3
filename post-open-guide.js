import{formatDial as t}from"./owner-guide.js";import{OPENING_TOLERANCE as e}from"./post-open.js"
;import{roundedWheelReading as s,settingReadable as i,wrap as n}from"./wheel-pack.js"
;export const overshootReminder="I'm sorry, but you went past the set position. Reset the dial and try again. Approach more slowly this time and consider using the nudge control for final positioning."
;export const saveLockReminder="You might want to save these lock details. You own the lock now and can open it efficiently by a specific direct dial sequence."
;const a=(t,e)=>Number.isFinite(t)&&Math.abs(t-e)<.007;export class PostOpenGuide{constructor(t,{pack:e,post:s,reset:i}={}){this.announce=t,this.pack=e,this.post=s,
this.resetDial=i,this.isPostOpen=!0,this.script={gateAudio:"single"},this.running=!1,this.token=0}get entry(){if(!this.running)return null;if("record-setting"===this.phase)return{
key:`setting-${this.stage}`,label:`Wheel ${4-this.stage} lock setting`,field:"post-setting-"+(4-this.stage),number:this.observed};if("record-stop"===this.phase){
const t=this.post.plan.stops[this.stage],e=this.stage+1;return{key:`stop-${this.stage}-${this.stopObservation.dial}`,
label:t.wheel?`Wheel ${t.wheel} gate position`:"Clearing gate position",field:`post-stop-${e}`,number:this.stopObservation.number,countField:`post-count-${e}`,
appearance:this.stopObservation.appearance}}return null}submitEntry(t,e,s){const i=this.entry;return i?a(t,i.number)?i.countField&&e!==i.appearance?{valid:!1,
message:"Check the appearance count for this move and try again."}:(this.post.setValue(i.field,t),i.countField&&this.post.setValue(i.countField,e),this.token++,this.waiting=!1,
this.submitting=!0,this.tick(s),this.submitting=!1,"check-settings"===this.phase&&this.post.checkSettings?(this.post.checkSettings(),this.token++,this.waiting=!1,
this.tick(s)):"check-instructions"===this.phase&&this.post.checkInstructions&&(this.post.checkInstructions(),this.token++,this.waiting=!1,this.tick(s)),{valid:!0,
message:"Correct. Continue with the next instruction."}):{valid:!1,
message:"That number does not match the observed reading. Check the value in the instruction above and try again."}:{valid:!1,
message:"Follow the current instruction before entering a reply."}}checkSettingReply(t){if(this.token++,this.waiting=!1,this.now=t,"inspect"===this.phase&&this.tick(t),
"inspect"===this.phase){
const t=this.stage,e=i(this.pack.wheels[t]+this.pack.gateOffsets[t])?"Keep the dial still for a moment so I can check the rounded wheel reading, then check again.":t>0?`Wheel ${4-t}'s setting is not readable yet. Continue anticlockwise to its gate, then enter its wheel reading.`:`Wheel ${4-t}'s gate is not close enough to the top yet. Continue anticlockwise until this wheel's label says Setting readable or Gate centred. If you passed its notch, continue to its next crossing. Keep turning even if a different wheel catches the dial. Then enter the rounded whole-number wheel reading and check again.`
;return this.say(e),{valid:!1,message:e}}if("record-setting"===this.phase){const e=this.submitEntry(this.post.value(this.entry.field),NaN,t);return e.valid||this.say(e.message),e}
return"check-settings"===this.phase?(this.post.checkSettings(),this.token++,this.waiting=!1,this.tick(t),{valid:this.post.settingsOK,
message:this.post.settingsOK?"All four lock settings are correct.":"Check all four entered settings against your observed readings."}):{valid:!0,message:this.message}}
get instruction(){return this.running?this.message:""}get readingStep(){return 10}get numberOptions(){return{silent:!0}}get catchGates(){
return this.running&&!["restart","done"].includes(this.phase)}say(t,e=!1){this.message=t;const s=++this.token;this.waiting=!0,this.spokenAt=this.now,this.announce(t,{
kind:"post-guide",duringAction:e,interrupt:!0,onDone:()=>{s===this.token&&(this.waiting=!1)}})}observeSetting(t=!1){const e=this.stage
;return!(!i(this.pack.wheels[e]+this.pack.gateOffsets[e])||Math.abs(this.pack.wheels[e]-this.pack.initial[e])<1e-6)&&(this.observed=s(this.pack.wheels[e],this.pack.initial[e]),
this.phase="record-setting",
this.say(t?`That entry matches. Wheel ${4-e} is already readable: enter ${this.observed}.`:0===e?`Wheel 4's setting is readable. Enter ${this.observed}, then tap Check and continue.`:`Wheel ${4-e}: enter ${this.observed}.`),
!0)}start(t,e){this.running=!0,this.paused=!1,this.now=e,this.task=this.post.settingsOK?"opening":"settings",this.restartTask(e)}restartTask(t){this.token++,this.waiting=!1,
this.now=t,this.lastMove=t,this.stage=0,this.resetDial(),this.pack.alignmentTolerance=e,this.targetOffset=0,"settings"===this.task?(this.phase="inspect",
this.say("The dial is reset. Go anticlockwise. Watch wheel four, nearest the drive. Stop with its gate notch near the top and its label saying Setting readable or Gate centred. Read its rounded whole-number wheel reading, not the main dial number. Enter that value in the reply box and tap Check and continue.")):this.beginStop()
}beginStop(){this.phase="turn",this.stopObservation=null,this.appearanceObservation=null,this.discoveryPhase="appearances",this.slow=!1,this.origin=this.pack.dial,
this.rotation=this.pack.dial;const t=this.post.plan.stops[this.stage]
;if(!t.wheel)return void this.say("The dial is reset. Go anticlockwise for at least one full turn, then stop at wheel four’s gate. This clearing move makes room for the opening sequence.")
;const e=t.direction<0?"anti":"clock",s=t.direction<0?"anticlockwise":"clockwise"
;this.say(1===t.wheel?`${0===this.stage?"The dial is reset. ":""}Go ${s}. Watch wheel 1, farthest from the drive. All four wheels must first be picked up. Establish the appearance count, then stop with its gate near the top. We will record the main dial number and appearance count. Enter both when asked and tap Check and continue. Keep the dial still while entering them.`:`That entry matches. Go ${e}; repeat for wheel ${t.wheel}.`)
}move(t,s,i){const n=this.pack.dial,a=Math.abs(t-n)>1e-7;if(this.now=i,a&&(this.lastMove=i),this.pack.turnTo(t,{allowBolt:!1}),this.rotation=t,!this.running)return t
;if("opening"===this.task&&["turn","record-stop"].includes(this.phase)){const s=this.post.plan.stops[this.stage],i=s.target+this.targetOffset
;!this.appearanceObservation&&(t-n)*s.direction>0&&(t-i)*s.direction>=-e&&(this.appearanceObservation={appearance:s.appearance,target:i},this.discoveryPhase="position")}
if("opening"===this.task&&["turn","record-stop"].includes(this.phase)){const s=this.post.plan.stops[this.stage],i=s.target+this.targetOffset,n=(i-t)*s.direction
;n<-e||"record-stop"===this.phase&&Math.abs(t-i)>e?(this.phase="restart",this.stopObservation=null,
this.say(overshootReminder)):"record-stop"===this.phase&&a?(this.stopObservation=null,this.phase="turn",
this.say("The dial moved. Keep it still; I will check the reading again.",!0)):"turn"===this.phase&&!this.slow&&n<=36&&(this.slow=!0,
this.say(s.wheel?`Slowly. Watch wheel ${s.wheel}’s gate.`:"Slowly. Stop at wheel four’s gate.",!0))}return t}recordStop(e){this.phase="record-stop",
this.targetOffset=360*Math.round((this.pack.dial-e.target)/360)
;const s=e.wheel?4-e.wheel:0,i=n(this.pack.wheels[s]+this.pack.gateOffsets[s]+180)-180,a=Number(t(e.target+i)),h=Number(t(this.pack.dial)),o=Math.abs(n(3.6*(h-a)+180)-180)>.025
;this.stopObservation={dial:this.pack.dial,number:a,appearance:this.appearanceObservation.appearance}
;const r=a.toFixed(2),c=this.stopObservation.appearance,p=this.pack.fenceDown?"All gates are aligned and the fence is down. ":e.wheel?`Wheel ${e.wheel} aligned. `:"Clearing move recorded. "
;this.say(`${p}${o?`The dial reads ${t(this.pack.dial)} after adjustment. For the opening instructions, enter ${r} and appearance ${c}.`:`Enter ${r} and appearance ${c}.`}`)}
tick(t){if(this.now=t,this.running&&!this.paused){if("opening"===this.task&&"turn"===this.phase&&this.appearanceObservation&&t-this.lastMove>=500){
const t=this.post.plan.stops[this.stage],e=t.wheel?4-t.wheel:0;if(this.pack.gateAligned(e))return this.token++,this.waiting=!1,void this.recordStop(t)}
if(this.waiting&&t-this.spokenAt>3e4&&(this.token++,
this.waiting=!1),!(this.waiting||t-this.lastMove<500))if("inspect"===this.phase)this.observeSetting();else if("record-setting"===this.phase){
if(!a(this.post.value("post-setting-"+(4-this.stage)),this.observed))return;this.stage++,4===this.stage?(this.phase="check-settings",
this.submitting||this.say("All four observed settings are entered. Press Check lock settings in the reply form.")):this.observeSetting(!0)||(this.phase="inspect",
this.say(`That entry matches. Continue anti; repeat for wheel ${4-this.stage}.`))}else if("check-settings"===this.phase){if(!this.post.settingsOK)return;this.task="opening",
this.phase="await-reset",
this.say("The lock settings are correct. Next, we will determine the opening sequence. Press Reset dial; we will start anticlockwise, targeting wheel one, the wheel farthest from the dial.")
}else if(["turn","recover"].includes(this.phase)){if(this.appearanceObservation){const t=this.post.plan.stops[this.stage];"turn"===this.phase?this.recover(t):this.updateRecovery(t)
}}else if("record-stop"===this.phase){this.post.plan.stops[this.stage];const t=this.stage+1
;if(!a(this.post.value(`post-stop-${t}`),this.stopObservation.number)||this.post.value(`post-count-${t}`)!==this.stopObservation.appearance)return;this.stage++,
this.stage===this.post.plan.stops.length?(this.phase="check-instructions",this.submitting||(this.post.checkInstructions?.(),
this.say("All stops recorded. Checking the complete sequence from Reset."))):this.beginStop()}else"check-instructions"===this.phase&&this.post.instructionsOK&&(this.phase="done",
this.running=!1,this.message="Both tasks completed.",this.announce("Both tasks complete. Your opening sequence is verified. "+saveLockReminder,{kind:"post-guide-complete",
interrupt:!0}))}}resetReversal(){}pause(){this.paused=!0}resume(t){this.paused=!1,this.now=t,this.lastMove=t}stop(){this.running=!1,this.token++,this.waiting=!1,this.pack.rest()}}
