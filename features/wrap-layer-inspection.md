# Paper layers
raw_len 308043
render_prefix function renderHandoffWrapLayers(){
  if(ftzIsBasket()){
    const decoration=ftzRenderAllDecor('savanna');
    return {
      back:`<div class="ftz-basket-layer ftz-basket-back" aria-hidden="true"><img src="${ftzBasketVariantImage(state.chosen.length?"back":"emptyBack",state.chosen.length?'[IMAGE]':'[IMAGE]')}" alt=""></div>`,
      front:`<div class="ftz-basket-layer ftz-basket-front" aria-hidden="true"><img src="${ftzBasketVariantImage("front",'[IMAGE]')}" alt=""></div>${decoration}${renderBouquetNote()}`
    };
  }

 const approvedWrap=$('wrap')?.value||'kraft';
 if(Object.prototype.hasOwnProperty.call(TZ_APPROVED_PACK_IMAGES,approvedWrap)){
  const image=TZ_APPROVED_PACK_IMAGES[approvedWrap];
  const markup=`<img src="${image}" class="approved-african-pack-art" alt="" draggable="false">`;
  const classicClass=["kraft","linen","velvet","signature"].includes(approvedWrap)?" classic-material-wrap classic-material-"+approvedWrap:(FTZ_TEST_WRAP_NAMES[approvedWrap]?" ftz-test-pack-front":"");
  const decor=$('decor')?.value||'none';
  const decorOverlay=ftzRenderAllDecor(approvedWrap);
  const noteOverlay=renderBouquetNote();
  // Back shows the original illustration; lower-front overlay covers hidden stems.
  // The note is not part of the clipped packaging image: it stays visible on all eight wraps.
  return {back:`<div class="handoff-paper-back approved-african-pack${FTZ_TEST_WRAP_NAMES[approvedWrap]?' ftz-test-pack-back':''}">${markup}</div>`,
          front:`<div class="handoff-paper-front approved-african-pack approved-african-pack-overlay${classicClass}">${markup}</div>${decorOverlay}${noteOverlay}`};
 }

 const wrap=$('wrap')?.value||'kraft',decor=$('decor')?.value||'none',note=$('note')?.value||'none';
 const schemes={
  kraft:{base:'#d9af8e',light:'#f7e2cd',side:'#b9825e',deep:'#8f613f',rim:'#fff6ea',ribbon:'#b86c59',ribbon2:'#8d4f44',tissue:'#fff0dc',motif:'#9f6048',motif2:'#e8c193',bead:'#f6d694',accent:'#6f4a31'},
  linen:{base:'#dcc9ad',light:'#f8f0e2',side:'#ad9270',deep:'#846d52',rim:'#fffdfa',ribbon:'#8fa789',ribbon2:'#637b62',tissue:'#fff9ef',motif:'#6d7e55',motif2:'#d6b37d',bead:'#efe2b7',accent:'#59684b'},
  velvet:{base:'#c38fa0',light:'#f7dde6',side:'#946173',deep:'#6d4453',rim:'#fff7fb',ribbon:'#7e4f63',ribbon2:'#553244',tissue:'#fdebf0',motif:'#f0c2a2',motif2:'#ffd9c6',bead:'#f6dbbe',accent:'#71435a'},
  signature:{base:'#9db6bc',light:'#edf6f2',side:'#69878f',deep:'#48656c',rim:'#ffffff',ribbon:'#b89951',ribbon2:'#7b6331',tissue:'#f3f7f4',motif:'#d7a84f',motif2:'#fff0c8',bead:'#f0d28c',accent:'#6c875f'}
 };
 const pal=schemes[wrap]||schemes.kraft;
 const lid=wrap;
 const motifBack=`<g opacity=".48" fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path d="M68 116 l10 -6 l10 6 l-10 6 z" stroke="${pal.motif}" stroke-width="1.5"/>
   <path d="M86 132 l10 -6 l10 6 l-10 6 z" stroke="${pal.motif2}" stroke-width="1.4"/>
   <path d="M204 116 l10 -6 l10 6 l-10 6 z" stroke="${pal.motif}" stroke-width="1.5"/>
   <path d="M186 132 l10 -6 l10 6 l-10 6 z" stroke="${pal.motif2}" stroke-width="1.4"/>
   <path d="M112 90 q9 6 18 0 q9 -6 18 0 q9 6 18 0" stroke="${pal.motif}" stroke-width="1.25"/>
   <path d="M120 102 q7 4 14 0 q7 -4 14 0 q7 4 14 0" stroke="${pal.motif2}" stroke-width="1.05" opacity=".9"/>
   <path d="M104 82 L113 77 L122 82 L113 87 Z M168 82 L177 77 L186 82 L177 87 Z" stroke="${pal.accent}" stroke-width="1.1" opacity=".65"/>
 </g>`;
 const heritageBand=`<g opacity=".74">
   <path d="M95 154 Q119 160
render_suffix ><circle cx="145" cy="202" r="4.6"/></g>`:'';
 const charm=decor==='charm'?`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M145 205 Q145 192 156 190" stroke="${pal.ribbon2}" stroke-width="2.1" opacity=".72"/><path d="M156 190 C151 181 142 182 141 189 C140 182 131 181 126 190 C122 198 129 205 141 214 C153 205 160 198 156 190Z" fill="#d97562" stroke="#a95546" stroke-width="1.5"/></g>`:'';
 const butterfly=decor==='butterfly'?`<g stroke="#9e7a4d" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="M186 151 C192 140 205 140 208 151 C201 154 195 160 192 167 C187 163 185 157 186 151Z" fill="#e9c789"/><path d="M186 151 C180 140 167 140 164 151 C171 154 177 160 180 167 C185 163 187 157 186 151Z" fill="#f3ddac"/><path d="M186 151 C192 161 203 166 200 176 C193 175 187 170 184 165 C183 160 184 155 186 151Z" fill="#f4e6c1"/><path d="M186 151 C180 161 169 166 172 176 C179 175 185 170 188 165 C189 160 188 155 186 151Z" fill="#fff3d8"/><path d="M186 147 L186 176" stroke="#795d3b"/><path d="M186 147 Q182 141 180 139 M186 147 Q190 141 192 139"/></g>`:'';
 const twine=decor==='twine'?`<g fill="none" stroke-linecap="round"><path d="M90 175 Q119 193 145 214 Q171 193 200 175" stroke="#af8550" stroke-width="2.8" opacity=".95"/><path d="M102 180 Q123 195 145 212 Q167 195 188 180" stroke="#e6d1a1" stroke-width="1.2" opacity=".9"/><path d="M145 214 L145 228" stroke="#af8550" stroke-width="2.8"/><circle cx="145" cy="214" r="4.1" fill="#d8bf7d" stroke="#9b7d47" stroke-width="1"/></g>`:'';
 const petals=decor==='petals'?`<g fill="#df8f7e" opacity=".9"><path d="M94 156 Q101 149 106 156 Q100 163 94 156Z"/><path d="M104 168 Q111 161 116 168 Q110 175 104 168Z"/><path d="M186 152 Q193 145 198 152 Q192 159 186 152Z"/><path d="M198 166 Q205 159 210 166 Q204 173 198 166Z"/></g>`:'';
 const suncharm=decor==='suncharm'?`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="194" cy="160" r="8" fill="#ffd56b" stroke="#d49b39" stroke-width="1.4"/><path d="M194 146 L194 138 M194 182 L194 174 M180 160 L172 160 M216 160 L208 160 M184 150 L179 145 M204 150 L209 145 M184 170 L179 175 M204 170 L209 175" stroke="#d49b39" stroke-width="1.5"/></g>`:'';
 const leafpin=decor==='leafpin'?`<g fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M98 162 C110 148 124 150 127 162 C117 174 104 176 98 162Z" fill="#d8b56a" stroke="#ae7e39" stroke-width="1.4"/><path d="M101 162 Q113 162 123 157" stroke="#ae7e39" stroke-width="1.1"/><path d="M112 162 Q111 168 108 172" stroke="#ae7e39" stroke-width="1.1"/></g>`:'';
 const noteItem=noteOptions[note]||noteOptions.none;
 const noteLabel=noteItem.short||'';
 const noteSize=noteLabel.length>8?5.1:6.1;
 const paperImage=note!=='none'?TZ_PAPER_ART[TZ_PAPER_INDEX[note]??0]:'';
 const noteTag=note!=='none'?`<g class="tz-paper-label" style="filter:drop-shadow(0 2px 3px rgba(60,40,21,.24))"><image href="${paperImage}" x="189" y="179" width="62" height="69" preserveAspectRatio="xMidYMid meet"/><g transform="rotate(-4 220 216)"><rect x="202" y="212" width="39" height="14" rx="6" fill="rgba(255,251,239,.94)" stroke="rgba(122,85,51,.24)" stroke-width=".7"/><text x="221.5" y="221.8" text-anchor="middle" font-family="Arial,sans-serif" font-size="${noteLabel.length>7?6:7.4}" font-weight="700" fill="#514333">${noteLabel}</text></g></g>`:'';
 const decorOverlay=Object.prototype.hasOwnProperty.call(TZ_PENDANT_INDEX,decor)?'':renderDecorOverlay(decor,wrap);
 const pendantIndex=TZ_PENDANT_INDEX[decor];
 const hasPendant=pendantIndex!==undefined;
 const pendantArt=hasPendant?TZ_PENDANT_ART[pendantIndex]:'';
 const pendantX=note!=='none'?62:181;
 const pendantTag=hasPendant?`<image class="tz-decor-pendant" href="${pendantArt}" x="${pendantX}" y="153" width="65" height="83" preserveAspectRatio="xMidYMid meet"/>`:'';
 const olderDecorArt=(decorOverlay||hasPendant)?'':(pearls+charm+butterfly+twine+petals+suncharm+leafpin);
 const beadBand = decor==='ribbonVIP'||decor==='ribbonLuxe' ? `<g opacity=".88"><path d="M120 205 Q145 190 170 205" fill="none" stroke="${pal.bead}" stroke-width="2.3" stroke-linecap="round"/>${Array.from({length:5},(_,i)=>`<circle cx="${121+i*12.2}" cy="${205-(i===2?4:0)}" r="2.4" fill="${pal.bead}" stroke="${pal.side}" stroke-width=".5"/>`).join('')}</g>` : '';
 const beadFringe=`<g opacity=".72" stroke-linecap="round">
   <path d="M118 218 v10 M132 220 v9 M145 222 v11 M158 220 v9 M172 218 v10" stroke="${pal.motif}" stroke-width="1.2"/>
   <circle cx="118" cy="229" r="2" fill="${pal.bead}"/><circle cx="132" cy="229" r="1.8" fill="${pal.bead}"/><circle cx="145" cy="233" r="2.2" fill="${pal.bead}"/><circle cx="158" cy="229" r="1.8" fill="${pal.bead}"/><circle cx="172" cy="229" r="2" fill="${pal.bead}"/>
 </g>`;
 const front=`<div class="handoff-paper-front"><svg viewBox="0 0 290 286" aria-hidden="true" focusable="false">
 <defs>
  <linearGradient id="giftFrontL-${lid}" x1="0%" y1="0%" x2="100%" y2="100%"><stop stop-color="${pal.light}"/><stop offset="50%" stop-color="${pal.base}"/><stop offset="100%" stop-color="${pal.side}"/></linearGradient>
  <linearGradient id="giftFrontR-${lid}" x1="100%" y1="0%" x2="0%" y2="100%"><stop stop-color="${pal.light}"/><stop offset="50%" stop-color="${pal.base}"/><stop offset="100%" stop-color="${pal.side}"/></linearGradient>
  <linearGradient id="giftCenter-${lid}" x1="0%" y1="0%" x2="0%" y2="100%"><stop stop-color="${pal.light}"/><stop offset="64%" stop-color="${pal.base}"/><stop offset="100%" stop-color="${pal.deep}"/></linearGradient>
 </defs>
 <path d="M84 134 Q109 138 145 154 L145 255 Q103 248 71 194 L60 139 Q73 134 84 134Z" fill="url(#giftFrontL-${lid})" stroke="${pal.side}" stroke-width="1.6"/>
 <path d="M206 134 Q181 138 145 154 L145 255 Q187 248 219 194 L230 139 Q217 134 206 134Z" fill="url(#giftFrontR-${lid})" stroke="${pal.side}" stroke-width="1.6"/>
 <path d="M115 156 Q145 170 175 156 L160 247 Q145 259 130 247Z" fill="url(#giftCenter-${lid})" opacity=".98"/>
 <path d="M63 140 Q96 127 122 149 M227 140 Q194 127 168 149" stroke="${pal.rim}" stroke-width="5" opacity=".94" stroke-linecap="round" fill="none"/>
 <path d="M90 149 Q111 191 133 234 M200 149 Q179 191 157 234" stroke="${pal.deep}" stroke-width="2.2" opacity=".22" fill="none"/>
 <path d="M78 160 Q94 203 124 232 M212 160 Q196 203 166 232" stroke="${pal.rim}" stroke-width="2.3" opacity=".42" fill="none"/>
 <path d="M112 160 Q145 177 178 160" stroke="${pal.rim}" stroke-width="3.1" opacity=".9" fill="none"/>
 <path d="M145 175 Q145 215 145 244" stroke="${pal.deep}" stroke-width="2" opacity=".18" fill="none"/>
 ${motifFront}${lace}${olderDecorArt}${beadBand}${beadFringe}${bow}${pendantTag}
 ${wrap==='signature'?`<path d="M84 170 Q112 209 135 240 M206 170 Q178 209 155 240" stroke="#f5e9ca" stroke-width="2.1" opacity=".82" fill="none"/><path d="M116 188 Q145 202 174 188" stroke="#f9eed4" stroke-width="1.5" fill="none" opacity=".8"/>`:''}
 </svg></div>${decorOverlay}${renderBouquetNote()}`;
 return {back,front};
}




### .ftz191-split

/* Раздельное отображение цветочных головок и нижней части растений.
   Оба фрагмента следуют одному draggable-элементу и отражаются при вручении. */
.bouquet:has(.classic-material-wrap) .flower-head.ftz191-split,
.handoff-bouquet:has(.classic-material-wrap) .flower-head.ftz191-split{isolation:isolate;overflow:visible!important}
.bouquet .flower-head.ftz191-split img,
.handoff-bouquet .flower-head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-im
 Оба фрагмента следуют одному draggable-элементу и отражаются при вручении. */
.bouquet:has(.classic-material-wrap) .flower-head.ftz191-split,
.handoff-bouquet:has(.classic-material-wrap) .flower-head.ftz191-split{isolation:isolate;overflow:visible!important}
.bouquet .flower-head.ftz191-split img,
.handoff-bouquet .flower-head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%)
ouquet:has(.classic-material-wrap) .flower-head.ftz191-split,
.handoff-bouquet:has(.classic-material-wrap) .flower-head.ftz191-split{isolation:isolate;overflow:visible!important}
.bouquet .flower-head.ftz191-split img,
.handoff-bouquet .flower-head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-
ftz191-split,
.handoff-bouquet:has(.classic-material-wrap) .flower-head.ftz191-split{isolation:isolate;overflow:visible!important}
.bouquet .flower-head.ftz191-split img,
.handoff-bouquet .flower-head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  mask-image:linear
-bouquet .flower-head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opaci
idth:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img
#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.35) 90%,transparent 100%)!important;
  mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edg
-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.35) 90%,transparent 100%)!important;
  mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.3

### .ftz191-flower-top
head.ftz191-split img{position:absolute;inset:0;width:100%!important;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-
nt;height:100%!important;display:block;object-fit:contain;pointer-events:none;user-select:none}
.bouquet .flower-head.ftz191-split img.ftz191-flower-top,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-flower-top{
  -webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  mask-image:linear-gradient(to bottom,#000 0%,#000 calc(var(--ftz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img.ftz191-stem-bott

### .ftz191-stem-bottom
tz-head-edge,61%) - 10%),rgba(0,0,0,.88) var(--ftz-head-edge,61%),transparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.35) 90%,transparent 100%)!important;
  mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000
ransparent calc(var(--ftz-head-edge,61%) + 13%))!important;
  opacity:1!important;z-index:2;
}
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
  -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.35) 90%,transparent 100%)!important;
  mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,61%) - 19%),rgba(0,0,0,.34) calc(var(--ftz-head-edge,61%) - 7%),#000 calc(var(--ftz-head-edge,61%) + 8%),rgba(0,0,0,.35) 90%,transparen
75%,38% 74%,50% 75%,62% 74%,75% 75%,88% 77%,100% 79%,100% 100%,0 100%)!important;
}
/* Keep the flowers vivid; fade the bottom of their own illustrated stems. */
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
 opacity:.31!important;
 -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,56%) - 13%),rgba(0,0,0,.18) var(--ftz-head-edge,56%),rgba(0,0,0,.78) calc(var(--ftz-head-edge,56%) + 13%),transparent 90%)!important;
 mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,56%) - 13%),rgba(0,0,0,.18) var(--ftz-head-edge,56%),rgba(0,0,0,.7
0%)!important;
}
/* Keep the flowers vivid; fade the bottom of their own illustrated stems. */
.bouquet .flower-head.ftz191-split img.ftz191-stem-bottom,
.handoff-bouquet .flower-head.ftz191-split img.ftz191-stem-bottom{
 opacity:.31!important;
 -webkit-mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,56%) - 13%),rgba(0,0,0,.18) var(--ftz-head-edge,56%),rgba(0,0,0,.78) calc(var(--ftz-head-edge,56%) + 13%),transparent 90%)!important;
 mask-image:linear-gradient(to bottom,transparent 0%,transparent calc(var(--ftz-head-edge,56%) - 13%),rgba(0,0,0,.18) var(--ftz-head-edge,56%),rgba(0,0,0,.78) calc(var(--ftz-head-edge,56%) + 13%),transparent 90%)!important;

### .ftz-pocket-layers
% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;
}
/* Do not let a double overlay of greenery spike over the flower heads. */
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers{opacity:.52;transform:translateY(8px) scale(.84);transform-origin:50% 70%}
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{opacity:.66;transform:translateY(7px) scale(.85);transform-origin:50% 70%}
</style>
<style id="tz-velvet-floristry-015185">
/* Весь набор передней и задней ткани сокращён совместно; края ниже цветочной шапки. */
.bouquet:has(.classic-material-velvet) .approved-african-pack,
.handoff-bouquet:has(.classic-material-velvet) .approved-african-p
et:has(.classic-material-velvet) .approved-african-pack{
  transform:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight flo
m:translateY(19px) scaleX(.80) scaleY(.65)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
  opacity:.23!important;
  transform:translateY(21px) scale(.76)!important;
  transform-origin:50% 76%!important;
}
/* Второй симметричный слой создавал два искусственных зелёных пучка. */
.bouquet:has(.classic-material-velvet) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-velvet) .ftz-paper-selected-green{display:none!important}
</style>
<style id="tz-velvet-floristry-015186">
/* Tight floral dome. Fade only the stalk/leaves at the bottom of the original

quet:has(.classic-material-velvet) .approved-african-pack{
 transform:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!importa
rm:translateY(23px) scaleX(.80) scaleY(.62)!important;
 transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-velvet) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-velvet) .ftz-pocket-layers{
 opacity:.14!important;
 transform:translateY(28px) scale(.7)!important;
}
</style>
<style id="tz-classic-wrap-final-015189">
/* v0.15.189 — финальная подгонка классических упаковок для теста в бархате, крафте и льне. */
.bouquet:has(.classic-material-kraft) .approved-african-pack,
.handoff-bouquet:has(.classic-material-kraft) .approved-african-pack{
  transform:translateY(20px) scaleX(.80) scaleY(.70)!important;
  transform-origin:50% 78%!important;
}
.bouquet .handoff-paper
97) 68%,rgba(0,0,0,.74) 82%,transparent 97%);
  mask-image:linear-gradient(to bottom,#000 0%,#000 57%,rgba(0,0,0,.97) 68%,rgba(0,0,0,.74) 82%,transparent 97%);
}
.bouquet:has(.classic-material-kraft) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-kraft) .ftz-pocket-layers{
  opacity:.16!important;
  transform:translateY(26px) scale(.70)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-kraft) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-kraft) .ftz-paper-selected-green{
  opacity:.24!important;
  transform:translateY(17px) scale(.82)!important;
  transform-origin:50% 72%!important;
}
.bouquet:has(.classic-material-linen) .ftz-p
gradient(to bottom,#000 0%,#000 57%,rgba(0,0,0,.97) 68%,rgba(0,0,0,.74) 82%,transparent 97%);
}
.bouquet:has(.classic-material-kraft) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-kraft) .ftz-pocket-layers{
  opacity:.16!important;
  transform:translateY(26px) scale(.70)!important;
  transform-origin:50% 76%!important;
}
.bouquet:has(.classic-material-kraft) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-kraft) .ftz-paper-selected-green{
  opacity:.24!important;
  transform:translateY(17px) scale(.82)!important;
  transform-origin:50% 72%!important;
}
.bouquet:has(.classic-material-linen) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-linen) .ftz-p
ic-material-kraft) .ftz-paper-selected-green{
  opacity:.24!important;
  transform:translateY(17px) scale(.82)!important;
  transform-origin:50% 72%!important;
}
.bouquet:has(.classic-material-linen) .ftz-pocket-layers,
.handoff-bouquet:has(.classic-material-linen) .ftz-pocket-layers{
  opacity:.18!important;
  transform:translateY(24px) scale(.73)!important;
  transform-origin:50% 75%!important;
}
.bouquet:has(.classic-material-linen) .ftz-paper-selected-green,
.handoff-bouquet:has(.classic-material-linen) .ftz-paper-selected-green{
  opacity:.28!important;
  transform:translateY(15px) scale(.84)!important;
  transform-origin:50% 72%!important;
}
.bouquet:has(.classic-material-signature) .f

### .approved-african-pack-overlay
bsolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible;}
.approved-african-pack-art{width:100%;height:100%;display:block;object-fit:contain;pointer-events:none;user-select:none;}
.approved-african-pack-overlay{clip-path:polygon(0 35%,12% 38%,23% 43%,34% 48%,43% 56%,50% 60%,57% 56%,66% 48%,77% 43%,88% 38%,100% 35%,100% 100%,0 100%);}
.approved-pack-mini{width:32px;height:30px;border-radius:5px;background:#f9f2df;overflow:hidden}
.approved-pack-mini img{width:100%;height:100%;object-fit:contain}
.approved-wrap-detail{display:grid;gap:2px;justify-items:center;margin-top:8px;padding:8px;border-radius:12px;background:#fff8ec;border:1px solid #e9d8b9}
.approved-wrap-detail img
th:48px;height:42px}.preview-art.tz-note-preview{width:54px;min-width:54px}}
</style>
<style>/* v0.15.34: botanical layering. The unmodified approved artwork masks stems and lower petals. */
.bouquet .approved-african-pack-overlay{z-index:33!important}
.bouquet .approved-inner-stems{z-index:4!important;opacity:1!important}
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1!important}
</style><style id="african-pendant-fix-v01539">
/* Independent image layer preserves every pixel of the four approved wrappings. */
.bouquet .african-pendant-layer{position:absolute;left:8%;top:59%;width:19%;height:29%;z-index:45;pointer-events:none;display:flex;align-items:center;just
ks stems and lower petals. */
.bouquet .approved-african-pack-overlay{z-index:33!important}
.bouquet .approved-inner-stems{z-index:4!important;opacity:1!important}
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1!important}
</style><style id="african-pendant-fix-v01539">
/* Independent image layer preserves every pixel of the four approved wrappings. */
.bouquet .african-pendant-layer{position:absolute;left:8%;top:59%;width:19%;height:29%;z-index:45;pointer-events:none;display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 4px rgba(55,31,13,.28));transform:rotate(-8deg)}
.bouquet .african-pendant-layer img{width:100%;height:100%;object-fi
 identically so the front/back silhouettes remain aligned. */
.bouquet .approved-african-pack {
  transform: translateY(10px) scale(.86) !important;
  transform-origin: 50% 72% !important;
}
.bouquet .approved-african-pack-overlay{ z-index:33 !important; }
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1 !important;}
</style><style id="tz-upgrade-art-fix-v1598">
#upgradeGrid .upgrade-visual, .shop-unlock-art .upgrade-visual {background:transparent!important;box-shadow:none!important;border:none!important;overflow:visible!important;}
#upgradeGrid .upgrade-visual::before,#upgradeGrid .upgrade-visual::after,.shop-unlock-art .upgrade-visual::before,.shop-unlock-art .
 {
  transform: translateY(10px) scale(.86) !important;
  transform-origin: 50% 72% !important;
}
.bouquet .approved-african-pack-overlay{ z-index:33 !important; }
.bouquet .approved-african-pack:not(.approved-african-pack-overlay){z-index:1 !important;}
</style><style id="tz-upgrade-art-fix-v1598">
#upgradeGrid .upgrade-visual, .shop-unlock-art .upgrade-visual {background:transparent!important;box-shadow:none!important;border:none!important;overflow:visible!important;}
#upgradeGrid .upgrade-visual::before,#upgradeGrid .upgrade-visual::after,.shop-unlock-art .upgrade-visual::before,.shop-unlock-art .upgrade-visual::after{display:none!important;content:none!important;}
#upgradeGrid .upgrade-v
e id="tz-new-four-wraps-v015107">
/* New images retain transparent pixels; front and rear share the exact same alignment. */
.bouquet .approved-african-pack-art{object-fit:contain!important}
.bouquet .approved-african-pack-overlay{clip-path:polygon(0 36%,13% 39%,24% 44%,36% 49%,43% 55%,50% 58%,57% 55%,64% 49%,76% 44%,87% 39%,100% 36%,100% 100%,0 100%)}
</style><style id="tz-classic-natural-015108">
/* Классическая упаковка не должна перекрывать цветочные головки. */
.bouquet:has(.approved-african-pack-art) .approved-african-pack-overlay{pointer-events:none}
.bouquet:has(.approved-african-pack-art)>.approved-african-pack{object-fit:contain}
</style>
<style id="tz-classic-wrap-visibility-01510
6% 44%,87% 39%,100% 36%,100% 100%,0 100%)}
</style><style id="tz-classic-natural-015108">
/* Классическая упаковка не должна перекрывать цветочные головки. */
.bouquet:has(.approved-african-pack-art) .approved-african-pack-overlay{pointer-events:none}
.bouquet:has(.approved-african-pack-art)>.approved-african-pack{object-fit:contain}
</style>
<style id="tz-classic-wrap-visibility-015109">
/* Классические упаковки: открываем верхнюю часть букета, не меняя африканские варианты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,3

</style>
<style id="tz-classic-wrap-visibility-015109">
/* Классические упаковки: открываем верхнюю часть букета, не меняя африканские варианты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.

### classic-material-wrap
k{object-fit:contain}
</style>
<style id="tz-classic-wrap-visibility-015109">
/* Классические упаковки: открываем верхнюю часть букета, не меняя африканские варианты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче 
ие упаковки: открываем верхнюю часть букета, не меняя африканские варианты. */
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-b
n-pack-overlay{
 clip-path:polygon(0 67%,13% 64%,27% 64%,39% 68%,50% 70%,61% 68%,73% 64%,87% 64%,100% 67%,100% 100%,0 100%)!important;
}
/* Декоративные элементы игрок выбирает отдельно. */
.bouquet .classic-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.hand
c-material-wrap img{display:block;object-fit:contain}
</style>

<style id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay{
  clip-path:polygon(0 69%,12% 66%,24% 64%,37% 65%,50% 66%,63% 65%,76% 64%,88% 66%,100% 69%,100% 100%,0 100%)!important;

e id="tz-classic-wrap-seams-015110">
/* Классические упаковки: чуть цельнее нижняя часть и мягче открытие сверху. */
.bouquet:has(.classic-material-wrap) .approved-african-pack,
.handoff-bouquet:has(.classic-material-wrap) .approved-african-pack{
  transform:translateY(8px) scale(.87)!important;
  transform-origin:50% 73%!important;
}
.bouquet .handoff-paper-front.classic-material-wrap.approved-african-pack-overlay,
.handoff-bouquet .handoff-paper