/* =====================================================
取得
===================================================== */

const board = document.getElementById("board");
const canvas = document.getElementById("play-layer");
const ctx = canvas.getContext("2d");

const modal = document.getElementById("modal");
const qimg = document.getElementById("question-image");
const input = document.getElementById("answer-input");

const answerListBtn = document.getElementById("answerListBtn");
const undoBtn = document.getElementById("undoBtn");
const resetBtn = document.getElementById("resetBtn");


const answerModal = document.getElementById("answer-modal");
const answerText = document.getElementById("answer-text");
const closeAnswerBtn = document.getElementById("closeAnswerBtn");


/* =====================================================
全体サイズ（ここを変える）
===================================================== */

const SIZE = 540;   // 元950 → 小型化


/* =====================================================
盤面位置（超重要）
===================================================== */

const BX = 69;     // 左右位置
const BY = 23;      // 上下位置
const CELL = 37;    // 1マスサイズ


/* =====================================================
文字位置微調整（ここを触ればよい）
===================================================== */

/* 駒・盤面文字 */
const TXT_DX = 9;   // 右へ
const TXT_DY = 4;   // 下へ

/* tray文字 */
const TRAY_DX = 5;
const TRAY_DY = 4;
/* tray開始位置 */
const TRAY_X = 50;
const TRAY_Y = 340;
const TRAY_CELL = 37;

/* =====================================================
高画質Canvas
===================================================== */

const DPR = window.devicePixelRatio || 1;

canvas.width = SIZE * DPR;
canvas.height = SIZE * DPR;
canvas.style.width = SIZE + "px";
canvas.style.height = SIZE + "px";

ctx.scale(DPR,DPR);


/* =====================================================
背景サイズ
===================================================== */

document.getElementById("final-image").style.width = SIZE+"px";
document.getElementById("final-image").style.height = SIZE+"px";
document.getElementById("wrapper").style.width = SIZE+"px";
document.getElementById("wrapper").style.height = SIZE+"px";


/* =====================================================
レイヤー
===================================================== */

board.style.zIndex="5";
canvas.style.zIndex="4";
board.style.pointerEvents="none";


/* =====================================================
問題モーダル 下側入力欄
===================================================== */

document.getElementById("modal-content").style.display="flex";
document.getElementById("modal-content").style.flexDirection="column";
document.getElementById("modal-content").style.alignItems="center";
document.getElementById("modal-content").style.background="transparent";
document.getElementById("modal-content").style.padding="0";


/* =====================================================
27問
===================================================== */

const questions = [
{img:"にたもの.png",answer:"にたもの"},
{img:"ふぃっとねす.png",answer:"ふぃっとねす"},
{img:"ほし.png",answer:"ほし"},
{img:"ぬすみ.png",answer:"ぬすみ"},
{img:"あふりか.png",answer:"あふりか"},
{img:"はも.png",answer:"はも"},
{img:"しゅむ.png",answer:"しゅむ"},
{img:"ひわ.png",answer:"ひわ"},
{img:"おきぬけ.png",answer:"おきぬけ"},
{img:"へや.png",answer:"へや"},
{img:"てあせ.png",answer:"てあせ"},
{img:"はなや.png",answer:"はなや"},
{img:"りち.png",answer:"りち"},
{img:"こら.png",answer:"こら"},
{img:"せいちえるされむ.png",answer:"せいちえるされむ"},
{img:"ひかえめ.png",answer:"ひかえめ"},
{img:"きね.png",answer:"きね"},
{img:"るろう.png",answer:"るろう"},
{img:"へら.png",answer:"へら"},
{img:"さんそ.png",answer:"さんそ"},
{img:"おとく.png",answer:"おとく"},
{img:"まゆ.png",answer:"まゆ"},
{img:"みに.png",answer:"みに"},
{img:"ほまれ.png",answer:"ほまれ"},
{img:"うそ.png",answer:"うそ"},
{img:"めろん.png",answer:"めろん"},
{img:"なの.png",answer:"なの"}
];

const layout = [
{x:1,y:1,w:3,h:3},
{x:6,y:6,w:3,h:3},
{x:5,y:1,w:2,h:2},
{x:7,y:1,w:2,h:2},
{x:7,y:3,w:2,h:2},
{x:4,y:4,w:2,h:2},
{x:1,y:5,w:2,h:2},
{x:1,y:7,w:2,h:2},
{x:3,y:7,w:2,h:2},
];

let used=Array.from({length:8},()=>Array(8).fill(false));

layout.forEach(a=>{
 for(let dy=0;dy<a.h;dy++){
  for(let dx=0;dx<a.w;dx++){
   used[a.y-1+dy][a.x-1+dx]=true;
  }
 }
});

for(let y=0;y<8;y++){
 for(let x=0;x<8;x++){
  if(!used[y][x]) layout.push({x:x+1,y:y+1,w:1,h:1});
 }
}

const cells=[];
let current=null;

layout.forEach((l,i)=>{

 const d=document.createElement("div");
 d.className="cell";
 d.style.gridColumn=`${l.x}/span ${l.w}`;
 d.style.gridRow=`${l.y}/span ${l.h}`;
 d.style.pointerEvents="auto";

 const im=document.createElement("img");
 im.src=questions[i].img;
 d.appendChild(im);

 d.onclick=()=>{
   if(questions[i].cleared)return;
   current=i;
   qimg.src=questions[i].img;
   input.value="";
   modal.classList.remove("hidden");
 };

 board.appendChild(d);
 cells.push(d);
});

input.addEventListener("keydown",e=>{
 if(e.key==="Enter"){
   if(input.value===questions[current].answer){
     questions[current].cleared=true;
     cells[current].remove();
     modal.classList.add("hidden");
   }
 }
});


modal.addEventListener("click",e=>{
  if(e.target === modal){
    modal.classList.add("hidden");
  }
});

document.addEventListener("keydown",e=>{

  if(e.key==="Tab" && !modal.classList.contains("hidden")){
    e.preventDefault();
    input.focus();
  }

});


answerListBtn.onclick = ()=>{

 let list = questions
   .filter(q=>q.cleared)
   .map((q,i)=>`${i+1}. ${q.answer}`);

 if(list.length===0){
   answerText.textContent = "まだ解答済みの問題はありません";
 }else{
   answerText.textContent = list.join("\n");
 }

 answerModal.classList.remove("hidden");
};

closeAnswerBtn.onclick = ()=>{
  answerModal.classList.add("hidden");
};


/* =====================================================
駒
===================================================== */

const initialPieces = [
["P",0,2],["K",2,1],["Q",2,2],["N",2,3],["R",2,4],["N",2,5],
["P",7,2],["P",5,3],["B",7,3],["B",3,4],["P",4,4],["P",6,4],
["P",0,6],["P",1,6],["P",5,6],["R",1,7]
].map(a=>({type:a[0],x:a[1],y:a[2],moved:false}));

let pieces=JSON.parse(JSON.stringify(initialPieces));
const fixed=[{char:"を",x:7,y:7}];


/* =====================================================
五十音
===================================================== */

const rows = [
["ん","わ","ら","や","ま","は","な","た","さ","か","あ"],
[null,null,"り","■","み","ひ","に","ち","し","き","い"],
[null,null,"る","ゆ","む","ふ","ぬ","つ","す","く","う"],
[null,null,"れ","■","め","へ","ね","て","せ","け","え"],
[null,null,"ろ","よ","も","ほ","の","と","そ","こ","お"]
];

let initialChars=[];

for(let y=0;y<rows.length;y++){
 for(let x=0;x<rows[y].length;x++){

   if(rows[y][x]==null) continue;

   initialChars.push({
     char:rows[y][x],
     tx:x,
     ty:y,
     x:null,
     y:null
   });

 }
}

let chars=JSON.parse(JSON.stringify(initialChars));


/* ===================================================== */

let history=[];
let selectedChar=null;
let dragX=0;
let dragY=0;
let selectedPiece = null;
let legal = [];


/* =====================================================
描画
===================================================== */

function draw(){

 ctx.clearRect(0,0,SIZE,SIZE);
 ctx.fillStyle = "rgba(0,120,255,.25)";
 legal.forEach(a=>{
   ctx.fillRect(
     BX + a.x * CELL,
     BY + a.y * CELL,
     CELL,
     CELL
   );
 });

 ctx.font="28px sans-serif";
 ctx.textBaseline="top";

 /* 駒 */
 pieces.forEach(p=>{
   ctx.fillStyle=p.moved?"gray":"black";
   ctx.fillText(
     p.type,
     BX+p.x*CELL+TXT_DX,
     BY+p.y*CELL+TXT_DY
   );
 });

 /* を */
 fixed.forEach(f=>{
   ctx.fillStyle="black";
   ctx.fillText(
     f.char,
     BX+f.x*CELL+TXT_DX-4,
     BY+f.y*CELL+TXT_DY
   );
 });

 /* tray文字 */
 chars.forEach(c=>{

   if(c===selectedChar) return;

   let px,py;

   if(c.x===null){
     px = TRAY_X + c.tx * TRAY_CELL;
     py = TRAY_Y + c.ty * TRAY_CELL;
   }else{
     px = BX + c.x * CELL;
     py = BY + c.y * CELL;   // ←盤面に完全一致
   }

   if(c.char==="■"){
     ctx.fillStyle="black";
     ctx.fillRect(px,py,TRAY_CELL,TRAY_CELL);
   }else{
     ctx.fillStyle="black";
     ctx.fillText(c.char,px+TRAY_DX,py+TRAY_DY);
   }

 });

 /* ドラッグ中文字 */
 if(selectedChar){

   if(selectedChar.char==="■"){
     ctx.fillStyle="black";
     ctx.fillRect(dragX-28,dragY-28,TRAY_CELL,TRAY_CELL);
   }else{
     ctx.fillStyle="red";
     ctx.fillText(selectedChar.char,dragX-18,dragY-18);
   }
 }

}

draw();


/* =====================================================
座標
===================================================== */

function mouse(e){
 const r=canvas.getBoundingClientRect();
 return {
   mx:e.clientX-r.left,
   my:e.clientY-r.top
 };
}

function inside(x,y){
  return x>=0 && x<8 && y>=0 && y<8;
}

function occupied(x,y){
  /* 最終的に置けないマス判定 */
  return pieces.some(p=>p.x===x && p.y===y)
      || chars.some(c=>c.x===x && c.y===y)
      || fixed.some(f=>f.x===x && f.y===y);
}

/* チェス駒だけを障害物扱い */
function pieceBlock(x,y){
  return pieces.some(p=>p.x===x && p.y===y)
      || fixed.some(f=>f.x===x && f.y===y);
}

function ray(out,x,y,dx,dy){

  x += dx;
  y += dy;

  while(inside(x,y)){

    /* ひらがながあっても通過可能
       ただし着地は不可 */
    if(!occupied(x,y)){
      out.push({x,y});
    }

    /* 駒だけ通過不可 */
    if(pieceBlock(x,y)) break;

    x += dx;
    y += dy;
  }
}

function getLegalMoves(p){

  if(p.moved) return [];

  let out=[];

  if(p.type==="K"){
    for(let dx=-1;dx<=1;dx++){
      for(let dy=-1;dy<=1;dy++){
        if(dx||dy){
          let x=p.x+dx;
          let y=p.y+dy;
          if(inside(x,y)&&!occupied(x,y)) out.push({x,y});
        }
      }
    }
  }

  if(p.type==="N"){
    [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]]
    .forEach(v=>{
      let x=p.x+v[0];
      let y=p.y+v[1];
      if(inside(x,y)&&!occupied(x,y)) out.push({x,y});
    });
  }

  if(p.type==="R" || p.type==="Q"){
    ray(out,p.x,p.y,1,0);
    ray(out,p.x,p.y,-1,0);
    ray(out,p.x,p.y,0,1);
    ray(out,p.x,p.y,0,-1);
  }

  if(p.type==="B" || p.type==="Q"){
    ray(out,p.x,p.y,1,1);
    ray(out,p.x,p.y,-1,1);
    ray(out,p.x,p.y,1,-1);
    ray(out,p.x,p.y,-1,-1);
  }

  if(p.type==="P"){

    let y1 = p.y - 1;

    if(inside(p.x,y1) && !occupied(p.x,y1))
      out.push({x:p.x,y:y1});

    if(p.y===6 && !occupied(p.x,5) && !occupied(p.x,4))
      out.push({x:p.x,y:4});
  }

  return out;
}

function saveState(){

 history.push(JSON.stringify({
   pieces: pieces,
   chars: chars
 }));
}


/* =====================================================
文字ドラッグ
===================================================== */

canvas.addEventListener("mousedown",e=>{

 const {mx,my}=mouse(e);

 const gx=Math.floor((mx-BX)/CELL);
 const gy=Math.floor((my-BY)/CELL);

 /* 駒クリック */
 let p = pieces.find(v=>v.x===gx && v.y===gy);

 if(p){
   selectedPiece = p;
   selectedChar = null;
   legal = getLegalMoves(p);
   draw();
   return;
 }

 /* 駒移動先クリック */
 if(selectedPiece){

   if(legal.some(a=>a.x===gx && a.y===gy)){

     saveState();

     selectedPiece.x = gx;
     selectedPiece.y = gy;
     selectedPiece.moved = true;
   }

   selectedPiece = null;
   legal = [];
   draw();
   return;
 }

 /* 文字ドラッグ */
 for(let c of chars){

   let px,py;

   if(c.x===null){
     px=TRAY_X+c.tx*TRAY_CELL;
     py=TRAY_Y+c.ty*TRAY_CELL;
   }else{
     px=BX+c.x*CELL;
     py=BY+c.y*CELL;
   }

   if(mx>=px&&mx<=px+TRAY_CELL&&my>=py&&my<=py+TRAY_CELL){

     selectedChar=c;
     selectedPiece=null;
     legal=[];

     dragX=mx;
     dragY=my;
     draw();
     return;
   }
 }

});

canvas.addEventListener("mousemove",e=>{

 if(!selectedChar)return;

 const {mx,my}=mouse(e);

 dragX=mx;
 dragY=my;
 draw();

});

canvas.addEventListener("mouseup",e=>{

 if(!selectedChar)return;

 const {mx,my}=mouse(e);

 const x=Math.floor((mx-BX)/CELL);
 const y=Math.floor((my-BY)/CELL);

 if(inside(x,y) && !occupied(x,y)){

   saveState();

   selectedChar.x = x;
   selectedChar.y = y;
 }

 selectedChar=null;
 draw();

});


/* =====================================================
Undo / Reset
===================================================== */

undoBtn.onclick=()=>{

 if(history.length===0)return;

 const s = JSON.parse(history.pop());

 pieces = s.pieces;
 chars = s.chars;

 selectedPiece=null;
 selectedChar=null;
 legal=[];

 draw();

};

resetBtn.onclick=()=>{

 pieces=JSON.parse(JSON.stringify(initialPieces));
 chars=JSON.parse(JSON.stringify(initialChars));

 history=[];
 selectedPiece=null;
 selectedChar=null;
 legal=[];

 draw();

};
