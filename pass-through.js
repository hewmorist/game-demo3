import{WheelPack as t,wrap as e}from"./wheel-pack.js";import{centredDialPlan as s}from"./main-dial-guide.js";export function passThroughInstructions(t,i){const r=s(t,i);let a=0
;const o=r.stops.map(t=>{const s=t.target/3.6,i=3.6*(t.direction>0?Math.ceil(s+1e-8)+1:Math.floor(s-1e-8)-1);let r=e(i);for(;(r-a)*t.direction<=1e-7;)r+=360*t.direction
;for(;(r-a)*t.direction>360+1e-7;)r-=360*t.direction;const o={...t,gate:t.target,target:i,position:Math.round(e(-i)/3.6)%100,appearance:Math.round((i-r)*t.direction/360)+1}
;return a=t.target,o});return{method:"pass-through",from:"reset-zero",to:"fence-drop",valid:r.valid,stops:o}}export class PassThroughOpening{constructor(t,e){this.pack=t,
this.plan=e,this.reset()}reset(){this.stage=0,this.crossing=null,this.reverse=0,this.failed=!1,this.done=!1}get step(){return this.plan.stops[this.stage]}clonePack(){const e=new t
;for(const[t,s]of Object.entries(this.pack))"onEvent"!==t&&(e[t]=structuredClone(s));return e}beforeMove(t){const e=this.step;if(!e||this.done||this.failed||!t)return 0
;if(Math.sign(t)===e.direction)return this.reverse=0,0;if(this.reverse+=Math.abs(t),this.reverse<.7199999)return 0;if(this.stage===this.plan.stops.length-1)return this.failed=!0,0
;if(!this.crossing||Math.abs(this.pack.dial+e.direction*(this.reverse-Math.abs(t))-e.target)>3.6+1e-7)return this.failed=!0,0;const s=this.pack.dial;this.restore(),
this.pack.turnTo(this.pack.dial-e.direction*(this.reverse-Math.abs(t)),{allowBolt:!1});const i=this.pack.dial-s;return this.stage++,this.crossing=null,this.reverse=0,i}moveTo(t){
const e=this.step,s=this.pack.dial,i=this.clonePack(),r=this.pack.turnTo(t,{allowBolt:!1})
;return!e||this.done||this.failed||((e.gate-s)*e.direction>1e-7&&(t-e.gate)*e.direction>=-1e-7&&r.some(t=>"gatepass"===t.type&&t.wheel===this.pack.wheels.length-(e.wheel??this.pack.wheels.length)&&t.direction===e.direction&&Math.abs(t.dial-e.gate)<1e-6)&&(i.turnTo(e.gate,{
emitPickups:!1,emitGates:!1,allowBolt:!1}),this.crossing={dial:i.dial,wheels:[...i.wheels]}),(t-e.target)*e.direction>3.6+1e-7&&(this.crossing=null,this.failed=!0)),r}restore(){
this.pack.dial=this.crossing.dial,this.pack.wheels=[...this.crossing.wheels],this.pack.turnTo(this.pack.dial,{emitPickups:!1,emitGates:!1,allowBolt:!1})}tryHandle(){
const t=this.step;return!(this.failed||this.done||this.stage!==this.plan.stops.length-1||!this.crossing||Math.abs(this.pack.dial-t.target)>3.6+1e-7)&&(this.restore(),this.done=!0,
!0)}}
