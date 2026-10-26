export function angleAt(t,e,r){const i=t-(r.left+r.width/2),n=e-(r.top+r.height/2);return Math.hypot(i,n)<.12*r.width?null:180*Math.atan2(n,i)/Math.PI}
export function angularDelta(t,e){return(e-t+540)%360-180}export class DialMotion{constructor(){this.reset()}reset(){this.rotation=0,this.travel=0,this.velocity=0}move(t,e){
this.rotation+=t,this.travel+=Math.abs(t),this.velocity=t/Math.max(e,1)*1e3}stop(){this.velocity=0}get position(){return(-this.rotation/3.6%100+100)%100}}
export class GateCaptureGesture{constructor(){this.reset()}reset(){this.direction=0,this.pending=null}stop(t,e){this.direction&&!this.pending&&(this.pending={rotation:t,started:e,
forward:0,reverse:0,candidate:null})}handleCandidate(t){if(t.training||t.latched.size||t.open)return null;const e=t.nearGateCapture(this.direction)??this.pending?.candidate
;return 0!==e?.wheel||t.wheels.some((e,r)=>r>0&&!t.gateAligned(r))?null:Math.abs(e.target-t.wheels[0])<=7.2+1e-7?e:null}tryHandle(t,e){const r=this.pending
;if(!r||r.reverse>=.7199999||r.forward<.7199999||e-r.started<1e3)return 0;const i=this.handleCandidate(t);if(0!==i?.wheel)return 0;const n=t.captureNearGate(i);return this.reset(),
n}move(t,e,r){if(Math.abs(e)<1e-7)return 0;const i=Math.sign(e),n=this.pending;let a=0;if(n){
if(i!==this.direction)return n.reverse||(n.candidate=t.nearGateCapture(this.direction)),n.reverse+=Math.abs(e),
n.reverse>=.7199999&&(n.forward>=.7199999&&r-n.started>=1e3&&n.candidate&&(a=t.captureNearGate(n.candidate)),this.pending=null,this.direction=i),a;{
const t=Math.min(n.reverse,Math.abs(e));n.reverse-=t,n.reverse<1e-7&&(n.reverse=0,n.candidate=null),n.forward+=Math.abs(e)-t,n.forward>14.4+1e-7&&(this.pending=null)}}
return this.direction=i,a}}
