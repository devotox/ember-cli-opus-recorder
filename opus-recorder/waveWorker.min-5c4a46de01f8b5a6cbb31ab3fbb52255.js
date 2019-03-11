"undefined"==typeof FastBoot&&function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.WaveWorker=t():e.WaveWorker=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={}
function r(n){if(t[n])return t[n].exports
var s=t[n]={i:n,l:!1,exports:{}}
return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e
if(4&t&&"object"==typeof e&&e&&e.__esModule)return e
var n=Object.create(null)
if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s))
return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e}
return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";(function(t){var r
t.onmessage=function(e){switch(e.data.command){case"encode":r&&r.record(e.data.buffers)
break
case"done":r&&(r.requestData(),r=null)
break
case"close":t.close()
break
case"init":r=new n(e.data),t.postMessage({message:"ready"})}}
var n=function(e){if(!(e=Object.assign({wavBitDepth:16},e)).wavSampleRate)throw new Error("wavSampleRate value is required to record. NOTE: Audio is not resampled!")
if(-1===[8,16,24,32].indexOf(e.wavBitDepth))throw new Error("Only 8, 16, 24 and 32 bits per sample are supported")
this.bitDepth=e.wavBitDepth,this.sampleRate=e.wavSampleRate,this.recordedBuffers=[],this.bytesPerSample=this.bitDepth/8}
n.prototype.record=function(e){this.numberOfChannels=this.numberOfChannels||e.length
for(var t=e[0].length,r=new Uint8Array(t*this.numberOfChannels*this.bytesPerSample),n=0;n<t;n++)for(var s=0;s<this.numberOfChannels;s++){var a=(n*this.numberOfChannels+s)*this.bytesPerSample,i=Math.max(-1,Math.min(1,e[s][n]))
switch(this.bytesPerSample){case 4:i=2147483647.5*i-.5,r[a]=i,r[a+1]=i>>8,r[a+2]=i>>16,r[a+3]=i>>24
break
case 3:i=8388607.5*i-.5,r[a]=i,r[a+1]=i>>8,r[a+2]=i>>16
break
case 2:i=32767.5*i-.5,r[a]=i,r[a+1]=i>>8
break
case 1:r[a]=127.5*(i+1)
break
default:throw new Error("Only 8, 16, 24 and 32 bits per sample are supported")}}this.recordedBuffers.push(r)},n.prototype.requestData=function(){var e=this.recordedBuffers[0].length,r=this.recordedBuffers.length*e,n=new Uint8Array(44+r),s=new DataView(n.buffer)
s.setUint32(0,1380533830,!1),s.setUint32(4,36+r,!0),s.setUint32(8,1463899717,!1),s.setUint32(12,1718449184,!1),s.setUint32(16,16,!0),s.setUint16(20,1,!0),s.setUint16(22,this.numberOfChannels,!0),s.setUint32(24,this.sampleRate,!0),s.setUint32(28,this.sampleRate*this.bytesPerSample*this.numberOfChannels,!0),s.setUint16(32,this.bytesPerSample*this.numberOfChannels,!0),s.setUint16(34,this.bitDepth,!0),s.setUint32(36,1684108385,!1),s.setUint32(40,r,!0)
for(var a=0;a<this.recordedBuffers.length;a++)n.set(this.recordedBuffers[a],a*e+44)
t.postMessage({message:"page",page:n},[n.buffer]),t.postMessage({message:"done"})},e.exports=n}).call(this,r(1))},function(e,t){var r
r=function(){return this}()
try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r}])})
