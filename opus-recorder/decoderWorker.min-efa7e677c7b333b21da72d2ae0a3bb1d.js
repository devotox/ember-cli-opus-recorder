if("undefined"==typeof FastBoot){var Module=void 0!==Module?Module:{}
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.DecoderWorker=t():e.DecoderWorker=t()}("undefined"!=typeof self?self:this,(function(){return function(e){var t={}
function r(n){if(t[n])return t[n].exports
var o=t[n]={i:n,l:!1,exports:{}}
return e[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e
if(4&t&&"object"==typeof e&&e&&e.__esModule)return e
var n=Object.create(null)
if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)r.d(n,o,function(t){return e[t]}.bind(null,o))
return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e}
return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";(function(t){var r,n,o=new Promise((function(e){n=e}))
t.onmessage=function(e){o.then((function(){switch(e.data.command){case"decode":r&&r.decode(e.data.pages)
break
case"done":r&&(r.sendLastBuffer(),t.close())
break
case"init":r=new u(e.data,Module)}}))}
var u=function(e,t){if(!t)throw new Error("Module with exports required to initialize a decoder instance")
this.mainReady=o,this.config=Object.assign({bufferLength:4096,decoderSampleRate:48e3,outputBufferSampleRate:48e3,resampleQuality:3},e),this._opus_decoder_create=t._opus_decoder_create,this._opus_decoder_destroy=t._opus_decoder_destroy,this._speex_resampler_process_interleaved_float=t._speex_resampler_process_interleaved_float,this._speex_resampler_init=t._speex_resampler_init,this._speex_resampler_destroy=t._speex_resampler_destroy,this._opus_decode_float=t._opus_decode_float,this._free=t._free,this._malloc=t._malloc,this.HEAPU8=t.HEAPU8,this.HEAP32=t.HEAP32,this.HEAPF32=t.HEAPF32,this.outputBuffers=[]}
u.prototype.decode=function(e){var t=new DataView(e.buffer)
this.getPageBoundaries(t).map((function(r){var n=t.getUint8(r+5,!0),o=t.getUint32(r+18,!0)
if(2&n&&(this.numberOfChannels=t.getUint8(r+37,!0),this.init()),o>1){for(var u=t.getUint8(r+26,!0),i=r+27+u,a=0;a<u;a++){var s=t.getUint8(r+27+a,!0)
if(this.decoderBuffer.set(e.subarray(i,i+=s),this.decoderBufferIndex),this.decoderBufferIndex+=s,s<255){var l=this._opus_decode_float(this.decoder,this.decoderBufferPointer,this.decoderBufferIndex,this.decoderOutputPointer,this.decoderOutputMaxLength,0),d=Math.ceil(l*this.config.outputBufferSampleRate/this.config.decoderSampleRate)
this.HEAP32[this.decoderOutputLengthPointer>>2]=l,this.HEAP32[this.resampleOutputLengthPointer>>2]=d,this._speex_resampler_process_interleaved_float(this.resampler,this.decoderOutputPointer,this.decoderOutputLengthPointer,this.resampleOutputBufferPointer,this.resampleOutputLengthPointer),this.sendToOutputBuffers(this.HEAPF32.subarray(this.resampleOutputBufferPointer>>2,(this.resampleOutputBufferPointer>>2)+d*this.numberOfChannels)),this.decoderBufferIndex=0}}4&n&&this.sendLastBuffer()}}),this)},u.prototype.getPageBoundaries=function(e){for(var t=[],r=0;r<e.byteLength-32;r++)1399285583==e.getUint32(r,!0)&&t.push(r)
return t},u.prototype.init=function(){this.resetOutputBuffers(),this.initCodec(),this.initResampler()},u.prototype.initCodec=function(){this.decoder&&(this._opus_decoder_destroy(this.decoder),this._free(this.decoderBufferPointer),this._free(this.decoderOutputLengthPointer),this._free(this.decoderOutputPointer))
var e=this._malloc(4)
this.decoder=this._opus_decoder_create(this.config.decoderSampleRate,this.numberOfChannels,e),this._free(e),this.decoderBufferMaxLength=4e3,this.decoderBufferPointer=this._malloc(this.decoderBufferMaxLength),this.decoderBuffer=this.HEAPU8.subarray(this.decoderBufferPointer,this.decoderBufferPointer+this.decoderBufferMaxLength),this.decoderBufferIndex=0,this.decoderOutputLengthPointer=this._malloc(4),this.decoderOutputMaxLength=this.config.decoderSampleRate*this.numberOfChannels*120/1e3,this.decoderOutputPointer=this._malloc(4*this.decoderOutputMaxLength)},u.prototype.initResampler=function(){this.resampler&&(this._speex_resampler_destroy(this.resampler),this._free(this.resampleOutputLengthPointer),this._free(this.resampleOutputBufferPointer))
var e=this._malloc(4)
this.resampler=this._speex_resampler_init(this.numberOfChannels,this.config.decoderSampleRate,this.config.outputBufferSampleRate,this.config.resampleQuality,e),this._free(e),this.resampleOutputLengthPointer=this._malloc(4),this.resampleOutputMaxLength=Math.ceil(this.decoderOutputMaxLength*this.config.outputBufferSampleRate/this.config.decoderSampleRate),this.resampleOutputBufferPointer=this._malloc(4*this.resampleOutputMaxLength)},u.prototype.resetOutputBuffers=function(){this.outputBuffers=[],this.outputBufferArrayBuffers=[],this.outputBufferIndex=0
for(var e=0;e<this.numberOfChannels;e++)this.outputBuffers.push(new Float32Array(this.config.bufferLength)),this.outputBufferArrayBuffers.push(this.outputBuffers[e].buffer)},u.prototype.sendLastBuffer=function(){this.sendToOutputBuffers(new Float32Array((this.config.bufferLength-this.outputBufferIndex)*this.numberOfChannels)),t.postMessage(null)},u.prototype.sendToOutputBuffers=function(e){for(var r=0,n=e.length/this.numberOfChannels;r<n;){var o=Math.min(n-r,this.config.bufferLength-this.outputBufferIndex)
if(1===this.numberOfChannels)this.outputBuffers[0].set(e.subarray(r,r+o),this.outputBufferIndex)
else for(var u=0;u<o;u++)this.outputBuffers.forEach((function(t,n){t[this.outputBufferIndex+u]=e[(r+u)*this.numberOfChannels+n]}),this)
r+=o,this.outputBufferIndex+=o,this.outputBufferIndex==this.config.bufferLength&&(t.postMessage(this.outputBuffers,this.outputBufferArrayBuffers),this.resetOutputBuffers())}},Module||(Module={}),Module.mainReady=o,Module.OggOpusDecoder=u,Module.onRuntimeInitialized=n,e.exports=Module}).call(this,r(1))},function(e,t){var r
r=function(){return this}()
try{r=r||new Function("return this")()}catch(e){"object"==typeof window&&(r=window)}e.exports=r}])}))
var key,moduleOverrides={}
for(key in Module)Module.hasOwnProperty(key)&&(moduleOverrides[key]=Module[key])
Module.arguments=[],Module.thisProgram="./this.program",Module.quit=function(e,t){throw t},Module.preRun=[],Module.postRun=[]
var ENVIRONMENT_IS_WEB=!1,ENVIRONMENT_IS_WORKER=!1,ENVIRONMENT_IS_NODE=!1,ENVIRONMENT_IS_SHELL=!1
ENVIRONMENT_IS_WEB="object"==typeof window,ENVIRONMENT_IS_WORKER="function"==typeof importScripts,ENVIRONMENT_IS_NODE="object"==typeof process&&"function"==typeof require&&!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER,ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER
var nodeFS,nodePath,scriptDirectory=""
function locateFile(e){return Module.locateFile?Module.locateFile(e,scriptDirectory):scriptDirectory+e}if(ENVIRONMENT_IS_NODE)scriptDirectory=__dirname+"/",Module.read=function(e,t){var r
return nodeFS||(nodeFS=require("fs")),nodePath||(nodePath=require("path")),e=nodePath.normalize(e),r=nodeFS.readFileSync(e),t?r:r.toString()},Module.readBinary=function(e){var t=Module.read(e,!0)
return t.buffer||(t=new Uint8Array(t)),assert(t.buffer),t},process.argv.length>1&&(Module.thisProgram=process.argv[1].replace(/\\/g,"/")),Module.arguments=process.argv.slice(2),"undefined"!=typeof module&&(module.exports=Module),process.on("uncaughtException",(function(e){if(!(e instanceof ExitStatus))throw e})),process.on("unhandledRejection",abort),Module.quit=function(e){process.exit(e)},Module.inspect=function(){return"[Emscripten Module object]"}
else ENVIRONMENT_IS_SHELL?("undefined"!=typeof read&&(Module.read=function(e){return read(e)}),Module.readBinary=function(e){var t
return"function"==typeof readbuffer?new Uint8Array(readbuffer(e)):(assert("object"==typeof(t=read(e,"binary"))),t)},"undefined"!=typeof scriptArgs?Module.arguments=scriptArgs:"undefined"!=typeof arguments&&(Module.arguments=arguments),"function"==typeof quit&&(Module.quit=function(e){quit(e)})):(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)&&(ENVIRONMENT_IS_WORKER?scriptDirectory=self.location.href:document.currentScript&&(scriptDirectory=document.currentScript.src),scriptDirectory=0!==scriptDirectory.indexOf("blob:")?scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1):"",Module.read=function(e){var t=new XMLHttpRequest
return t.open("GET",e,!1),t.send(null),t.responseText},ENVIRONMENT_IS_WORKER&&(Module.readBinary=function(e){var t=new XMLHttpRequest
return t.open("GET",e,!1),t.responseType="arraybuffer",t.send(null),new Uint8Array(t.response)}),Module.readAsync=function(e,t,r){var n=new XMLHttpRequest
n.open("GET",e,!0),n.responseType="arraybuffer",n.onload=function(){200==n.status||0==n.status&&n.response?t(n.response):r()},n.onerror=r,n.send(null)},Module.setWindowTitle=function(e){document.title=e})
var out=Module.print||("undefined"!=typeof console?console.log.bind(console):"undefined"!=typeof print?print:null),err=Module.printErr||("undefined"!=typeof printErr?printErr:"undefined"!=typeof console&&console.warn.bind(console)||out)
for(key in moduleOverrides)moduleOverrides.hasOwnProperty(key)&&(Module[key]=moduleOverrides[key])
moduleOverrides=void 0
var STACK_ALIGN=16
function staticAlloc(e){var t=STATICTOP
return STATICTOP=STATICTOP+e+15&-16,t}function alignMemory(e,t){return t||(t=STACK_ALIGN),e=Math.ceil(e/t)*t}var asm2wasmImports={"f64-rem":function(e,t){return e%t},debugger:function(){}},functionPointers=new Array(0),GLOBAL_BASE=1024,ABORT=!1,EXITSTATUS=0
function assert(e,t){e||abort("Assertion failed: "+t)}function Pointer_stringify(e,t){if(0===t||!e)return""
for(var r,n=0,o=0;n|=r=HEAPU8[e+o>>0],(0!=r||t)&&(o++,!t||o!=t););t||(t=o)
var u=""
if(n<128){for(var i;t>0;)i=String.fromCharCode.apply(String,HEAPU8.subarray(e,e+Math.min(t,1024))),u=u?u+i:i,e+=1024,t-=1024
return u}return UTF8ToString(e)}var UTF8Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0
function UTF8ArrayToString(e,t){for(var r=t;e[r];)++r
if(r-t>16&&e.subarray&&UTF8Decoder)return UTF8Decoder.decode(e.subarray(t,r))
for(var n,o,u,i,a,s="";;){if(!(n=e[t++]))return s
if(128&n)if(o=63&e[t++],192!=(224&n))if(u=63&e[t++],224==(240&n)?n=(15&n)<<12|o<<6|u:(i=63&e[t++],240==(248&n)?n=(7&n)<<18|o<<12|u<<6|i:(a=63&e[t++],n=248==(252&n)?(3&n)<<24|o<<18|u<<12|i<<6|a:(1&n)<<30|o<<24|u<<18|i<<12|a<<6|63&e[t++])),n<65536)s+=String.fromCharCode(n)
else{var l=n-65536
s+=String.fromCharCode(55296|l>>10,56320|1023&l)}else s+=String.fromCharCode((31&n)<<6|o)
else s+=String.fromCharCode(n)}}function UTF8ToString(e){return UTF8ArrayToString(HEAPU8,e)}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64,STATIC_BASE,STATICTOP,staticSealed,STACK_BASE,STACKTOP,STACK_MAX,DYNAMIC_BASE,DYNAMICTOP_PTR,UTF16Decoder="undefined"!=typeof TextDecoder?new TextDecoder("utf-16le"):void 0,WASM_PAGE_SIZE=65536,ASMJS_PAGE_SIZE=16777216
function alignUp(e,t){return e%t>0&&(e+=t-e%t),e}function updateGlobalBuffer(e){Module.buffer=buffer=e}function updateGlobalBufferViews(){Module.HEAP8=HEAP8=new Int8Array(buffer),Module.HEAP16=HEAP16=new Int16Array(buffer),Module.HEAP32=HEAP32=new Int32Array(buffer),Module.HEAPU8=HEAPU8=new Uint8Array(buffer),Module.HEAPU16=HEAPU16=new Uint16Array(buffer),Module.HEAPU32=HEAPU32=new Uint32Array(buffer),Module.HEAPF32=HEAPF32=new Float32Array(buffer),Module.HEAPF64=HEAPF64=new Float64Array(buffer)}function abortOnCannotGrowMemory(){abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value "+TOTAL_MEMORY+", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")}function enlargeMemory(){abortOnCannotGrowMemory()}STATIC_BASE=STATICTOP=STACK_BASE=STACKTOP=STACK_MAX=DYNAMIC_BASE=DYNAMICTOP_PTR=0,staticSealed=!1
var TOTAL_STACK=Module.TOTAL_STACK||5242880,TOTAL_MEMORY=Module.TOTAL_MEMORY||16777216
function getTotalMemory(){return TOTAL_MEMORY}function callRuntimeCallbacks(e){for(;e.length>0;){var t=e.shift()
if("function"!=typeof t){var r=t.func
"number"==typeof r?void 0===t.arg?Module.dynCall_v(r):Module.dynCall_vi(r,t.arg):r(void 0===t.arg?null:t.arg)}else t()}}TOTAL_MEMORY<TOTAL_STACK&&err("TOTAL_MEMORY should be larger than TOTAL_STACK, was "+TOTAL_MEMORY+"! (TOTAL_STACK="+TOTAL_STACK+")"),Module.buffer?buffer=Module.buffer:("object"==typeof WebAssembly&&"function"==typeof WebAssembly.Memory?(Module.wasmMemory=new WebAssembly.Memory({initial:TOTAL_MEMORY/WASM_PAGE_SIZE,maximum:TOTAL_MEMORY/WASM_PAGE_SIZE}),buffer=Module.wasmMemory.buffer):buffer=new ArrayBuffer(TOTAL_MEMORY),Module.buffer=buffer),updateGlobalBufferViews()
var __ATPRERUN__=[],__ATINIT__=[],__ATMAIN__=[],__ATPOSTRUN__=[],runtimeInitialized=!1
function preRun(){if(Module.preRun)for("function"==typeof Module.preRun&&(Module.preRun=[Module.preRun]);Module.preRun.length;)addOnPreRun(Module.preRun.shift())
callRuntimeCallbacks(__ATPRERUN__)}function ensureInitRuntime(){runtimeInitialized||(runtimeInitialized=!0,callRuntimeCallbacks(__ATINIT__))}function preMain(){callRuntimeCallbacks(__ATMAIN__)}function postRun(){if(Module.postRun)for("function"==typeof Module.postRun&&(Module.postRun=[Module.postRun]);Module.postRun.length;)addOnPostRun(Module.postRun.shift())
callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(e){__ATPRERUN__.unshift(e)}function addOnPostRun(e){__ATPOSTRUN__.unshift(e)}var Math_cos=Math.cos,Math_sin=Math.sin,runDependencies=0,runDependencyWatcher=null,dependenciesFulfilled=null
function addRunDependency(e){runDependencies++,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies)}function removeRunDependency(e){if(runDependencies--,Module.monitorRunDependencies&&Module.monitorRunDependencies(runDependencies),0==runDependencies&&(null!==runDependencyWatcher&&(clearInterval(runDependencyWatcher),runDependencyWatcher=null),dependenciesFulfilled)){var t=dependenciesFulfilled
dependenciesFulfilled=null,t()}}Module.preloadedImages={},Module.preloadedAudios={}
var dataURIPrefix="data:application/octet-stream;base64,"
function isDataURI(e){return String.prototype.startsWith?e.startsWith(dataURIPrefix):0===e.indexOf(dataURIPrefix)}function integrateWasmJS(){var e="decoderWorker.min.wast",t="decoderWorker.min.wasm",r="decoderWorker.min.temp.asm.js"
isDataURI(e)||(e=locateFile(e)),isDataURI(t)||(t=locateFile(t)),isDataURI(r)||(r=locateFile(r))
var n={global:null,env:null,asm2wasm:asm2wasmImports,parent:Module},o=null
function u(){try{if(Module.wasmBinary)return new Uint8Array(Module.wasmBinary)
if(Module.readBinary)return Module.readBinary(t)
throw"both async and sync fetching of the wasm failed"}catch(err){abort(err)}}function i(e,r,i){if("object"!=typeof WebAssembly)return err("no native wasm support detected"),!1
if(!(Module.wasmMemory instanceof WebAssembly.Memory))return err("no native wasm Memory in use"),!1
function a(e,t){(o=e.exports).memory&&function(e){var t=Module.buffer
e.byteLength<t.byteLength&&err("the new buffer in mergeMemory is smaller than the previous one. in native wasm, we should grow memory here")
var r=new Int8Array(t)
new Int8Array(e).set(r),updateGlobalBuffer(e),updateGlobalBufferViews()}(o.memory),Module.asm=o,Module.usingWasm=!0,removeRunDependency("wasm-instantiate")}if(r.memory=Module.wasmMemory,n.global={NaN:NaN,Infinity:1/0},n["global.Math"]=Math,n.env=r,addRunDependency("wasm-instantiate"),Module.instantiateWasm)try{return Module.instantiateWasm(n,a)}catch(d){return err("Module.instantiateWasm callback failed with error: "+d),!1}function s(e){a(e.instance,e.module)}function l(e){(Module.wasmBinary||!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_WORKER||"function"!=typeof fetch?new Promise((function(e,t){e(u())})):fetch(t,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw"failed to load wasm binary file at '"+t+"'"
return e.arrayBuffer()})).catch((function(){return u()}))).then((function(e){return WebAssembly.instantiate(e,n)})).then(e,(function(e){err("failed to asynchronously prepare wasm: "+e),abort(e)}))}return Module.wasmBinary||"function"!=typeof WebAssembly.instantiateStreaming||isDataURI(t)||"function"!=typeof fetch?l(s):WebAssembly.instantiateStreaming(fetch(t,{credentials:"same-origin"}),n).then(s,(function(e){err("wasm streaming compile failed: "+e),err("falling back to ArrayBuffer instantiation"),l(s)})),{}}Module.asmPreload=Module.asm
var a=Module.reallocBuffer
Module.reallocBuffer=function(e){return"asmjs"===s?a(e):function(e){e=alignUp(e,Module.usingWasm?WASM_PAGE_SIZE:ASMJS_PAGE_SIZE)
var t=Module.buffer.byteLength
if(Module.usingWasm)try{return-1!==Module.wasmMemory.grow((e-t)/65536)?Module.buffer=Module.wasmMemory.buffer:null}catch(r){return null}}(e)}
var s=""
Module.asm=function(e,t,r){if(!t.table){var n=Module.wasmTableSize
void 0===n&&(n=1024)
var o=Module.wasmMaxTableSize
"object"==typeof WebAssembly&&"function"==typeof WebAssembly.Table?t.table=void 0!==o?new WebAssembly.Table({initial:n,maximum:o,element:"anyfunc"}):new WebAssembly.Table({initial:n,element:"anyfunc"}):t.table=new Array(n),Module.wasmTable=t.table}var u
return t.__memory_base||(t.__memory_base=Module.STATIC_BASE),t.__table_base||(t.__table_base=0),assert(u=i(0,t),"no binaryen method succeeded."),u}}integrateWasmJS(),STATICTOP=(STATIC_BASE=GLOBAL_BASE)+38304,__ATINIT__.push()
var STATIC_BUMP=38304
Module.STATIC_BASE=STATIC_BASE,Module.STATIC_BUMP=STATIC_BUMP,STATICTOP+=16
var SYSCALLS={buffers:[null,[],[]],printChar:function(e,t){var r=SYSCALLS.buffers[e]
assert(r),0===t||10===t?((1===e?out:err)(UTF8ArrayToString(r,0)),r.length=0):r.push(t)},varargs:0,get:function(e){return SYSCALLS.varargs+=4,HEAP32[SYSCALLS.varargs-4>>2]},getStr:function(){return Pointer_stringify(SYSCALLS.get())},get64:function(){var e=SYSCALLS.get(),t=SYSCALLS.get()
return assert(e>=0?0===t:-1===t),e},getZero:function(){assert(0===SYSCALLS.get())}}
function ___syscall140(e,t){SYSCALLS.varargs=t
try{var r=SYSCALLS.getStreamFromFD(),n=(SYSCALLS.get(),SYSCALLS.get()),o=SYSCALLS.get(),u=SYSCALLS.get(),i=n
return FS.llseek(r,i,u),HEAP32[o>>2]=r.position,r.getdents&&0===i&&0===u&&(r.getdents=null),0}catch(a){return"undefined"!=typeof FS&&a instanceof FS.ErrnoError||abort(a),-a.errno}}function ___syscall146(e,t){SYSCALLS.varargs=t
try{for(var r=SYSCALLS.get(),n=SYSCALLS.get(),o=SYSCALLS.get(),u=0,i=0;i<o;i++){for(var a=HEAP32[n+8*i>>2],s=HEAP32[n+(8*i+4)>>2],l=0;l<s;l++)SYSCALLS.printChar(r,HEAPU8[a+l])
u+=s}return u}catch(d){return"undefined"!=typeof FS&&d instanceof FS.ErrnoError||abort(d),-d.errno}}function ___syscall6(e,t){SYSCALLS.varargs=t
try{var r=SYSCALLS.getStreamFromFD()
return FS.close(r),0}catch(n){return"undefined"!=typeof FS&&n instanceof FS.ErrnoError||abort(n),-n.errno}}function _abort(){Module.abort()}var _llvm_cos_f64=Math_cos,_llvm_sin_f64=Math_sin
function _llvm_stackrestore(e){var t=_llvm_stacksave,r=t.LLVM_SAVEDSTACKS[e]
t.LLVM_SAVEDSTACKS.splice(e,1),stackRestore(r)}function _llvm_stacksave(){var e=_llvm_stacksave
return e.LLVM_SAVEDSTACKS||(e.LLVM_SAVEDSTACKS=[]),e.LLVM_SAVEDSTACKS.push(stackSave()),e.LLVM_SAVEDSTACKS.length-1}function _emscripten_memcpy_big(e,t,r){return HEAPU8.set(HEAPU8.subarray(t,t+r),e),e}function ___setErrNo(e){return Module.___errno_location&&(HEAP32[Module.___errno_location()>>2]=e),e}DYNAMICTOP_PTR=staticAlloc(4),STACK_BASE=STACKTOP=alignMemory(STATICTOP),DYNAMIC_BASE=alignMemory(STACK_MAX=STACK_BASE+TOTAL_STACK),HEAP32[DYNAMICTOP_PTR>>2]=DYNAMIC_BASE,staticSealed=!0,Module.wasmTableSize=14,Module.wasmMaxTableSize=14,Module.asmGlobalArg={},Module.asmLibraryArg={e:abort,n:enlargeMemory,m:getTotalMemory,l:abortOnCannotGrowMemory,g:___setErrNo,k:___syscall140,f:___syscall146,j:___syscall6,i:_abort,p:_emscripten_memcpy_big,h:_llvm_cos_f64,o:_llvm_sin_f64,d:_llvm_stackrestore,c:_llvm_stacksave,a:DYNAMICTOP_PTR,b:STACKTOP}
var asm=Module.asm(Module.asmGlobalArg,Module.asmLibraryArg,buffer)
Module.asm=asm
var _free=Module._free=function(){return Module.asm.q.apply(null,arguments)},_malloc=Module._malloc=function(){return Module.asm.r.apply(null,arguments)},_opus_decode_float=Module._opus_decode_float=function(){return Module.asm.s.apply(null,arguments)},_opus_decoder_create=Module._opus_decoder_create=function(){return Module.asm.t.apply(null,arguments)},_opus_decoder_destroy=Module._opus_decoder_destroy=function(){return Module.asm.u.apply(null,arguments)},_speex_resampler_destroy=Module._speex_resampler_destroy=function(){return Module.asm.v.apply(null,arguments)},_speex_resampler_init=Module._speex_resampler_init=function(){return Module.asm.w.apply(null,arguments)},_speex_resampler_process_interleaved_float=Module._speex_resampler_process_interleaved_float=function(){return Module.asm.x.apply(null,arguments)},stackRestore=Module.stackRestore=function(){return Module.asm.y.apply(null,arguments)},stackSave=Module.stackSave=function(){return Module.asm.z.apply(null,arguments)}
function ExitStatus(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e}function run(e){function t(){Module.calledRun||(Module.calledRun=!0,ABORT||(ensureInitRuntime(),preMain(),Module.onRuntimeInitialized&&Module.onRuntimeInitialized(),postRun()))}e=e||Module.arguments,runDependencies>0||(preRun(),runDependencies>0||Module.calledRun||(Module.setStatus?(Module.setStatus("Running..."),setTimeout((function(){setTimeout((function(){Module.setStatus("")}),1),t()}),1)):t()))}function abort(e){throw Module.onAbort&&Module.onAbort(e),void 0!==e?(out(e),err(e),e=JSON.stringify(e)):e="",ABORT=!0,EXITSTATUS=1,"abort("+e+"). Build with -s ASSERTIONS=1 for more info."}if(Module.asm=asm,ExitStatus.prototype=new Error,ExitStatus.prototype.constructor=ExitStatus,dependenciesFulfilled=function e(){Module.calledRun||run(),Module.calledRun||(dependenciesFulfilled=e)},Module.run=run,Module.abort=abort,Module.preInit)for("function"==typeof Module.preInit&&(Module.preInit=[Module.preInit]);Module.preInit.length>0;)Module.preInit.pop()()
Module.noExitRuntime=!0,run()}