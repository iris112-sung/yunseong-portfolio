import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome'});
const page = await browser.newPage({viewport:{width:1200,height:900},deviceScaleFactor:1});
await fs.mkdir('public/assets/projects',{recursive:true});
const covers = [
  {slug:'run-a-b',name:'Run a B',category:'LLM ENGINEERING',line:'POLICY INTO POSSIBILITY',color:'#bca1ee',ink:'#241631',stack:'PyTorch  /  Transformers  /  LoRA'},
  {slug:'reply',name:'Reply',category:'AI APPLICATION',line:'MEANING, WITHOUT THE NOISE',color:'#ade1ce',ink:'#132d28',stack:'JavaScript  /  Python  /  OpenAI API'},
  {slug:'speaki',name:'Speaki',category:'VOICE AI / IN PROGRESS',line:'VOICE ORDERING, FOR EVERYONE',color:'#e9b3cb',ink:'#361c2c',stack:'Python  /  Whisper  /  HTTP API'}
];
for (const [index,cover] of covers.entries()) {
  await page.setContent('<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/wanteddev/wanted-sans@v1.0.3/packages/wanted-sans/fonts/webfonts/variable/split/WantedSansVariable.min.css"><canvas width="1200" height="900"></canvas><style>body{margin:0}canvas{display:block}</style>',{waitUntil:'networkidle'});
  await page.evaluate(()=>Promise.all([document.fonts.load('800 170px "Wanted Sans Variable"'),document.fonts.load('500 22px "Wanted Sans Variable"')]));
  await page.evaluate(({cover,index})=>{
    const c=document.querySelector('canvas').getContext('2d');
    c.fillStyle=cover.color;c.fillRect(0,0,1200,900);
    c.strokeStyle=cover.ink;c.globalAlpha=.12;c.lineWidth=1;
    for(let x=0;x<1200;x+=60){c.beginPath();c.moveTo(x,0);c.lineTo(x,900);c.stroke();}
    for(let y=0;y<900;y+=60){c.beginPath();c.moveTo(0,y);c.lineTo(1200,y);c.stroke();}
    c.globalAlpha=1;c.fillStyle=cover.ink;
    c.font='500 21px "Wanted Sans Variable"';c.fillText(cover.category,64,80);
    c.textAlign='right';c.fillText(`0${index+1} / SELECTED WORK`,1136,80);
    c.textAlign='left';c.font='800 170px "Wanted Sans Variable"';c.fillText(cover.name,58,460);
    c.font='500 28px "Wanted Sans Variable"';c.fillText(cover.line,64,532);
    c.lineWidth=2;c.beginPath();c.moveTo(64,737);c.lineTo(1136,737);c.stroke();
    c.font='500 22px "Wanted Sans Variable"';c.fillText(cover.stack,64,803);
    c.textAlign='right';c.font='800 26px "Wanted Sans Variable"';c.fillText('YB',1136,803);
  },{cover,index});
  await page.screenshot({path:`public/assets/projects/${cover.slug}.png`});
}
await browser.close();
