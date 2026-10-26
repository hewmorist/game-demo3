const e=["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],t=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"],i=Array.from({
length:100},(i,n)=>n<20?e[n]:t[Math.floor(n/10)]+(n%10?"-"+e[n%10].toLowerCase():""));export const dialNumber=e=>(Math.round(-e/3.6)%100+100)%100
;export const dialNumberName=e=>i[dialNumber(e)];export class DialAnnouncer{constructor(e){this.speak=e,this.reset()}reset(e=0){this.previous=-e/3.6,this.lastSpoken=-1/0,
this.blockedUntil=-1/0}reserveGuidance(e){this.blockedUntil=e+2200}move(e,t,n=10,{silent:r=!1,excludeNumber:o}={}){const s=-e/3.6,l=this.previous;if(this.previous=s,r)return;let h
;const u=1e-7;if(s>l){if(h=Math.floor((s+u)/n)*n,h<=l+u)return}else{if(!(s<l))return;if(h=Math.ceil((s-u)/n)*n,h>=l-u)return}
if(t<this.blockedUntil||t-this.lastSpoken<(1===n?350:850))return;const a=(h%100+100)%100;a!==o&&!1!==this.speak(i[a])&&(this.lastSpoken=t)}}
