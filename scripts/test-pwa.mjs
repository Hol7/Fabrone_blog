import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const handlers={}; const data=new Map();let online=true;let fetchCount=0;
const origin='https://blog.example';const key=(r)=>new URL(typeof r==='string'?r:r.url,origin).href;
const cache={addAll:async urls=>{for(const u of urls)data.set(key(u),new Response(u==='/offline'?'Hors connexion':'page'));},put:async(r,v)=>data.set(key(r),v),keys:async()=>[...data.keys()].map(url=>({url})),delete:async r=>data.delete(key(r))};
const context={URL,Response,console,caches:{open:async()=>cache,match:async r=>data.get(key(r))?.clone(),keys:async()=>['fabrone-old','other-app'],delete:async k=>{assert.equal(k,'fabrone-old');}},self:{location:{origin},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn},fetch:async()=>{fetchCount++;if(!online)throw Error('offline');return new Response('article en ligne');}};
vm.runInNewContext((await readFile(new URL('sw-template.js', import.meta.url),'utf8')).replace('__VERSION__','test').replace('__PRECACHE__',JSON.stringify(['/','/offline'])),context);
async function lifecycle(name){let promise;handlers[name]({waitUntil:p=>promise=p});await promise;}
await lifecycle('install');await lifecycle('activate');
async function request(path,mode='navigate',method='GET',range=false){let response;handlers.fetch({request:{url:origin+path,mode,method,headers:new Headers(range?{range:'bytes=0-9'}:{})},respondWith:p=>response=p});return response===undefined?undefined:await response;}
assert.equal(await (await request('/articles/bienvenue')).text(),'article en ligne');online=false;
assert.equal(await (await request('/articles/bienvenue')).text(),'article en ligne');
assert.equal(await (await request('/articles/inconnu')).text(),'Hors connexion');
for(const path of ['/keystatic','/keystatic/collection/posts','/api/subscribe','/audio/demo.mp3','/videos/demo.mp4'])assert.equal(await request(path),undefined);
assert.equal(await request('/articles?a=b'),undefined);assert.equal(await request('/api/subscribe','cors','POST'),undefined);assert.equal(await request('/images/demo.png','cors','GET',true),undefined);
console.log('PWA : installation, nettoyage, article hors ligne, repli hors ligne et exclusions vérifiés.');
