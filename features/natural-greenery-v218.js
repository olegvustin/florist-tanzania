// All three foliage cutouts share the flower canvas, not the same silhouette.
// An isolated SVG image keeps local gradients reliable across cards, the game,
// the preview, the handoff and the journal (including an embedded game URL).
const FTZ218_GREENS=Object.freeze({
 asparagus:{colors:['#264831','#537948','#87a36a','#c6d598'],paths:[
  [[134,166],[122,104],[72,72]], [[144,165],[155,106],[192,68]], [[152,169],[177,124],[221,107]]]},
 palm:{colors:['#214334','#486b40','#77934d','#b4c375'],paths:[
  [[149,173],[177,100],[219,76]], [[134,174],[116,130],[78,105]]]},
 fern:{colors:['#223e31','#45704a','#789257','#b5c298'],paths:[
  [[140,174],[104,111],[74,65]], [[150,171],[175,118],[217,92]]]}
});
const ftz218GreenCache=new Map();
function ftz218GreenArt(green,preview=false){
 const meta=FTZ218_GREENS[green];if(!meta)return '';
 const cacheKey=green+':'+preview;
 if(ftz218GreenCache.has(cacheKey))return ftz218GreenCache.get(cacheKey);
 const [dark,mid,light,glint]=meta.colors;
 const defs=`<defs>
 <linearGradient id="dark" x2="85%" y2="100%"><stop stop-color="${light}"/><stop offset=".48" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
 <linearGradient id="mid" x2="80%" y2="90%"><stop stop-color="${glint}"/><stop offset=".44" stop-color="${light}"/><stop offset=".68" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
 <linearGradient id="warm" x2="15%" y2="100%"><stop stop-color="${light}"/><stop offset=".63" stop-color="${mid}"/><stop offset="1" stop-color="${dark}"/></linearGradient>
 </defs>`;
 const fills=['url(#dark)','url(#mid)','url(#warm)'];
 const n=tzGreenRound;
 const leaf=(x,y,dx,dy,w,i,vein=true)=>tzGreenLeaf(x,y,dx,dy,w,fills[i%3],1,vein);
 const stroke=(a,c,b,w,color)=>`<path d="M${n(a[0])} ${n(a[1])} Q${n(c[0])} ${n(c[1])} ${n(b[0])} ${n(b[1])}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
 let art='';
 meta.paths.forEach(([root,midpoint,end],j)=>{
  art+=stroke(root,midpoint,end,green==='palm'?1.48:1.03,mid);
  const count=green==='palm'?13:green==='fern'?11:13;
  for(let i=0;i<count;i++) for(const side of [-1,1]){
   const t=.22+(i+(side===1?.31:0))/(count-1)*.72;
   const [x,y]=tzGreenQ(root,midpoint,end,t);
   const [ax,ay]=tzGreenTangent(root,midpoint,end,t);
   const taper=Math.pow(Math.sin(Math.PI*t),.78);
   const len=(green==='palm'?9+25*taper:green==='fern'?7+20*taper:5+16*taper)
    *(j===0?1:j===1?.82:.70)*(1+.14*Math.sin(3.11*i+side*1.52+j*1.34));
   const vx=(-ay*side*.83+ax*.50)*len,vy=(ax*side*.83+ay*.50)*len;
   if(green==='asparagus'){
    const endlet=[x+vx,y+vy];
    art+=stroke([x,y],[x+vx*.48+ax*2,y+vy*.48+ay*2],endlet,.50,mid);
    for(let k=1;k<=8;k++){
     const f=k/9;
     const xx=x+vx*f+ax*Math.sin(f*Math.PI),yy=y+vy*f+ay*Math.sin(f*Math.PI);
     const fine=3.6*(1-f*.53)*(1+.23*Math.sin(k*2.1+i));
     art+=leaf(xx,yy,ax*fine+vx*.16,ay*fine+vy*.16,.88,i+k+j,false);
     art+=leaf(xx,yy,-ax*fine*.72+vx*.13,-ay*fine*.72+vy*.13,.67,i+k+j+1,false);
    }
   }else{
    const wide=green==='palm'?1.30+2.24*taper:2.9+3.15*taper;
    art+=leaf(x,y,vx,vy,wide,j+i+(side===1?1:0));
    if(green==='fern'&&i<9){
     art+=leaf(x+vx*.30,y+vy*.30,vx*.32+ax*5,vy*.32+ay*5,1.75,j+i+1,false);
     art+=leaf(x+vx*.56,y+vy*.56,vx*.26+ax*3,vy*.26+ay*3,1.25,j+i+2,false);
    }
   }
  }
  const [ax,ay]=tzGreenTangent(root,midpoint,end,1);
  art+=leaf(end[0]-ax*6,end[1]-ay*6,ax*11,ay*11,green==='fern'?2.2:1.3,j);
 });
 const view=preview?'46 54 194 133':'0 0 290 286';
 const source=`<svg xmlns="http://www.w3.org/2000/svg" width="${preview?194:290}" height="${preview?133:286}" viewBox="${view}">${defs}${art}</svg>`;
 const uri='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(source).replace(/'/g,'%27');
 ftz218GreenCache.set(cacheKey,uri);
 return uri;
}
function greenerySvgMarkup(green){
 const art=ftz218GreenArt(green);
 if(!art)return '';
 // Outer SVG retains existing bouquet transforms; inner image has its own
 // document, so an identically named gradient in another bouquet cannot win.
 return `<svg class="greenery-layer ftz218-green-art" viewBox="0 0 290 286" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true"><image href="${art}" width="290" height="286"/></svg>`;
}
function greeneryPreviewImage(green){
 return ftz218GreenArt(green,true);
}
