/* =====================================================
   ✏️ แก้ข้อความทั้งหมดได้ที่นี่ที่เดียว
   ===================================================== */
const CONFIG = {
  name: "My love",                       // ชื่อเธอ
  from: "จากคนที่รักเธอ 🤍",             // ลงท้ายจดหมาย
  heroSub: "ขอให้วันนี้เป็นวันที่เธอยิ้มได้ทั้งวันเลยนะ",
  cakeWish: "ขอให้ความฝันของเธอเป็นจริงนะ 🎂",
  letter:
`ถึงคนที่น่ารักที่สุดในสามโลก

วันนี้เป็นวันพิเศษของเธอ
ขอให้วันนี้และต่อจากนี้มีแต่ความสุขนะเค้าพูดไม่ค่อยเก่งอะ

ขอบคุณที่เป็นเธอ ขอบคุณที่ยิ้มให้กัน
พูดไม่ค่อยเก่งแต่รักหมดใจ

ขอให้ปีนี้เธอมีความสุขมากๆ สุขภาพแข็งแรง
ได้ทำทุกอย่างที่ฝันไว้ และเจอแต่เรื่องดีๆ

ไม่ว่าเธอจะเจออะไร
เค้าจะอยู่ข้างๆ อ้วนเสมอนะ

รักเธอมากๆ 🤍`,
  photos: [   // รูป 3 ใบ อยู่ในกล่องของขวัญ + คำบรรยาย
    { src: "เจอกัน.jpg", cap: "วันที่เราเจอกัน" },
    { src: "หนัง.jpg", cap: "หนังเรื่องแรก" },
    { src: "สู้.jpg", cap: "สู้ๆคนเก่ง" },
  ],
  coupons: [  // คูปอง (แก้ / เพิ่ม / ลบได้) icon = อีโมจิ
    { icon: "🤗", t: "กอดแน่นๆ 1 ครั้ง", d: "ใช้ได้ทุกเวลา ไม่ต้องจองคิว" },
    { icon: "🎁", t: "ขอได้ 1 ข้อ", d: "ขออะไรก็ได้ ฉันจะพยายามทำให้" },
  ],
  finalMsg: "ขอบคุณที่เป็นรอยยิ้มให้นะ\nรักเธอที่สุดในสามโลก 🤍",
  musicAuto: true                       // เล่นเพลงตอนเปิดซอง (ถ้ามีไฟล์ music/song.mp3)
};

/* ===================================================== */
const $ = s => document.querySelector(s);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ใส่ข้อความ */
$("#herName").textContent = CONFIG.name;
$("#heroSub").textContent = CONFIG.heroSub;
$("#sign").textContent = CONFIG.from;

/* ถ้าไม่มีรูป ให้โชว์ช่อง placeholder */
function watchImg(img){
  const bad = () => img.classList.add("noimg");
  img.addEventListener("error", bad);
  if (img.complete && !img.naturalWidth) bad();
}
document.querySelectorAll("[data-photo]").forEach(watchImg);

/* สร้างกล่องของขวัญ */
CONFIG.photos.forEach((p,i)=>{
  const g = document.createElement("button");
  g.className = "gift reveal";
  g.style.setProperty("--r", ((i%2?2.5:-2.5))+"deg");
  g.setAttribute("aria-label","เปิดกล่องของขวัญที่ "+(i+1));
  g.innerHTML = `<span class="lid"></span><span class="box"></span><span class="tag">แตะเปิดสิ 💗</span>
    <figure class="shot"><div class="frame"><img class="ph-img" src="${p.src}" alt="${p.cap}">
    <span class="ph">📷<br><small>${p.src.split("/").pop()}</small></span></div>
    <figcaption>${p.cap}</figcaption></figure>`;
  g.addEventListener("click", e=>{
    if (g.classList.contains("open")) return;
    g.classList.add("open");
    const r = g.getBoundingClientRect();
    burst(70, r.left+r.width/2, r.top+r.height/2);
  });
  $("#giftBox").appendChild(g);
  watchImg(g.querySelector("img"));
});

/* สร้างคูปอง */
CONFIG.coupons.forEach(c=>{
  const b = document.createElement("button");
  b.className = "coupon reveal";
  b.innerHTML = `<span class="in"><span class="ico">${c.icon}</span>
    <span class="tx"><b>${c.t}</b><small>${c.d}</small></span><span class="stamp">ใช้แล้ว</span></span>`;
  b.addEventListener("click", e=>{
    if (b.classList.contains("used")) return;
    b.classList.add("used");
    burst(50, e.clientX, e.clientY);
  });
  $("#couponBox").appendChild(b);
});

/* หัวใจลอย */
function heart(){
  const h = document.createElement("span");
  h.textContent = ["♥","♡","✿","❀"][Math.random()*4|0];
  h.style.left = Math.random()*100+"vw";
  h.style.fontSize = (12+Math.random()*22)+"px";
  h.style.animationDuration = (7+Math.random()*7)+"s";
  $("#hearts").appendChild(h);
  setTimeout(()=>h.remove(),15000);
}
let heartTimer;

/* Confetti */
const cv = $("#fx"), cx = cv.getContext("2d");
let parts = [], raf = 0;
const colors = ["#ff7fa8","#ffb1c8","#ffd3df","#fff","#e0487c","#ffc94d"];
function resize(){cv.width = innerWidth; cv.height = innerHeight}
addEventListener("resize",resize); resize();
function burst(n=140, x=innerWidth/2, y=innerHeight*.55){
  if (reduce) return;
  for(let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2, v = 4+Math.random()*9;
    parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-6,r:4+Math.random()*6,
      c:colors[Math.random()*colors.length|0],rot:Math.random()*6,vr:(Math.random()-.5)*.3,
      heart:Math.random()<.35,life:0});
  }
  if(!raf) raf = requestAnimationFrame(tick);
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  parts = parts.filter(p=>p.y<cv.height+30 && p.life<260);
  parts.forEach(p=>{
    p.vy += .25; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    cx.save(); cx.translate(p.x,p.y); cx.rotate(p.rot); cx.fillStyle = p.c;
    if(p.heart){cx.font = p.r*3+"px serif"; cx.fillText("♥",0,0)}
    else cx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.6);
    cx.restore();
  });
  raf = parts.length ? requestAnimationFrame(tick) : 0;
  if(!raf) cx.clearRect(0,0,cv.width,cv.height);
}

/* เปิดซองจดหมาย */
const bgm = $("#bgm"), musicBtn = $("#music");
$("#envelope").addEventListener("click", function(){
  if (this.classList.contains("open")) return;
  this.classList.add("open");
  $(".env-tap").style.visibility = "hidden";
  setTimeout(()=>{
    $("#envelope-screen").classList.add("gone");
    $("#site").classList.remove("hidden");
    document.body.style.overflow = "";
    scrollTo(0,0);
    burst(160, innerWidth/2, innerHeight/2);
    heartTimer = setInterval(heart, reduce ? 99999 : 900);
    initReveal();
    if (CONFIG.musicAuto) playMusic();
  }, 1700);
});
document.body.style.overflow = "hidden";

/* เพลง */
function playMusic(){
  bgm.volume = .6;
  bgm.play().then(()=>{musicBtn.classList.remove("hidden");musicBtn.classList.add("on")})
    .catch(()=>{});
  bgm.addEventListener("loadedmetadata",()=>musicBtn.classList.remove("hidden"),{once:true});
}
musicBtn.onclick = () => {
  if (bgm.paused){bgm.play();musicBtn.classList.add("on")}
  else {bgm.pause();musicBtn.classList.remove("on")}
};

/* เป่าเทียน */
$("#cakeBtn").addEventListener("click", function(){
  if (this.classList.contains("out")) return;
  this.classList.add("out");
  burst(200, innerWidth/2, innerHeight*.5);
  $("#cakeMsg").textContent = CONFIG.cakeWish;
});

/* พิมพ์จดหมายทีละตัว */
let typed = false;
function typeLetter(){
  if (typed) return; typed = true;
  const el = $("#typed"), t = [...CONFIG.letter];
  if (reduce){ el.textContent = CONFIG.letter; return; }
  let i = 0;
  (function step(){
    el.textContent += t[i++] ?? "";
    if (i < t.length) setTimeout(step, 45);
  })();
}

/* เลื่อนแล้วค่อยๆ โผล่ */
function initReveal(){
  document.querySelectorAll(".block h2,.lead,.cake,.paper").forEach(e=>e.classList.add("reveal"));
  const io = new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.classList.contains("paper")) typeLetter();
    io.unobserve(e.target);
  }),{threshold:.25});
  document.querySelectorAll(".reveal").forEach(e=>io.observe(e));
}

/* หัวใจดวงสุดท้าย */
let loves = 0;
$("#loveBtn").addEventListener("click", ()=>{
  loves++;
  burst(120, innerWidth/2, innerHeight*.6);
  for(let i=0;i<10;i++) setTimeout(heart,i*80);
  if (loves >= 2){
    $("#loveHint").style.display = "none";
    $("#loveMsg").textContent = CONFIG.finalMsg;
    burst(260, innerWidth/2, innerHeight*.5);
  }
});
