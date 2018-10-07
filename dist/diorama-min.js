function Manifest(){this.start_scene=void 0,this.size={x:128,y:128},this.background="white",this.scale=1,this.frame_rate=60,this.assets=[],this.scenes=[],this.maps=[],this.fonts=[],this.boxes=[],this.dom_element=document.body,this.set={container:t=>{this.dom_element=document.getElementById(t)},startScreen:t=>{this.start_scene=t},background:t=>{this.background=t},scale:t=>{this.scale=t},size:(t,i)=>{this.size={x:t,y:i}},frameRate:t=>{this.frame_rate=t}},this.add={image:(t,i)=>{this.assets.push({type:"img",name:t,path:i})},audio:(t,i)=>{this.assets.push({type:"audio",name:t,path:i})},map:(t,i)=>{this.assets.push({type:"map",name:t,path:i})},scene:t=>{this.scenes.push(t)}},this.create={font:(t,i,s,e)=>{this.fonts.push({name:t,image:i,size:{x:s,y:e}})},box:(t,i,s)=>{this.boxes.push({name:t,image:i,resolution:s})}}}function createManifest(){return new Manifest}class Box{constructor(t,i){this.world=t,this.ctx=t.ctx,this.c_ctx=t.c_ctx,this.box_data=i,this.resolution=i.resolution,this.image=t.assets.image[i.image].image}display(t,i,s,e,h){s=Math.max(2*this.resolution,s),e=Math.max(2*this.resolution,e),this.ctx.fillStyle=h||this.world.background_color,this.ctx.fillRect(t+1,i+1,s-2,e-2),this.ctx.lineWidth=2;for(let h=0;h<4;h++){let o=t+Math.floor(h%2)*(s-this.resolution),a=i+Math.floor(h/2)*(e-this.resolution),n=Math.floor(h%2)*(2*this.resolution),r=Math.floor(h/2)*(2*this.resolution);this.ctx.drawImage(this.image,n,r,this.resolution,this.resolution,o,a,this.resolution,this.resolution)}let o=3*this.resolution;this.ctx.drawImage(this.image,8,0,this.resolution,this.resolution,t+8,i,this.resolution+s-o,this.resolution),this.ctx.drawImage(this.image,8,16,this.resolution,this.resolution,t+8,i+e-this.resolution,this.resolution+s-o,this.resolution),this.ctx.drawImage(this.image,0,8,this.resolution,this.resolution,t,i+8,this.resolution,this.resolution+e-o),this.ctx.drawImage(this.image,16,8,this.resolution,this.resolution,t+s-this.resolution,i+this.resolution,this.resolution,this.resolution+e-o)}}let Util={timeStamp:function(){return window.performance.now()},between:function(t,i,s){return(t-i)*(t-s)<0},random:function(t,i){return t+Math.random()*(i-t)},randomInt:function(t,i){return Math.round(this.random(t,i))},map:function(t,i,s,e,h){return(t-i)/(s-i)*(h-e)+e},lerp:function(t,i,s){return t+(i-t)*s},clamp:function(t,i,s){return Math.max(i,Math.min(s,t))},array2D:function(t,i){for(var s=[],e=0;e<t.length;e+=i)s.push(t.slice(e,e+i));return s}},Tween={linear:function(t,i,s,e){return s*t/e+i},easeInOutQuad:function(t,i,s,e){return(t/=e/2)<1?s/2*t*t+i:-s/2*(--t*(t-2)-1)+i},easeInOutExpo:function(t,i,s,e){return(t/=e/2)<1?s/2*Math.pow(2,10*(t-1))+i:(t--,s/2*(2-Math.pow(2,-10*t))+i)}};class Scene{constructor(t){this.name=t,this.loop=!0,this.init_once=!1}giveWorld(t){this.world=t,this.ctx=t.ctx,this.camera=new Camera(this,0,0)}keyDown(t){}keyUp(t){}init(){}render(){}}class Vector{constructor(t,i){this.x=t||0,this.y=i||0}set(t,i){this.x=t,this.y=i}add(t){this.x+=t.x,this.y+=t.y}sub(t){this.x-=t.x,this.y-=t.y}mult(t){this.x*=t,this.y*=t}div(t){this.x/=t,this.y/=t}dot(t){return t.x*this.x+t.y*this.y}limit(t){this.mag()>t&&this.setMag(t)}mag(){return Math.hypot(this.x,this.y)}setMag(t){this.mag()>0?this.normalize():(this.x=1,this.y=0),this.mult(t)}normalize(){let t=this.mag();t>0&&(this.x/=t,this.y/=t)}heading(){return Math.atan2(this.x,this.y)}setHeading(t){let i=this.mag();this.x=Math.cos(t)*i,this.y=Math.sin(t)*i}dist(t){return new Vector(this.x-t.x,this.y-t.y).mag()}angleBetween(t){return Math.atan2(t.y-this.y,t.x-this.x)}copy(){return new Vector(this.x,this.y)}fromAngle(t){let i=Math.cos(t),s=Math.sin(t);return new Vector(i,s)}}class Entity{constructor(t,i,s){this.scene=t,this.world=t.world,this.ctx=this.world.ctx,this.body=new Body(this,i,s)}setSprite(t){this.sprite=new Sprite(this,t)}display(){void 0!==this.sprite&&!0!==this.world.debug||(this.ctx.lineWidth=1,this.ctx.strokeStyle="#000",this.ctx.strokeRect(this.body.position.x-.5,this.body.position.y-.5,this.body.size.x,this.body.size.y)),void 0!==this.sprite&&this.sprite.display(this.body.position.x,this.body.position.y)}}class Sprite{constructor(t,i){this.entity=t,this.world=this.entity.world,this.tile_size=this.world.tile_size,this.ctx=this.world.ctx,this.image=this.world.assets.image[i.image].image,this.size=i.size,this.current_frame=0,this.animations={},this.current_animation=void 0,this.width=this.image.width/this.size.x,this.height=this.image.height/this.size.y,this.tick=0,this.speed=.2,this.offset={x:0,y:0},this.setOffset(.5,.5),this.addAnimation("none",[0])}setOffset(t,i){this.offset.x=t,this.offset.y=i}addAnimation(t,i){this.animations[t]=i,this.current_animation=t}setState(t){this.current_animation=t}animate(t){this.setState(t),this.tick<1?this.tick+=this.speed:(this.tick=0,this.current_frame<this.animations[t].length-1?this.current_frame+=1:this.current_frame=0)}display(t,i){this.ctx.drawImage(this.image,Math.floor(this.animations[this.current_animation][this.current_frame]%this.width)*this.size.x,Math.floor(this.animations[this.current_animation][this.current_frame]/this.width)*this.size.y,this.size.x,this.size.y,t-this.size.x/2+this.offset.x*this.entity.body.size.x,i-this.size.y/2+this.offset.y*this.entity.body.size.y,this.size.x,this.size.y)}}class Body{constructor(t,i,s){this.world=t.world,this.step=this.world.FPS.step,this.position=new Vector(i,s),this.next_position=new Vector(i,s),this.velocity=new Vector(0,0),this.stepped_velocity=new Vector(0,0),this.acceleration=new Vector(0,0),this.drag=.1,this.bounciness=.2,this.size={x:this.world.tile_size,y:this.world.tile_size},this.half={x:this.size.x/2,y:this.size.y/2},this.collision={left:!1,top:!1,right:!1,bottom:!1}}setSize(t,i){this.size.x=t,this.size.y=i,this.half={x:this.size.x/2,y:this.size.y/2}}setBounciness(t){this.bounciness=t}setDrag(t){this.drag=t}updateVelocity(){let t=this.velocity.copy();t.mult(-1),t.setMag(this.velocity.mag()*this.drag),this.addForce(t),this.velocity.add(this.acceleration),this.stepped_velocity=this.velocity.copy(),this.stepped_velocity.mult(this.step),this.next_position=this.position.copy(),this.next_position.add(this.stepped_velocity),this.acceleration.mult(0)}updatePosition(){this.position.add(this.stepped_velocity)}integration(){this.updateVelocity(),this.updatePosition()}addForce(t){this.acceleration.add(t)}getTileCollisionData(t,i,s){let e={x:Math.floor(i/this.world.tile_size),y:Math.floor(s/this.world.tile_size)},h=this.world.getTileProperties(this.world.getTile(t,e.x,e.y));if(void 0!==h&&!0===h.collision){let i=[{x:e.x-1,y:e.y},{x:e.x+1,y:e.y},{x:e.x,y:e.y-1},{x:e.x,y:e.y+1}].map(i=>{let s=this.world.getTileProperties(this.world.getTile(t,i.x,i.y));return void 0!==s&&!0===s.collision});return{position:e,neighbors:i}}return!1}mapCollision(t){let i=this.world.checkLayerId(t),s=this.position.x+this.stepped_velocity.x,e=this.position.y+this.stepped_velocity.y,h=this.getTileCollisionData(i,s,e),o=this.getTileCollisionData(i,s+this.size.x,e),a=this.getTileCollisionData(i,s,e+this.size.y),n=this.getTileCollisionData(i,s+this.size.x,e+this.size.y);this.collision.left=!1,this.collision.top=!1,this.collision.right=!1,this.collision.bottom=!1,h&&this.AABB(h),o&&this.AABB(o),a&&this.AABB(a),n&&this.AABB(n)}AABB(t){t.position.x*=this.world.tile_size,t.position.y*=this.world.tile_size;let i=this.world.tile_size/2,s=Math.abs(this.position.x+this.half.x-(t.position.x+i)),e=Math.abs(this.position.y+this.half.y-(t.position.y+i)),h=s-this.half.x-i,o=e-this.half.y-i;if(h<0||o<0){if(h===o&&(o=-1),h<0&&h>o)if(this.position.x>t.position.x){if(t.neighbors[1])return!1;this.position.x-=h,this.velocity.x*=-this.bounciness,this.collision.left=!0}else{if(t.neighbors[0])return!1;this.position.x+=h,this.velocity.x*=-this.bounciness,this.collision.right=!0}if(o<0&&o>h)if(this.position.y>t.position.y){if(t.neighbors[3])return!1;this.position.y-=o,this.velocity.y*=-this.bounciness,this.collision.top=!0}else{if(t.neighbors[2])return!1;this.position.y+=o,this.velocity.y*=-this.bounciness,this.collision.bottom=!0}}}}class Camera extends Entity{constructor(t,i,s){super(t,i,s),this.target={position:new Vector(this.world.W/2,this.world.H/2),size:{x:0,y:0}},this.boundless=!0,this.bounds={x:this.world.W,y:this.world.H},this.angle=0}setBounds(t,i){this.boundless=!1,this.bounds.x=t-this.world.W,this.bounds.y=i-this.world.H}setTarget(t){this.target=t,this.target={position:t.body.position,size:null==t.sprite?t.body.size:t.sprite.size}}checkBounds(){if(this.boundless)return!1;this.body.position.x<0&&(this.body.position.x=0),this.body.position.y<0&&(this.body.position.y=0),this.body.position.x>this.bounds.x&&(this.body.position.x=this.bounds.x),this.body.position.y>this.bounds.y&&(this.body.position.y=this.bounds.y)}update(){this.body.position.x=this.target.position.x+this.target.size.x/2-this.world.W/2,this.body.position.y=this.target.position.y+this.target.size.x/2-this.world.H/2,this.checkBounds(),this.world.ctx.translate(this.world.W/2,this.world.H/2),this.world.ctx.rotate(this.angle),this.world.ctx.translate(-this.body.position.x-this.world.W/2,-this.body.position.y-this.world.H/2)}}class Diorama{constructor(t){if(!t)throw"A manifest is needed";this.parameters=t,this.debug=!1,this.background_color=this.parameters.background||"#000",this.initCanvas(this.parameters),this.counter=0,this.toLoad=this.parameters.assets.length,this.assets={image:{},audio:{}},this.limit_input=!1,this.keys={},this.scenes={},this.start_screen=this.parameters.start_screen||void 0,this.current_scene="",this.currentFont=void 0,this.alphabet="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ?!:',.()<>[]",this.fonts={},this.tile_size=16,this.maps={},this.boxes={},this.FPS={now:0,delta:0,last:Util.timeStamp(),step:1/(this.parameters.frame_rate||60)},this.requestChange={value:!1,action:""},this.main_loop=void 0,this.full=!1,this.audio_muted=!1,this.loadAssets(this.parameters.assets)}initCanvas(){this.canvas=document.createElement("canvas"),this.ctx=this.canvas.getContext("2d"),this.W=this.canvas.width=this.parameters.size.x||256,this.H=this.canvas.height=this.parameters.size.y||256,this.scale=this.parameters.scale||1,this.full=!1,this.ctx.imageSmoothingEnabled=!1,this.canvas.classList.add("crisp"),this.parameters.dom_element.appendChild(this.canvas),this.applyScale()}loader(){this.clear("#222"),this.counter+=1;let t=this.W-40,i=this.H-40;this.ctx.fillStyle="#111",this.ctx.fillRect(20,i,t,20),this.ctx.fillStyle="#333",this.ctx.fillRect(20,i,this.counter*t/this.toLoad,20),this.ctx.strokeStyle="#000",this.ctx.lineWidth=4,this.ctx.strokeRect(20,i,t,20),this.counter===this.toLoad&&this.launch()}loadAssets(t){0===t.length&&this.launch(),t.map(t=>this.checkAssets(t))}checkAssets(t){let i=t;switch(t.type){case"img":let s=new Image;s.onload=(()=>{this.loader()}),s.onerror=(()=>{console.log("can't load Image: "+t.name)}),s.src=t.path,i.image=s,this.assets.image[t.name]=i;break;case"audio":let e=new Audio(t.path);e.addEventListener("canplaythrough",this.loader()),e.onerror=(()=>{console.log("can't load audio: "+t.name)}),i.audio=e,this.assets.audio[t.name]=i;break;case"map":fetch(t.path).then(i=>{200===i.status?i.json().then(i=>{this.maps[t.name]=i,this.loader()}):console.log("Looks like there was a problem. Status Code: "+i.status)}).catch(function(i){console.log("can't load map: "+t.name)});break;case void 0:console.log(t.name," doesn't have any type");break;default:console.log(t.name," has a none known type")}}launch(){this.parameters.scenes.forEach(t=>{this.addScene(t)}),this.eventSetup(),this.initBoxes(this.parameters.boxes),this.initFonts(this.parameters.fonts),this.startScene(this.start_screen)}initBoxes(t){if(void 0===t)return!1;t.map(t=>{this.boxes[t.name]=new Box(this,t)})}drawBox(t,i,s,e,h,o){this.boxes[t].display(i,s,e,h,o)}setFont(t){this.currentFont=t}initFonts(t){if(void 0===t&&t.length>0)return!1;t.map(t=>{if(void 0===this.assets.image[t.image])return console.log("can't load font, "+t.image+" doesn't exist"),!1;t.image=this.assets.image[t.image].image,this.fonts[t.name]=t}),this.currentFont=Object.keys(this.fonts)[0]}write(t,i,s,e,h){if(void 0===this.currentFont)return console.log("No bitmap_font"),!1;if("string"==typeof e){switch(e){case"center":i-=t.length*this.fonts[this.currentFont].size.x/2;break;case"right":i-=t.length*this.fonts[this.currentFont].size.x}this.writeLine(t,i,s,h||0)}else this.writeParagraph(t,i,s,e,h||0)}writeParagraph(t,i,s,e,h){let o=0,a=this.fonts[this.currentFont].size.y+5,n=this.fonts[this.currentFont].size.x,r=t.split(" "),l="";for(let t=0;t<r.length;t++){l+=r[t]+" ";let c=0,d=r[t+1],u=l.length*n;d&&(c=d.length*n),u+c>e?(this.writeLine(l,i,s+o,h),o+=a,l=""):this.writeLine(l,i,s+o,h)}}writeLine(t,i,s,e){let h=this.fonts[this.currentFont].size.x,o=this.fonts[this.currentFont].size.y,a=this.fonts[this.currentFont].image;for(let n=0;n<t.length;n++){let r=h*this.alphabet.indexOf(t.charAt(n)),l=i+n*h;this.ctx.drawImage(a,r,e*o,h,o,l,s,h,o)}}eventSetup(){document.addEventListener("keydown",t=>this.keyDown(t),!1),document.addEventListener("keyup",t=>this.keyUp(t),!1)}keyDown(t){this.limit_input&&t.preventDefault(),this.keys[t.key.toLowerCase()]=!0,this.current_scene.keyDown(t)}keyUp(t){this.keys[t.key.toLowerCase()]=!1,this.current_scene.keyDown(t)}startScene(t){return 0==Object.keys(this.scenes).length?(console.warn("Sorry, Your project doesn't have any scenes"),!1):(null==t&&(t=Object.keys(this.scenes)[0]),void 0===this.scenes[t]?(console.warn("Sorry, the scene named '"+t+"' doesn't exist"),!1):void 0!==this.main_loop?(this.requestChange.value=!0,this.requestChange.action=t,!1):(this.requestChange.value=!1,this.requestChange.action="",this.FPS.last=Util.timeStamp(),this.current_scene=this.scenes[t],this.initScene(),void(!0===this.current_scene.loop?this.gameLoop():this.mainRender())))}initScene(){if(this.current_scene.init_once)return!1;this.current_scene.init()}addScene(t){t.giveWorld(this),this.scenes[t.name]=t}mainRender(){this.clear(),this.ctx.save(),this.current_scene.camera.update(),this.current_scene.render(),this.ctx.restore()}loopCheck(){!1===this.requestChange.value?this.main_loop=requestAnimationFrame(()=>this.gameLoop()):(cancelAnimationFrame(this.main_loop),this.main_loop=void 0,this.startScene(this.requestChange.action))}gameLoop(){for(this.FPS.now=Util.timeStamp(),this.FPS.delta+=Math.min(1,(this.FPS.now-this.FPS.last)/1e3);this.FPS.delta>this.FPS.step;)this.FPS.delta-=this.FPS.step,this.mainRender();this.FPS.last=this.FPS.now,this.loopCheck()}soundLevel(t){for(let[i,s]of Object.entries(this.assets.audio))s.audio.volume=t}mute(){this.audio_muted=!this.audio_muted;for(let[t,i]of Object.entries(this.assets.audio))i.audio.muted=this.audio_muted}clear(t){this.ctx.fillStyle=t||this.background_color,this.ctx.fillRect(0,0,this.W,this.H)}applyScale(){this.canvas.style.maxWidth=this.W*this.scale+"px",this.canvas.style.maxHeight=this.H*this.scale+"px",this.canvas.style.width="100%",this.canvas.style.height="100%"}fullScreen(){this.full=!this.full,this.full?(this.canvas.style.maxWidth="",this.canvas.style.maxHeight="",this.canvas.style.width="",this.canvas.style.height="",this.canvas.style.width="100%",this.canvas.style.height="100%"):this.applyScale()}checkLayerId(t){let i=t;return"string"==typeof t&&this.terrain.layers.forEach((s,e)=>{if(s.name===t)return i=e}),i}getTile(t,i,s){let e=this.terrain.layers[this.checkLayerId(t)];return!(i<0||i>e.width-1)&&(!(s<0||s>e.height-1)&&e.data[s][i])}getTileProperties(t){return this.terrain.tileset.tileproperties[t]}findTile(t,i){let s=this.terrain.layers[this.checkLayerId(t)],e=[];for(let t=0;t<s.width;t++)for(let h=0;h<s.height;h++){s.data[t][h]===i&&e.push({x:h,y:t})}return e}initMap(t){this.terrain=JSON.parse(JSON.stringify(this.maps[t])),this.terrain.layers.forEach(t=>{let i=t.data.map(t=>t-1);t.data=Util.array2D(i,t.width)}),this.terrain.tileset=this.terrain.tilesets[0],this.terrain.tileset.image=this.assets.image[this.terrain.tilesets[0].name].image,this.terrain.layers.forEach(t=>{this.terrainCache(t)})}terrainCache(t){t.cache={};let i=t.cache.c=document.createElement("canvas"),s=t.cache.ctx=t.cache.c.getContext("2d");i.width=t.width*this.tile_size,i.height=t.height*this.tile_size,this.drawLayer(s,t)}bitMask(t,i,s){let e=t.data[s][i],h=s-1,o=s+1,a=i-1,n=i+1,r=[0,0,0,0];return h>-1&&e===t.data[h][i]&&(r[0]=1),a>-1&&e===t.data[s][a]&&(r[1]=1),n<t.width&&e===t.data[s][n]&&(r[2]=1),o<t.height&&e===t.data[o][i]&&(r[3]=1),e=1*r[0]+2*r[1]+4*r[2]+8*r[3]}marchingSquare(t,i,s){let e=0,h=0,o=0,a=0;return s+1<t.height&&i+1<t.width&&(1===t.data[s][i]&&(e=1),1===t.data[s][i+1]&&(h=1),1===t.data[s+1][i+1]&&(o=1),1===t.data[s+1][i]&&(a=1)),8*e+4*h+2*o+a}drawMap(){this.terrain.layers.forEach(t=>{let i=this.current_scene.camera.body.position.x,s=this.current_scene.camera.body.position.y;this.ctx.drawImage(t.cache.c,i,s,this.W,this.H,i,s,this.W,this.H)})}drawLayer(t,i){for(let s=0;s<i.height;s++)for(let e=0;e<i.width;e++){let h=i.data[s][e],o=e*this.tile_size,a=s*this.tile_size,n=Math.floor(h%this.terrain.tileset.imagewidth)*this.tile_size,r=Math.floor(h/this.terrain.tileset.imagewidth)*this.tile_size;if(this.terrain.tileset.tileproperties[h]&&"bitmask"===this.terrain.tileset.tileproperties[h].look){let t=this.bitMask(i,e,s);n=Math.floor(t)*this.tile_size,r=this.terrain.tileset.tileproperties[h].line*this.tile_size}else if(i.properties&&"square"===i.properties.type){let t=this.marchingSquare(i,e,s);if(1!==h&&15===t)continue;o+=this.tile_size/2,a+=this.tile_size/2,n=16*t,r=i.properties.line*this.tile_size}else if(h<0)continue;t.drawImage(this.terrain.tileset.image,n,r,this.tile_size,this.tile_size,o,a,this.tile_size,this.tile_size)}}}