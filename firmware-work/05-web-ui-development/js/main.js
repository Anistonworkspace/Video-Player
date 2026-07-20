//# sourceURL=main.js
/** A JavaScript implementation of the RSA Data Security, Inc. MD5 Message* Digest Algorithm, as defined in RFC 1321.* Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.* Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet* Distributed under the BSD License* See http://pajhome.org.uk/crypt/md5 for more info.*/var hexcase = 0;var chrsz   = 8;function hex_md5(s){ return binl2hex(core_md5(str2binl(s), s.length * chrsz));}function core_md5(x, len){/* append padding */x[len >> 5] |= 0x80 << ((len) % 32);x[(((len + 64) >>> 9) << 4) + 14] = len;var a =  1732584193;var b = -271733879;var c = -1732584194;var d =  271733878;for(var i = 0; i < x.length; i += 16){var olda = a;var oldb = b;var oldc = c;var oldd = d;a = md5_ff(a, b, c, d, x[i+ 0], 7 , -680876936);d = md5_ff(d, a, b, c, x[i+ 1], 12, -389564586);c = md5_ff(c, d, a, b, x[i+ 2], 17,  606105819);b = md5_ff(b, c, d, a, x[i+ 3], 22, -1044525330);a = md5_ff(a, b, c, d, x[i+ 4], 7 , -176418897);d = md5_ff(d, a, b, c, x[i+ 5], 12,  1200080426);c = md5_ff(c, d, a, b, x[i+ 6], 17, -1473231341);b = md5_ff(b, c, d, a, x[i+ 7], 22, -45705983);a = md5_ff(a, b, c, d, x[i+ 8], 7 ,  1770035416);d = md5_ff(d, a, b, c, x[i+ 9], 12, -1958414417);c = md5_ff(c, d, a, b, x[i+10], 17, -42063);b = md5_ff(b, c, d, a, x[i+11], 22, -1990404162);a = md5_ff(a, b, c, d, x[i+12], 7 ,  1804603682);d = md5_ff(d, a, b, c, x[i+13], 12, -40341101);c = md5_ff(c, d, a, b, x[i+14], 17, -1502002290);b = md5_ff(b, c, d, a, x[i+15], 22,  1236535329);a = md5_gg(a, b, c, d, x[i+ 1], 5 , -165796510);d = md5_gg(d, a, b, c, x[i+ 6], 9 , -1069501632);c = md5_gg(c, d, a, b, x[i+11], 14,  643717713);b = md5_gg(b, c, d, a, x[i+ 0], 20, -373897302);a = md5_gg(a, b, c, d, x[i+ 5], 5 , -701558691);d = md5_gg(d, a, b, c, x[i+10], 9 ,  38016083);c = md5_gg(c, d, a, b, x[i+15], 14, -660478335);b = md5_gg(b, c, d, a, x[i+ 4], 20, -405537848);a = md5_gg(a, b, c, d, x[i+ 9], 5 ,  568446438);d = md5_gg(d, a, b, c, x[i+14], 9 , -1019803690);c = md5_gg(c, d, a, b, x[i+ 3], 14, -187363961);b = md5_gg(b, c, d, a, x[i+ 8], 20,  1163531501);a = md5_gg(a, b, c, d, x[i+13], 5 , -1444681467);d = md5_gg(d, a, b, c, x[i+ 2], 9 , -51403784);c = md5_gg(c, d, a, b, x[i+ 7], 14,  1735328473);b = md5_gg(b, c, d, a, x[i+12], 20, -1926607734);a = md5_hh(a, b, c, d, x[i+ 5], 4 , -378558);d = md5_hh(d, a, b, c, x[i+ 8], 11, -2022574463);c = md5_hh(c, d, a, b, x[i+11], 16,  1839030562);b = md5_hh(b, c, d, a, x[i+14], 23, -35309556);a = md5_hh(a, b, c, d, x[i+ 1], 4 , -1530992060);d = md5_hh(d, a, b, c, x[i+ 4], 11,  1272893353);c = md5_hh(c, d, a, b, x[i+ 7], 16, -155497632);b = md5_hh(b, c, d, a, x[i+10], 23, -1094730640);a = md5_hh(a, b, c, d, x[i+13], 4 ,  681279174);d = md5_hh(d, a, b, c, x[i+ 0], 11, -358537222);c = md5_hh(c, d, a, b, x[i+ 3], 16, -722521979);b = md5_hh(b, c, d, a, x[i+ 6], 23,  76029189);a = md5_hh(a, b, c, d, x[i+ 9], 4 , -640364487);d = md5_hh(d, a, b, c, x[i+12], 11, -421815835);c = md5_hh(c, d, a, b, x[i+15], 16,  530742520);b = md5_hh(b, c, d, a, x[i+ 2], 23, -995338651);a = md5_ii(a, b, c, d, x[i+ 0], 6 , -198630844);d = md5_ii(d, a, b, c, x[i+ 7], 10,  1126891415);c = md5_ii(c, d, a, b, x[i+14], 15, -1416354905);b = md5_ii(b, c, d, a, x[i+ 5], 21, -57434055);a = md5_ii(a, b, c, d, x[i+12], 6 ,  1700485571);d = md5_ii(d, a, b, c, x[i+ 3], 10, -1894986606);c = md5_ii(c, d, a, b, x[i+10], 15, -1051523);b = md5_ii(b, c, d, a, x[i+ 1], 21, -2054922799);a = md5_ii(a, b, c, d, x[i+ 8], 6 ,  1873313359);d = md5_ii(d, a, b, c, x[i+15], 10, -30611744);c = md5_ii(c, d, a, b, x[i+ 6], 15, -1560198380);b = md5_ii(b, c, d, a, x[i+13], 21,  1309151649);a = md5_ii(a, b, c, d, x[i+ 4], 6 , -145523070);d = md5_ii(d, a, b, c, x[i+11], 10, -1120210379);c = md5_ii(c, d, a, b, x[i+ 2], 15,  718787259);b = md5_ii(b, c, d, a, x[i+ 9], 21, -343485551);a = safe_add(a, olda);b = safe_add(b, oldb);c = safe_add(c, oldc);d = safe_add(d, oldd);}return Array(a, b, c, d);}function md5_cmn(q, a, b, x, s, t){return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s),b);}function md5_ff(a, b, c, d, x, s, t){return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);}function md5_gg(a, b, c, d, x, s, t){return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);}function md5_hh(a, b, c, d, x, s, t){return md5_cmn(b ^ c ^ d, a, b, x, s, t);}function md5_ii(a, b, c, d, x, s, t){return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);}function safe_add(x, y){var lsw = (x & 0xFFFF) + (y & 0xFFFF);var msw = (x >> 16) + (y >> 16) + (lsw >> 16);return (msw << 16) | (lsw & 0xFFFF);}function bit_rol(num, cnt){return (num << cnt) | (num >>> (32 - cnt));}function str2binl(str){var bin = Array();var mask = (1 << chrsz) - 1;for(var i = 0; i < str.length * chrsz; i += chrsz)bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (i%32);return bin;}function binl2hex(binarray){var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";var str = "";for(var i = 0; i < binarray.length * 4; i++){str += hex_tab.charAt((binarray[i>>2] >> ((i%4)*8+4)) & 0xF) +hex_tab.charAt((binarray[i>>2] >> ((i%4)*8  )) & 0xF);}return str;}function ToNum(x) {var temp = Number(x);if (!isNaN(temp)){return x -'0';}else{return parseInt(x, 16);}}function MD5_8(strInput){var outputtemp = Array(16);var arrOut = Array(8);strInput = hex_md5(strInput);for(i=0, j=0; j<16;i +=2, j++){var tmp = i+1;outputtemp[j] = ToNum(strInput[i]) * 16 + ToNum(strInput[tmp]);}for (var i = 0; i <= 7; i++){arrOut[i] = ( (outputtemp[2 * i] + outputtemp[2 * i + 1]) % 62 );if ((arrOut[i] >= 0) && (arrOut[i] <= 9)){arrOut[i] = String.fromCharCode(arrOut[i] + 48);}else{if ((arrOut[i] >= 10) && (arrOut[i] <= 35)){arrOut[i] = String.fromCharCode(arrOut[i] + 55);}else{arrOut[i] = String.fromCharCode(arrOut[i] + 61);}}}return arrOut.join("");}

// Copyright (c) 2005  Tom Wu
// All Rights Reserved.
// See "LICENSE" for details.
// Basic JavaScript BN library - subset useful for RSA encryption.
// Bits per digit
// jsbn.js
var dbits,canary=0xdeadbeefcafe,j_lm=15715070==(16777215&canary);function BigInteger(t,i,r){null!=t&&("number"==typeof t?this.fromNumber(t,i,r):null==i&&"string"!=typeof t?this.fromString(t,256):this.fromString(t,i))}function nbi(){return new BigInteger(null)}function am1(t,i,r,o,n,e){for(;--e>=0;){var s=i*this[t++]+r[o]+n;n=Math.floor(s/67108864),r[o++]=67108863&s}return n}function am2(t,i,r,o,n,e){for(var s=32767&i,h=i>>15;--e>=0;){var p=32767&this[t],a=this[t++]>>15,f=h*p+a*s;n=((p=s*p+((32767&f)<<15)+r[o]+(1073741823&n))>>>30)+(f>>>15)+h*a+(n>>>30),r[o++]=1073741823&p}return n}function am3(t,i,r,o,n,e){for(var s=16383&i,h=i>>14;--e>=0;){var p=16383&this[t],a=this[t++]>>14,f=h*p+a*s;n=((p=s*p+((16383&f)<<14)+r[o]+n)>>28)+(f>>14)+h*a,r[o++]=268435455&p}return n}j_lm&&"Microsoft Internet Explorer"==navigator.appName?(BigInteger.prototype.am=am2,dbits=30):j_lm&&"Netscape"!=navigator.appName?(BigInteger.prototype.am=am1,dbits=26):(BigInteger.prototype.am=am3,dbits=28),BigInteger.prototype.DB=dbits,BigInteger.prototype.DM=(1<<dbits)-1,BigInteger.prototype.DV=1<<dbits;var BI_FP=52;BigInteger.prototype.FV=Math.pow(2,BI_FP),BigInteger.prototype.F1=BI_FP-dbits,BigInteger.prototype.F2=2*dbits-BI_FP;var rr,vv,BI_RM="0123456789abcdefghijklmnopqrstuvwxyz",BI_RC=new Array;for(rr="0".charCodeAt(0),vv=0;vv<=9;++vv)BI_RC[rr++]=vv;for(rr="a".charCodeAt(0),vv=10;vv<36;++vv)BI_RC[rr++]=vv;for(rr="A".charCodeAt(0),vv=10;vv<36;++vv)BI_RC[rr++]=vv;function int2char(t){return BI_RM.charAt(t)}function intAt(t,i){var r=BI_RC[t.charCodeAt(i)];return null==r?-1:r}function bnpCopyTo(t){for(var i=this.t-1;i>=0;--i)t[i]=this[i];t.t=this.t,t.s=this.s}function bnpFromInt(t){this.t=1,this.s=t<0?-1:0,t>0?this[0]=t:t<-1?this[0]=t+this.DV:this.t=0}function nbv(t){var i=nbi();return i.fromInt(t),i}function bnpFromString(t,i){var r;if(16==i)r=4;else if(8==i)r=3;else if(256==i)r=8;else if(2==i)r=1;else if(32==i)r=5;else{if(4!=i)return void this.fromRadix(t,i);r=2}this.t=0,this.s=0;for(var o=t.length,n=!1,e=0;--o>=0;){var s=8==r?255&t[o]:intAt(t,o);s<0?"-"==t.charAt(o)&&(n=!0):(n=!1,0==e?this[this.t++]=s:e+r>this.DB?(this[this.t-1]|=(s&(1<<this.DB-e)-1)<<e,this[this.t++]=s>>this.DB-e):this[this.t-1]|=s<<e,(e+=r)>=this.DB&&(e-=this.DB))}8==r&&0!=(128&t[0])&&(this.s=-1,e>0&&(this[this.t-1]|=(1<<this.DB-e)-1<<e)),this.clamp(),n&&BigInteger.ZERO.subTo(this,this)}function bnpClamp(){for(var t=this.s&this.DM;this.t>0&&this[this.t-1]==t;)--this.t}function bnToString(t){if(this.s<0)return"-"+this.negate().toString(t);var i;if(16==t)i=4;else if(8==t)i=3;else if(2==t)i=1;else if(32==t)i=5;else{if(4!=t)return this.toRadix(t);i=2}var r,o=(1<<i)-1,n=!1,e="",s=this.t,h=this.DB-s*this.DB%i;if(s-- >0)for(h<this.DB&&(r=this[s]>>h)>0&&(n=!0,e=int2char(r));s>=0;)h<i?(r=(this[s]&(1<<h)-1)<<i-h,r|=this[--s]>>(h+=this.DB-i)):(r=this[s]>>(h-=i)&o,h<=0&&(h+=this.DB,--s)),r>0&&(n=!0),n&&(e+=int2char(r));return n?e:"0"}function bnNegate(){var t=nbi();return BigInteger.ZERO.subTo(this,t),t}function bnAbs(){return this.s<0?this.negate():this}function bnCompareTo(t){var i=this.s-t.s;if(0!=i)return i;var r=this.t;if(0!=(i=r-t.t))return this.s<0?-i:i;for(;--r>=0;)if(0!=(i=this[r]-t[r]))return i;return 0}function nbits(t){var i,r=1;return 0!=(i=t>>>16)&&(t=i,r+=16),0!=(i=t>>8)&&(t=i,r+=8),0!=(i=t>>4)&&(t=i,r+=4),0!=(i=t>>2)&&(t=i,r+=2),0!=(i=t>>1)&&(t=i,r+=1),r}function bnBitLength(){return this.t<=0?0:this.DB*(this.t-1)+nbits(this[this.t-1]^this.s&this.DM)}function bnpDLShiftTo(t,i){var r;for(r=this.t-1;r>=0;--r)i[r+t]=this[r];for(r=t-1;r>=0;--r)i[r]=0;i.t=this.t+t,i.s=this.s}function bnpDRShiftTo(t,i){for(var r=t;r<this.t;++r)i[r-t]=this[r];i.t=Math.max(this.t-t,0),i.s=this.s}function bnpLShiftTo(t,i){var r,o=t%this.DB,n=this.DB-o,e=(1<<n)-1,s=Math.floor(t/this.DB),h=this.s<<o&this.DM;for(r=this.t-1;r>=0;--r)i[r+s+1]=this[r]>>n|h,h=(this[r]&e)<<o;for(r=s-1;r>=0;--r)i[r]=0;i[s]=h,i.t=this.t+s+1,i.s=this.s,i.clamp()}function bnpRShiftTo(t,i){i.s=this.s;var r=Math.floor(t/this.DB);if(r>=this.t)i.t=0;else{var o=t%this.DB,n=this.DB-o,e=(1<<o)-1;i[0]=this[r]>>o;for(var s=r+1;s<this.t;++s)i[s-r-1]|=(this[s]&e)<<n,i[s-r]=this[s]>>o;o>0&&(i[this.t-r-1]|=(this.s&e)<<n),i.t=this.t-r,i.clamp()}}function bnpSubTo(t,i){for(var r=0,o=0,n=Math.min(t.t,this.t);r<n;)o+=this[r]-t[r],i[r++]=o&this.DM,o>>=this.DB;if(t.t<this.t){for(o-=t.s;r<this.t;)o+=this[r],i[r++]=o&this.DM,o>>=this.DB;o+=this.s}else{for(o+=this.s;r<t.t;)o-=t[r],i[r++]=o&this.DM,o>>=this.DB;o-=t.s}i.s=o<0?-1:0,o<-1?i[r++]=this.DV+o:o>0&&(i[r++]=o),i.t=r,i.clamp()}function bnpMultiplyTo(t,i){var r=this.abs(),o=t.abs(),n=r.t;for(i.t=n+o.t;--n>=0;)i[n]=0;for(n=0;n<o.t;++n)i[n+r.t]=r.am(0,o[n],i,n,0,r.t);i.s=0,i.clamp(),this.s!=t.s&&BigInteger.ZERO.subTo(i,i)}function bnpSquareTo(t){for(var i=this.abs(),r=t.t=2*i.t;--r>=0;)t[r]=0;for(r=0;r<i.t-1;++r){var o=i.am(r,i[r],t,2*r,0,1);(t[r+i.t]+=i.am(r+1,2*i[r],t,2*r+1,o,i.t-r-1))>=i.DV&&(t[r+i.t]-=i.DV,t[r+i.t+1]=1)}t.t>0&&(t[t.t-1]+=i.am(r,i[r],t,2*r,0,1)),t.s=0,t.clamp()}function bnpDivRemTo(t,i,r){var o=t.abs();if(!(o.t<=0)){var n=this.abs();if(n.t<o.t)return null!=i&&i.fromInt(0),void(null!=r&&this.copyTo(r));null==r&&(r=nbi());var e=nbi(),s=this.s,h=t.s,p=this.DB-nbits(o[o.t-1]);p>0?(o.lShiftTo(p,e),n.lShiftTo(p,r)):(o.copyTo(e),n.copyTo(r));var a=e.t,f=e[a-1];if(0!=f){var u=f*(1<<this.F1)+(a>1?e[a-2]>>this.F2:0),g=this.FV/u,m=(1<<this.F1)/u,c=1<<this.F2,v=r.t,b=v-a,l=null==i?nbi():i;for(e.dlShiftTo(b,l),r.compareTo(l)>=0&&(r[r.t++]=1,r.subTo(l,r)),BigInteger.ONE.dlShiftTo(a,l),l.subTo(e,e);e.t<a;)e[e.t++]=0;for(;--b>=0;){var T=r[--v]==f?this.DM:Math.floor(r[v]*g+(r[v-1]+c)*m);if((r[v]+=e.am(0,T,r,b,0,a))<T)for(e.dlShiftTo(b,l),r.subTo(l,r);r[v]<--T;)r.subTo(l,r)}null!=i&&(r.drShiftTo(a,i),s!=h&&BigInteger.ZERO.subTo(i,i)),r.t=a,r.clamp(),p>0&&r.rShiftTo(p,r),s<0&&BigInteger.ZERO.subTo(r,r)}}}function bnMod(t){var i=nbi();return this.abs().divRemTo(t,null,i),this.s<0&&i.compareTo(BigInteger.ZERO)>0&&t.subTo(i,i),i}function Classic(t){this.m=t}function cConvert(t){return t.s<0||t.compareTo(this.m)>=0?t.mod(this.m):t}function cRevert(t){return t}function cReduce(t){t.divRemTo(this.m,null,t)}function cMulTo(t,i,r){t.multiplyTo(i,r),this.reduce(r)}function cSqrTo(t,i){t.squareTo(i),this.reduce(i)}function bnpInvDigit(){if(this.t<1)return 0;var t=this[0];if(0==(1&t))return 0;var i=3&t;return(i=(i=(i=(i=i*(2-(15&t)*i)&15)*(2-(255&t)*i)&255)*(2-((65535&t)*i&65535))&65535)*(2-t*i%this.DV)%this.DV)>0?this.DV-i:-i}function Montgomery(t){this.m=t,this.mp=t.invDigit(),this.mpl=32767&this.mp,this.mph=this.mp>>15,this.um=(1<<t.DB-15)-1,this.mt2=2*t.t}function montConvert(t){var i=nbi();return t.abs().dlShiftTo(this.m.t,i),i.divRemTo(this.m,null,i),t.s<0&&i.compareTo(BigInteger.ZERO)>0&&this.m.subTo(i,i),i}function montRevert(t){var i=nbi();return t.copyTo(i),this.reduce(i),i}function montReduce(t){for(;t.t<=this.mt2;)t[t.t++]=0;for(var i=0;i<this.m.t;++i){var r=32767&t[i],o=r*this.mpl+((r*this.mph+(t[i]>>15)*this.mpl&this.um)<<15)&t.DM;for(t[r=i+this.m.t]+=this.m.am(0,o,t,i,0,this.m.t);t[r]>=t.DV;)t[r]-=t.DV,t[++r]++}t.clamp(),t.drShiftTo(this.m.t,t),t.compareTo(this.m)>=0&&t.subTo(this.m,t)}function montSqrTo(t,i){t.squareTo(i),this.reduce(i)}function montMulTo(t,i,r){t.multiplyTo(i,r),this.reduce(r)}function bnpIsEven(){return 0==(this.t>0?1&this[0]:this.s)}function bnpExp(t,i){if(t>4294967295||t<1)return BigInteger.ONE;var r=nbi(),o=nbi(),n=i.convert(this),e=nbits(t)-1;for(n.copyTo(r);--e>=0;)if(i.sqrTo(r,o),(t&1<<e)>0)i.mulTo(o,n,r);else{var s=r;r=o,o=s}return i.revert(r)}function bnModPowInt(t,i){var r;return r=t<256||i.isEven()?new Classic(i):new Montgomery(i),this.exp(t,r)}Classic.prototype.convert=cConvert,Classic.prototype.revert=cRevert,Classic.prototype.reduce=cReduce,Classic.prototype.mulTo=cMulTo,Classic.prototype.sqrTo=cSqrTo,Montgomery.prototype.convert=montConvert,Montgomery.prototype.revert=montRevert,Montgomery.prototype.reduce=montReduce,Montgomery.prototype.mulTo=montMulTo,Montgomery.prototype.sqrTo=montSqrTo,BigInteger.prototype.copyTo=bnpCopyTo,BigInteger.prototype.fromInt=bnpFromInt,BigInteger.prototype.fromString=bnpFromString,BigInteger.prototype.clamp=bnpClamp,BigInteger.prototype.dlShiftTo=bnpDLShiftTo,BigInteger.prototype.drShiftTo=bnpDRShiftTo,BigInteger.prototype.lShiftTo=bnpLShiftTo,BigInteger.prototype.rShiftTo=bnpRShiftTo,BigInteger.prototype.subTo=bnpSubTo,BigInteger.prototype.multiplyTo=bnpMultiplyTo,BigInteger.prototype.squareTo=bnpSquareTo,BigInteger.prototype.divRemTo=bnpDivRemTo,BigInteger.prototype.invDigit=bnpInvDigit,BigInteger.prototype.isEven=bnpIsEven,BigInteger.prototype.exp=bnpExp,BigInteger.prototype.toString=bnToString,BigInteger.prototype.negate=bnNegate,BigInteger.prototype.abs=bnAbs,BigInteger.prototype.compareTo=bnCompareTo,BigInteger.prototype.bitLength=bnBitLength,BigInteger.prototype.mod=bnMod,BigInteger.prototype.modPowInt=bnModPowInt,BigInteger.ZERO=nbv(0),BigInteger.ONE=nbv(1);

// prng4.js - uses Arcfour as a PRNG
function Arcfour(){this.i=0,this.j=0,this.S=new Array}function ARC4init(i){var t,s,h;for(t=0;t<256;++t)this.S[t]=t;for(s=0,t=0;t<256;++t)s=s+this.S[t]+i[t%i.length]&255,h=this.S[t],this.S[t]=this.S[s],this.S[s]=h;this.i=0,this.j=0}function ARC4next(){var i;return this.i=this.i+1&255,this.j=this.j+this.S[this.i]&255,i=this.S[this.i],this.S[this.i]=this.S[this.j],this.S[this.j]=i,this.S[i+this.S[this.i]&255]}function prng_newstate(){return new Arcfour}Arcfour.prototype.init=ARC4init,Arcfour.prototype.next=ARC4next;var rng_psize=256;

//base64.js
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(r){var t,e,o,a,n,h,c="",d=0;for(r=Base64._utf8_encode(r);d<r.length;)a=(t=r.charCodeAt(d++))>>2,t=(3&t)<<4|(e=r.charCodeAt(d++))>>4,n=(15&e)<<2|(o=r.charCodeAt(d++))>>6,h=63&o,isNaN(e)?n=h=64:isNaN(o)&&(h=64),c=c+this._keyStr.charAt(a)+this._keyStr.charAt(t)+this._keyStr.charAt(n)+this._keyStr.charAt(h);return c},decode:function(r){var t,e,o,a,n,h="",c=0;for(r=r.replace(/[^A-Za-z0-9\+\/\=]/g,"");c<r.length;)t=(t=this._keyStr.indexOf(r.charAt(c++)))<<2|(e=this._keyStr.indexOf(r.charAt(c++)))>>4,e=(15&e)<<4|(a=this._keyStr.indexOf(r.charAt(c++)))>>2,o=(3&a)<<6|(n=this._keyStr.indexOf(r.charAt(c++))),h+=String.fromCharCode(t),64!=a&&(h+=String.fromCharCode(e)),64!=n&&(h+=String.fromCharCode(o));return Base64._utf8_decode(h)},_utf8_encode:function(r){for(var t="",e=0;e<r.length;e++){var o=r.charCodeAt(e);o<128?t+=String.fromCharCode(o):(o>127&&o<2048?t+=String.fromCharCode(o>>6|192):(t+=String.fromCharCode(o>>12|224),t+=String.fromCharCode(o>>6&63|128)),t+=String.fromCharCode(63&o|128))}return t},_utf8_decode:function(r){for(var t="",e=0,o=c1=c2=0;e<r.length;)(o=r.charCodeAt(e))<128?(t+=String.fromCharCode(o),e++):o>191&&o<224?(c2=r.charCodeAt(e+1),t+=String.fromCharCode((31&o)<<6|63&c2),e+=2):(c2=r.charCodeAt(e+1),c3=r.charCodeAt(e+2),t+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),e+=3);return t}};function arrayBufferToBase64(r){for(var t="",e=new Uint8Array(r),o=e.byteLength,a=0;a<o;a++)t+=String.fromCharCode(e[a]);return window.btoa(t)}function base64ToArrayBuffer(r){for(var t=window.atob(r),e=t.length,o=new Uint8Array(e),a=0;a<e;a++)o[a]=t.charCodeAt(a);return o}

// Random number generator - requires a PRNG backend, e.g. prng4.js
// For best results, put code like
// <body onClick='rng_seed_time();' onKeyPress='rng_seed_time();'>
// in your main HTML document.
//rng.js
var rng_state,rng_pool,rng_pptr;function rng_seed_int(r){rng_pool[rng_pptr++]^=255&r,rng_pool[rng_pptr++]^=r>>8&255,rng_pool[rng_pptr++]^=r>>16&255,rng_pool[rng_pptr++]^=r>>24&255,rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}if(null==rng_pool){var t;if(rng_pool=new Array,rng_pptr=0,window.crypto&&window.crypto.getRandomValues){var ua=new Uint8Array(32);for(window.crypto.getRandomValues(ua),t=0;t<32;++t)rng_pool[rng_pptr++]=ua[t]}if("Netscape"==navigator.appName&&navigator.appVersion<"5"&&window.crypto){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=255&z.charCodeAt(t)}for(;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=255&t;rng_pptr=0,rng_seed_time()}function rng_get_byte(){if(null==rng_state){for(rng_seed_time(),(rng_state=prng_newstate()).init(rng_pool),rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(r){var n;for(n=0;n<r.length;++n)r[n]=rng_get_byte()}function SecureRandom(){}SecureRandom.prototype.nextBytes=rng_get_bytes;

// Depends on jsbn.js and rng.js
// Version 1.1: support utf-8 encoding in pkcs1pad2
// convert a (hex) string to a bignum object
// rsa.js
function parseBigInt(n,t){return new BigInteger(n,t)}function linebrk(n,t){for(var e="",r=0;r+t<n.length;)e+=n.substring(r,r+t)+"\n",r+=t;return e+n.substring(r,n.length)}function byte2Hex(n){return n<16?"0"+n.toString(16):n.toString(16)}function pkcs1pad2(n,t){if(t<n.length+11)return alert("Message too long for RSA"),null;for(var e=new Array,r=n.length-1;r>=0&&t>0;){var l=n.charCodeAt(r--);l<128?e[--t]=l:l>127&&l<2048?(e[--t]=63&l|128,e[--t]=l>>6|192):(e[--t]=63&l|128,e[--t]=l>>6&63|128,e[--t]=l>>12|224)}e[--t]=0;for(var i=new SecureRandom,u=new Array;t>2;){for(u[0]=0;0==u[0];)i.nextBytes(u);e[--t]=u[0]}return e[--t]=2,e[--t]=0,new BigInteger(e)}function RSAKey(){this.n=null,this.e=0,this.d=null,this.p=null,this.q=null,this.dmp1=null,this.dmq1=null,this.coeff=null}function RSASetPublic(n,t){null!=n&&null!=t&&n.length>0&&t.length>0?(this.n=parseBigInt(n,16),this.e=parseInt(t,16)):alert("Invalid RSA public key")}function RSADoPublic(n){return n.modPowInt(this.e,this.n)}function RSAEncrypt(n){var t=pkcs1pad2(n,this.n.bitLength()+7>>3);if(null==t)return null;var e=this.doPublic(t);if(null==e)return null;var r=e.toString(16);return 0==(1&r.length)?r:"0"+r}RSAKey.prototype.doPublic=RSADoPublic,RSAKey.prototype.setPublic=RSASetPublic,RSAKey.prototype.encrypt=RSAEncrypt;

// protocolcheck.js
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).protocolCheck=e()}}(function(){return function e(n,t,o){function r(a,u){if(!t[a]){if(!n[a]){var c="function"==typeof require&&require;if(!u&&c)return c(a,!0);if(i)return i(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var d=t[a]={exports:{}};n[a][0].call(d.exports,function(e){var t=n[a][1][e];return r(t||e)},d,d.exports,e,n,t,o)}return t[a].exports}for(var i="function"==typeof require&&require,a=0;a<o.length;a++)r(o[a]);return r}({1:[function(e,n,t){function o(e,n,t){return e.addEventListener?(e.addEventListener(n,t),{remove:function(){e.removeEventListener(n,t)}}):(e.attachEvent(n,t),{remove:function(){e.detachEvent(n,t)}})}function r(e,n){var t=document.createElement("iframe");return t.src=n,t.id="hiddenIframe",t.style.display="none",e.appendChild(t),t}function i(e,n,t){var i=setTimeout(function(){n(),u.remove()},1e3),a=document.querySelector("#hiddenIframe");a||(a=r(document.body,"about:blank"));var u=o(window,"blur",function(){clearTimeout(i),u.remove(),t()});a.contentWindow.location.href=e}function a(e,n,t){10===u()?function(e,n,t){var o=setTimeout(n,1e3);window.addEventListener("blur",function(){clearTimeout(o),t()});var i=document.querySelector("#hiddenIframe");i||(i=r(document.body,"about:blank"));try{i.contentWindow.location.href=e}catch(e){n(),clearTimeout(o)}}(e,n,t):9===u()||11===u()?i(e,n,t):function(e,n,t){var o=window.open("","","width=0,height=0");o.document.write("<iframe src='"+e+"'></iframe>"),setTimeout(function(){try{o.location.href,o.setTimeout("window.close()",1e3),t()}catch(e){o.close(),n()}},1e3)}(e,n,t)}function u(){var e=-1;if("Microsoft Internet Explorer"===navigator.appName){var n=navigator.userAgent;null!=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})").exec(n)&&(e=parseFloat(RegExp.$1))}else if("Netscape"===navigator.appName){n=navigator.userAgent;null!=new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})").exec(n)&&(e=parseFloat(RegExp.$1))}return e}n.exports=function(e,n,t,u){function c(){n&&n()}function f(){t&&t()}if(navigator.msLaunchUri)!function(e,n,t){navigator.msLaunchUri(e,t,n)}(e,n,t);else{var d=(s=!!window.opera||navigator.userAgent.indexOf(" OPR/")>=0,l=navigator.userAgent.toLowerCase(),{isOpera:s,isFirefox:"undefined"!=typeof InstallTrigger,isSafari:~l.indexOf("safari")&&!~l.indexOf("chrome")||Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor")>0,isIOS:/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream,isChrome:!!window.chrome&&!s,isIE:!!document.documentMode});d.isFirefox?function(e,n,t){var o=document.querySelector("#hiddenIframe");o||(o=r(document.body,"about:blank"));try{o.contentWindow.location.href=e,t()}catch(e){"NS_ERROR_UNKNOWN_PROTOCOL"==e.name&&n()}}(e,c,f):d.isChrome||d.isIOS?function(e,n,t){for(var r=setTimeout(function(){n(),a.remove()},1e3),i=window;i!=i.parent;)i=i.parent;var a=o(i,"blur",function(){clearTimeout(r),a.remove(),t()});window.location=e}(e,c,f):d.isIE?a(e,c,f):d.isSafari?i(e,c,f):u()}var s,l}},{}]},{},[1])(1)});

//xmlhttp.js
var XMLHttp={_objPool:[],_getInstance:function(){for(var t=0;t<this._objPool.length;t++)if(0==this._objPool[t].xhr.readyState||4==this._objPool[t].xhr.readyState)return this._objPool[t];var e=this._objPool.length;return this._objPool[e]={},this._objPool[e].xhr=this._createObj(),this._objPool[e].timer=null,this._objPool[e]},_createObj:function(){if(window.XMLHttpRequest)var t=new XMLHttpRequest;else for(var e=["MSXML2.XMLHTTP.5.0","MSXML2.XMLHTTP.4.0","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP","Microsoft.XMLHTTP"],o=0;o<e.length;o++)try{t=new ActiveXObject(e[o]);break}catch(t){}return null==t.readyState&&(t.readyState=0,t.addEventListener("load",function(){t.readyState=4,"function"==typeof t.onreadystatechange&&t.onreadystatechange()},!1)),t},sendReq:function(t,e,o,n,a){null==a&&(a=8e3);var r=this._getInstance(),i=r.xhr;if(i){try{e.indexOf("?")>0?e+="&randnum="+Math.random():e+="?randnum="+Math.random(),i.abort(),r.timer&&clearTimeout(r.timer),i.open(t,e,!0),i.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),i.send(o),i.onreadystatechange=function(){if(4==i.readyState)if(200==i.status){var t=JSON.parse(i.responseText);n(t)}else DebugStringEvent(i.status),n({Ret:-1})},r.timer=setTimeout(function(){0!=i.readyState&&4!=i.readyState&&(i.abort(),DebugStringEvent("timeout"))},a)}catch(t){DebugStringEvent("expection"),n({Ret:-1})}}}};

var BrowseType = {
	BrowseMSIE:0,
	BrowseSafari:1,
	BrowseChrome:2,
	BrowseMacOS:3,
	BrowseFirefox:4,
	BrowseEdge:5,
	BrowseOpera:6,
	BrowseMozilla:7,
	Browse360:8,
	BrowseQQ:9,
	BrowseBaidu:10,
	BrowseSougou:11,
	BrowseUnknow:12
}

var gVar;
var gDevice;
var lg;
var gOemInfo;
var g_defaultStreamType = 1;
var g_videomovetime = -1;
var g_keepAliveID = -1;
var g_bReConnect = false;
var nKeepAliveCount=0;
var g_bKeepAlive = true;
var g_bDisconneting = false;
var g_bReConnecting = false;
var g_BrowseType = BrowseType.BrowseUnknow;
var g_browserVer;
var g_bLoadOcx = false;
var g_RecPath = "";
var g_CapPath = "";
var g_DownPath = "";
var g_nOpenVideoMode = 1;
var g_bLoadPlugin = !1;
var g_PluginPort=54455;
var gNet = null;
var gBrowseCtrl = null;
var g_SetupName = "";
var g_devTcpPort = 34567;
var g_devLanuage = "English";
var g_devStyle = "";

function SendMsgToWeb(a) {
	VideoOcxEventCallBack(a);
}
function VideoOcxEventCallBack(){}
function previewEventCallBack() {}
function playbackEventCallBack() {}
function timeLineResizeCallBack() {}
function AlarmInfoEventCallBack() {}
function UpgradeEventCallBack(){}
function OnlineUpgradeEventCallBack(){}
function ClientConfigEventCallBack(){}
function initColorSetEvent(){}
function RemainTimeCallback(){}
function StopVoiceRecord(){}
function EndSendFile(){}
function GetHtml(b) {
	var c = $.extend({
		webUrl: "",
		callback: function(d) {}
	}, b);
	if(g_b8M){
		c.webUrl = "http://127.0.0.1:" + g_PluginPort;
		if(g_WebStyle != ""){
			c.webUrl +="/WebStyle_"+ g_WebStyle;
		}
		c.webUrl +="/"+b.webUrl;
	}
	$.get(c.webUrl+"?version="+version_web, "", c.callback, "html")
};
function GetJS(b) {
	var c = $.extend({
		webUrl: "",
		callback: function(d) {}
	}, b);
	if(g_b8M){
		c.webUrl = "http://127.0.0.1:" + g_PluginPort;
		if(g_WebStyle != ""){
			c.webUrl +="/WebStyle_"+ g_WebStyle;
		}
		c.webUrl +="/"+b.webUrl;
	}
	$.getScript(c.webUrl+"?version="+version_web+"&SetupName="+g_SetupName).done(c.callback).fail(function(jqxhr, settings, exception) {
		alert("Error : " + b.webUrl + " Style : " +g_WebStyle);
	});
};

function CheckPluginVersionExist(port, b) {
	var req = {"MainType":1,"SubType":0, "WebStyle":g_WebStyle,"SetupName":g_SetupName};
	XMLHttp.sendReq('POST', "http://127.0.0.1:"+port+"/Cmd-WebLocalCtrl", JSON.stringify(req), function(e){
		b(e);
	}, 3000);
}

function detectPort(s, e, callback){
	var o = [];
	for (var a = s; a <= e; a++) o.push(a);
	//var u = (new Date).getTime();
	var g = 0;
	var l = function(t) {
		setTimeout((function() {
			CheckPluginVersionExist(o[t], function(e){
				if (e.Ret == -1) {
					g++;
				} else {
					callback(o[t]);
				}
				if (o.length === g) {
					callback(-1);
				}
			});
		}), 100)
	}
	for(var i =0; i < o.length;i++){
		l(i);
	}
}
function checkPluginExist(callback){
	detectPort(54455, 54465,function(port){
		if(port < 0){
			if(g_BrowseType == BrowseType.BrowseMSIE
				|| g_BrowseType == BrowseType.BrowseEdge){
					$("#runDiv").click(function(event){
						window.protocolCheck($(this).attr("href"),function(){
							callback(-1);
						});
						event.preventDefault ? event.preventDefault() : event.returnValue = false;
					});
					$("#runDiv").click();
			}else{
				var eleLink = document.createElement('a');
				eleLink.style.display = 'none';
				eleLink.href = "VideoPlayTool://1";
				document.body.appendChild(eleLink);
				eleLink.click();
			}
			setTimeout(function(){
				detectPort(54455,54465,function(port){
					callback(port);
				});
			}, 1000);
		}else{
			callback(port);
		}
	});
}
function GetPluginVersion(b){
	if(g_nOpenVideoMode == 1){
		var req = {"MainType":1,"SubType":0, "WebStyle":g_WebStyle,"SetupName":g_SetupName};
		XMLHttp.sendReq('POST', "http://127.0.0.1:"+g_PluginPort+"/Cmd-WebLocalCtrl", JSON.stringify(req), function(e){
			DebugStringEvent(JSON.stringify(e));
			b(e);
		});
	}
}
function compareVersion(a, f) {
	var d = a.split(".");
	var e = f.split(".");
	if (d.length != e.length) {
		return false;
	}
	for (var b = 0; b < d.length; ++b) {
		if (d[b] * 1 < e[b] * 1) {
			return false;
		} else {
			if (d[b] * 1 > e[b] * 1) {
				return true;
			}
		}
	}
	return true;
}
function DebugStringEvent(a) {
	if (window.console) {
		window.console.log("PluginDebugInfo:" + a)
	}
}
function ShowErrorTip(nType,version){
	var lang = navigator.language||navigator.userLanguage;
	lang = lang.substr(0, 2);
	var tip= "",tip1="",tip2="",tip3="",tip4="";
	if(nType == 1 || nType == 5){
		if(nType == 1){
			tip = loadLangTip(lang, 0);
			tip1 = loadLangTip(lang, 1);
			tip2 = loadLangTip(lang, 2);
			tip3 = loadLangTip(lang, 3);
			tip4 = loadLangTip(lang, 4);
			$("#LossOcxTip").html(tip);
			$("#SetupTip1").html(tip1);
			$("#SetupTip2").html(tip2);
			$("#SetupTip3").html(tip3);
			$("#SetupTip4").html(tip4);
			if(g_BrowseType == BrowseType.BrowseChrome){
				$("#OcxTip").css("width","500px");
				$("#OcxTip").css("height","160px");
				$("#GoogleTip").show();
			}else{
				$("#OcxTip").css("width","400px");
				$("#OcxTip").css("height","60px");
				$("#OcxTipRow").css("margin-top", "20px");
			}
		}else{
			$("#OcxTipRow").css("margin-top", "20px");
			$("#OcxTip").css("width","400px");
			$("#OcxTip").css("height","60px");
			tip = loadLangTip(lang, 5);
			$("#LossOcxTip").html(tip);
		}
		$("#LossOcxTip").click(function(){
			window.open(downloadAddr);
		});
		$("#OcxTipRow").show();
		$("#webplugins").show();
	}else{
		$("#OcxTip").css("width","400px");
		$("#OcxTip").css("height","60px");
		if(nType == 2){
			tip = loadLangTip(lang, 6);
		}else if(nType == 3){
			tip = loadLangTip(lang, 7);
		}else if(nType == 4){
			tip = loadLangTip(lang, 8);
		}else if(nType == 6){
			if(g_BrowseType == BrowseType.BrowseMSIE){
				tip = loadLangTip(lang, 9);
			}else{
				tip = loadLangTip(lang, 10, version);
			}
		}
		$("#ErrorTip").html(tip);
		$("#ErrTipRow").show();
		$("#webplugins").show();
	}
	$("#OcxTip").show();
}
$(function() {
	var a = navigator.userAgent.toLowerCase();
	if (!$.browser) {
		$.browser = {}
	}
	g_browserVer = (a.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, "0"])[1];
	try {
		if (navigator.platform.toLowerCase().indexOf("mac") > -1) {
			g_BrowseType = BrowseType.BrowseMacOS;
		}
		if ("ActiveXObject" in window) {
			g_BrowseType = BrowseType.BrowseMSIE;
		}else if(a.indexOf("qqbrowser") > 0){
			g_BrowseType=BrowseType.BrowseQQ;
		} else if(a.indexOf("bidubrowser") > 0){
			g_BrowseType=BrowseType.BrowseBaidu;
		}else if(a.indexOf("metasr") > 0){
			g_BrowseType=BrowseType.BrowseSougou;
		}else if (/opera/.test(a)||a.indexOf("opr") > 0) {
			g_BrowseType = BrowseType.BrowseOpera;
		} else {
			if (a.indexOf("edge") > 0) {
				g_BrowseType = BrowseType.BrowseEdge;
			} else {
				if (a.indexOf("safari") > 0 && a.indexOf("chrome") < 0) {
					g_BrowseType = BrowseType.BrowseSafari;
					g_browserVer = a.match(/version\/([\d.]+).*safari/)[1]
				} else {
					if (a.indexOf("firefox") > 0) {
						g_BrowseType = BrowseType.BrowseFirefox;
					} else {
						if (a.indexOf("chrome") > 0) {
							g_BrowseType = BrowseType.BrowseChrome;
							g_browserVer = a.match(/chrome\/([\d.]+)/)[1]
						} else {
								if (/mozilla/.test(a) && !/(compatible|webkit)/.test(a)) {
									g_BrowseType = BrowseType.BrowseMozilla;
								} else {
									g_BrowseType = BrowseType.BrowseMSIE;
								}
						}
					}
				}
			}
		}
	} catch (b) {}
	var m= downloadAddr.lastIndexOf("/");
	var n = downloadAddr.indexOf(".exe");
	if(m>0 && n >m) g_SetupName = downloadAddr.substring(m+1,n);
	$(".mcmcmain").html('<div id="ipcplugin"></div>');
	$(document).keydown(function(c) {
		c = c || window.event;
		if (!c.srcElement) {
			c.srcElement = c.target
		}
		if (c.keyCode == 8 && ((c.srcElement.readOnly == null || c.srcElement.readOnly == true) || (c.srcElement.type !=
				"text" && c.srcElement.type != "textarea" && c.srcElement.type != "password"))) {
			c.keyCode = 0;
			c.returnValue = false;
			return false
		}
	});
	if(g_BrowseType == BrowseType.BrowseChrome){
		if(g_browserVer.split(".")[0] * 1 >= 23){
			InitWeb();
		}else{
			ShowErrorTip(6, 23);
		}
	}else if(g_BrowseType == BrowseType.BrowseFirefox){
		if(g_browserVer* 1 >= 52){
			InitWeb();
		}else{
			ShowErrorTip(6, 52);
		}
	}else if(g_BrowseType == BrowseType.BrowseSafari){
		ShowErrorTip(3);
	}else if(g_BrowseType == BrowseType.BrowseMSIE){
		if(g_browserVer * 1 >= 10){
			InitWeb();
		}else{
			ShowErrorTip(6, 10);
		}
	}else if(g_BrowseType == BrowseType.BrowseOpera ||
		g_BrowseType == BrowseType.BrowseQQ){
		InitWeb();
	}else{
		ShowErrorTip(3);
	}
});

function InitWeb() {
	$("#live", "#login", "#LiveMenu", "#playback", "#PlayBackMenu", "#ClientMenu").css("display", "block");
	$("body,#userName,#loginPsw").keydown(function(f) {
		if (f.keyCode == 13) {
			if ($("#login_user_prompt").css("display") != "none") {
				$("#login_btn_user_ok").click()
			}
		}
	});
	$("body").on("mousedown mouseup", ".psw_eye_arc", function() {
		var b = $(this).siblings("input.PswEyeShow").eq(0);
		if (b.attr("type") == "password") {
			b.attr("type", "text")
		} else {
			b.attr("type", "password")
		}
	});
	$("body").on("focus keyup", ".PswEyeShow", function() {
		var b = $(this);
		$(".psw_eye_arc").css("display", "none");
		if ($(this).val() != "") {
			b.next().css("display", "block")
		} else {
			b.next().css("display", "none")
		}
		$(".PswEyeShow").mouseout(function() {
			$(this).attr("type", "password")
		})
	});
	$("body").bind("click", function(b) {
		var c = b.target;
		if (!($(c).hasClass("psw_eye_arc") && $(c).is(":visible"))) {
			if (!$(c).next().hasClass("psw_eye_arc")) {
				$(".psw_eye_arc").css("display", "none")
			}
		}
	});
	$("body").on("click", ".btn_cancle,.second_close", function() {
		if(this.id=="AudioDLgClose"){
			return;
		}
		$("#SecondaryContent, #ForgetPwdContent, .dialog_role").css("display", "none");
		MasklayerHide();
	})
	$("#logoutMenu").mouseover(function(){
		$("#Logout").css("background-position", "-24px -24px");
	}).mouseout(function(){
		$("#Logout").css("background-position", "-0 -24px");
	}).click(function(){
		closewnd(1);
	});
	
	function InitLanguage(a) {
		if (gOemInfo.langues.indexOf(a) == -1) {
			gOemInfo.defaultLg = "English";
		}else{
			gOemInfo.defaultLg = a;
		}
		var c = gOemInfo.langues.split(" ");
		for (var b = 0; b < c.length; b++) {
			gOemInfo.mul[b] = new Array;
			for (var a = 0; a < LanguageArray.length; a++) {
				if (c[b] == LanguageArray[a][0]) {
					gOemInfo.mul[b][0] = LanguageArray[a][0];
					gOemInfo.mul[b][1] = LanguageArray[a][1];
					break;
				}
			}
		}
		gVar.lg = $.cookie("Language");
		if (gVar.lg == null) {
			gVar.lg = gOemInfo.defaultLg;
		}
		var b;
		for (b = 0; b < gOemInfo.mul.length; b++) {
			if (gOemInfo.mul[b][0] == gVar.lg) {
				break
			}
		}
		if (b >= gOemInfo.mul.length) {
			gVar.lg = gOemInfo.defaultLg;
		}
	}
	function GetPreDevInfo(){
		gOemInfo = new OemInfo();
		gDevice = new DeviceInfo();
		gVar = new GlobalVar();
		lg = new HashmapCom();
		if(g_WebStyle != "" && g_WebStyle != undefined){
		    gOemInfo.skin = g_WebStyle;
		}else if(g_WebStyle == ""){
			gOemInfo.skin = "general";
		}else{
		    gOemInfo.skin = "Oem";
		}
		gOemInfo.langues="English SimpChinese";
		gOemInfo.defaultLg="English";
		var href = window.location.href;
		gDevice.ip = href.split("//")[1].split("/")[0];
		if (gDevice.ip.indexOf("[") != -1 && gDevice.ip.indexOf("]:") != -1){				// ipv6 with port
			gDevice.httpPort = gDevice.ip.split("]:")[1];
			gDevice.ip = gDevice.ip.split("]:")[0];
			gDevice.ip += "]";
		}
		else if(gDevice.ip.indexOf("[") == -1 && gDevice.ip.indexOf(":") != -1)   			// ipv4 with port
		{
			gDevice.httpPort = gDevice.ip.split(":")[1];
			gDevice.ip = gDevice.ip.split(":")[0]
		}
		else{
			gDevice.httpPort = 80;															// default 80 port
		}
		var bInit = gDevice.Init($("#ipcplugin"));
		var c = document.getElementsByTagName("body")[0];
		c.setAttribute("onunload", "closewnd(0)");
		c.setAttribute("onselectstart", "return forbidSelect();");
		c.setAttribute("onload", "window.onresize();");
		if(!bInit){
			alert("Plugin is not loaded!");
			return;
		}
		var c = document.getElementsByTagName("head")[0];
		var d = document.createElement("link");
		if(g_b8M){
			d.href = "http://127.0.0.1:"+g_PluginPort;
			if(g_WebStyle != ""){
				d.href += "/WebStyle_"+g_WebStyle;
			}
			d.href +="/images_"+gOemInfo.skin+"/skin.css";
		}else{
			d.href = "/images_"+gOemInfo.skin+"/skin.css";
		}
		d.rel = "stylesheet";
		d.type = "text/css";
		c.appendChild(d);
		gDevice.tcpPort = g_devTcpPort;
		InitLanguage(g_devLanuage);
		var req = {"Name": "GetSafetyAbility"};
		RfParamCall(function (b, c){
			if(b.Ret == 100){
				gVar.SafetyAbility = b;
			}else{
				gVar.SafetyAbility = null;
			}
			gVar.ChangeLang(gVar.lg);
		}, "Prompt", "GetSafetyAbility", -1, WSMsgID.WsMsgID_AUTHORIZATION, req);
	}
	function loadJS(){
		GetJS({
			webUrl:"plugin/common.js",
			callback:function(a){
				GetJS({
					webUrl:"plugin/jquery.qrcode.min.js",
					callback:function(){
						GetJS({
							webUrl:"plugin/jquery.form.js",
							callback:function(){
								GetJS({
									webUrl:"plugin/function.js",
									callback:function(){
										GetJS({
											webUrl:"plugin/language.js",
											callback:function(){
												GetJS({
													webUrl:"plugin/RSUI.js",
													callback:function(){
														GetJS({
															webUrl:"plugin/class.js",
															callback:function(){
																GetPreDevInfo();
															}
														});
													}
												});
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
	}
	$.ajax({
		url: "/cgi-bin/login.cgi",
		type:"post",
		data: JSON.stringify({ "Name": "GetPreLoginInfo" }),
		contentType: "text/plain",
		datatype:"json",
		success: function(f) {
			if(typeof f == "string"){
				DebugStringEvent("[success]"+f);
				f = JSON.parse(f);					
			}else{
				DebugStringEvent("[success]"+JSON.stringify(f));
			}
			if(f.Ret != 100){
				ShowErrorTip(4);
			}else{
				g_devTcpPort = f.TCPPort;
				g_devLanuage = f.Language;
				if(typeof f.GuiStyle != "undefined" && f.GuiStyle != "General"){
					g_WebStyle = f.GuiStyle;
				}
				checkPluginExist(function(port){
					if(port > 0){
						g_PluginPort = port;
						var m = "0.0.0.0";
						GetPluginVersion(function(e){
							if(e.Ret == 100){
								m = e.Version;
								if(compareVersion(m, version_msie)){
									loadJS();
								}else{
									g_nOpenVideoMode = 0;
									ShowErrorTip(5);
								}
							}else{
								ShowErrorTip(2);
							}
						});
					}else{
						g_nOpenVideoMode = 0;
						ShowErrorTip(1);
					}
				});
			}
		},
		error: function(xhr, status, error) {
			DebugStringEvent("GetPreLoginInfo Error: " + error);
			ShowErrorTip(4);
		}
	});
}

function loadLangTip(a, b, c){
	if (a == "zh") {
		switch (b) {
			case 0: return "请点此，下载并安装播放工具";
			case 1: return "提示：如果谷歌浏览器下载安装播放工具后，还是提示请下载安装，请按如下操作：";
			case 2: return "步骤一： 在谷歌浏览器地址栏输入：";
			case 3: return "步骤二：搜索 &apos;Block insecure private network requests&apos; 配置项，选择Disable";
			case 4: return "步骤三：关闭谷歌浏览器重新打开网页。";
			case 5: return "请点此，下载并更新播放工具";
			case 6: return "获取播放工具版本失败";
			case 7: return "暂时不支持该浏览器";
			case 8: return "获取预登录信息失败";
			case 9: return "只支持ie10以上的浏览器，请更新浏览器";
			case 10: return "浏览器版本太低，请更新到"+ c +"版本以上";
		}
	} else if (a == "ru") {
		switch (b) {
			case 0: return "Пожалуйста, нажмите здесь, чтобы загрузить и установить VideoPlayTool";
			case 1: return "Примечание: если вам по-прежнему предлагается загрузить и установить инструмент воспроизведения в Google Chrome, выполните следующие действия:";
			case 2: return "Шаг 1: Введите в адресную строку Google Chrome:";
			case 3: return "Шаг 2. Найдите «Блокировать небезопасные запросы к частной сети», выберите «Отключить».";
			case 4: return "Шаг 3. Закройте Google Chrome и снова откройте веб-страницу."; 
			case 5: return "Пожалуйста, нажмите здесь, чтобы загрузить и обновить VideoPlayTool";
			case 6: return "Не удалось получить VideoPlayTool";
			case 7: return "Этот браузер не поддерживается";
			case 8: return "Не удалось получить информацию для входа в систему";
			case 9: return "Поддерживаются браузеры Internet Explorer не ниже 10 версии, обновите браузер.";
			case 10: return "Версия браузера слишком низкая, требуется обновление";
		}
	} else {
		switch (b) {
			case 0: return "Please click here to download and install VideoPlayTool";
			case 1: return "Notes: If you are still prompted to download and install after the play tool under Google Chrome is installed, please do as follows:";
			case 2: return "Step 1: Enter in the address bar of Google Chrome:";
			case 3: return "Step 2: Search &apos;Block insecure private network requests&apos;，Select Disable";
			case 4: return "Step 3: Close Google Chrome and reopen the webpage";
			case 5: return "Please click here to download and update VideoPlayTool";
			case 6: return "Failed to obtain VideoPlayTool version";
			case 7: return "This browser is not supported";
			case 8: return "Fail To Obtain Pre-login Info";
			case 9: return "Only support browsers above ie10, please update your browser";
			case 10: return "The browser version is too low, please update to at least "+ c;
		}
	}	
}
