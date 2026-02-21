// ═══ NOTE DEMOS ═══
// Canvas demos for individual note pages.
// Extracted from notes-app.js for standalone use.

import { prefersReducedMotion } from './shared.js';

const DEMOS={
  "spring-ball":{
    height:140,hint:"Drag the ball and release",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let ballX=w/2,ballY=h/2,velX=0,velY=0;
      let targetX=w/2,targetY=h/2;
      let dragging=false,raf,active=false;
      const stiff=0.08,damp=0.78,radius=16;
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.beginPath();ctx.arc(ballX,ballY,radius+4,0,Math.PI*2);
        ctx.fillStyle='rgba(139,126,200,0.08)';ctx.fill();
        const grad=ctx.createRadialGradient(ballX-4,ballY-4,2,ballX,ballY,radius);
        grad.addColorStop(0,'#A699D4');grad.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(ballX,ballY,radius,0,Math.PI*2);
        ctx.fillStyle=grad;ctx.fill();
        ctx.beginPath();ctx.arc(ballX-4,ballY-5,5,0,Math.PI*2);
        ctx.fillStyle='rgba(255,255,255,0.35)';ctx.fill();
      }
      function step(){
        if(!dragging){
          const dx=targetX-ballX,dy=targetY-ballY;
          velX=(velX+dx*stiff)*damp;velY=(velY+dy*stiff)*damp;
          ballX+=velX;ballY+=velY;
          if(Math.abs(dx)<0.5&&Math.abs(dy)<0.5&&Math.abs(velX)<0.5&&Math.abs(velY)<0.5){
            ballX=targetX;ballY=targetY;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      function getPos(e){
        const r=canvas.getBoundingClientRect();
        const t=e.touches?e.touches[0]:e;
        return{x:(t.clientX-r.left)*(w/r.width),y:(t.clientY-r.top)*(h/r.height)};
      }
      canvas.addEventListener('mousedown',e=>{const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+10){dragging=true;start();}});
      canvas.addEventListener('mousemove',e=>{if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}});
      canvas.addEventListener('mouseup',()=>{dragging=false;start();});
      canvas.addEventListener('mouseleave',()=>{dragging=false;start();});
      canvas.addEventListener('touchstart',e=>{e.preventDefault();const p=getPos(e);if(Math.hypot(p.x-ballX,p.y-ballY)<radius+20){dragging=true;start();}},{passive:false});
      canvas.addEventListener('touchmove',e=>{e.preventDefault();if(dragging){const p=getPos(e);ballX=p.x;ballY=p.y;velX=0;velY=0;}},{passive:false});
      canvas.addEventListener('touchend',()=>{dragging=false;start();});
      render();
    }
  },
  "easing-vs-spring":{
    height:120,hint:"Tap anywhere to trigger both",
    init(canvas){
      const ctx=canvas.getContext('2d');
      const w=canvas.width,h=canvas.height;
      let easingX=40,springX=40,springV=0;
      let targetX=40,animating=false,startTime=0;
      let raf,active=false,autoTimer;
      const radius=10,stiff=0.06,damp=0.75;
      function easeOut(t){return 1-Math.pow(1-t,3);}
      function render(){
        ctx.clearRect(0,0,w,h);
        ctx.font='500 9px Geist, sans-serif';
        ctx.fillStyle='rgba(0,0,0,0.2)';
        ctx.fillText('EASE-OUT',8,h/4+3);
        ctx.fillText('SPRING',8,3*h/4+3);
        ctx.strokeStyle='rgba(0,0,0,0.04)';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(40,h/4);ctx.lineTo(w-20,h/4);ctx.stroke();
        ctx.beginPath();ctx.moveTo(40,3*h/4);ctx.lineTo(w-20,3*h/4);ctx.stroke();
        let g1=ctx.createRadialGradient(easingX-2,h/4-2,1,easingX,h/4,radius);
        g1.addColorStop(0,'#B0AAA2');g1.addColorStop(1,'#8A857D');
        ctx.beginPath();ctx.arc(easingX,h/4,radius,0,Math.PI*2);ctx.fillStyle=g1;ctx.fill();
        let g2=ctx.createRadialGradient(springX-2,3*h/4-2,1,springX,3*h/4,radius);
        g2.addColorStop(0,'#A699D4');g2.addColorStop(1,'#7B6CB8');
        ctx.beginPath();ctx.arc(springX,3*h/4,radius,0,Math.PI*2);ctx.fillStyle=g2;ctx.fill();
      }
      function step(){
        if(animating){
          const elapsed=(performance.now()-startTime)/600;
          const t=Math.min(1,elapsed);
          easingX=40+(targetX-40)*easeOut(t);
          if(t>=1)easingX=targetX;
          const dx=targetX-springX;
          springV=(springV+dx*stiff)*damp;springX+=springV;
          if(t>=1&&Math.abs(dx)<0.5&&Math.abs(springV)<0.5){
            springX=targetX;animating=false;render();active=false;return;
          }
        }
        render();raf=requestAnimationFrame(step);
      }
      function start(){if(!active){active=true;raf=requestAnimationFrame(step);}}
      canvas.addEventListener('click',()=>{
        targetX=targetX>w/2?40:w-40;
        easingX=easingX>w/2?easingX:40;
        startTime=performance.now();animating=true;start();
      });
      if(!prefersReducedMotion){
        autoTimer=setTimeout(()=>{targetX=w-40;startTime=performance.now();animating=true;start();},600);
      }
      render();
    }
  }
};

// Initialize any demos found on the page
document.querySelectorAll('.note-demo[data-demo-id]').forEach(wrap=>{
  const id=wrap.dataset.demoId;
  const demo=DEMOS[id];
  if(!demo)return;
  const canvas=wrap.querySelector('canvas');
  if(canvas) requestAnimationFrame(()=>demo.init(canvas));
});
