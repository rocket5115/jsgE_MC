var scene = new SceneCreator(((Math.floor(1920/64)*64)+64)*4, ((Math.floor(1080/64)*64)+64)*2, 64);
let background = scene.CreateScene();
document.getElementById('SceneElement'+background).style.backgroundColor = 'transparent';
let sky = scene.CreateObject(0,0,scene.size.x,scene.size.y);
var bac = document.getElementById(sky);
scene.object.DisablePhysics(sky);
scene.object.SetImage(sky, 'sky');

var ymax = Math.floor(scene.size.y/scene.size.h);
yrng = [80,50,40,10]

const RandomNumber = (min,max) => {
    return Math.floor((Math.random()*(max-min))+min);
};

const PreLoad = [];

var generator = new ChunkGenerator(scene)
generator.PreLoadChunks(6, function(x,y){
    if(!PreLoad[y])PreLoad[y]=[];
    if(y>ymax-1)return false;
    if(y>ymax-2){
        return {image:'bedrock',await:true}
    };
    if(y<ymax&&y>ymax-4){
        if(RandomNumber(0,100)>yrng[(ymax-y)-1]){
            return {image:'bedrock',await:true}
        } else {
            if(RandomNumber(0,200)<15){
                return {image:'diamondore',await:true}
            };
            return {image:'stone',await:true}
        };
    };
    if(y<=ymax-4&&y>ymax-7){
        if(RandomNumber(0,200)<2){
            return {image:'diamondore',await:true}
        } else if(RandomNumber(0,200)<5) {
            return {image:'goldore',await:true}
        } else if (RandomNumber(0,200)<7) {
            return {image:'redstoneore',await:true}
        } else if(RandomNumber(0,200)<10) {
            return {image:'ironore',await:true}
        } else {
            return {image:'stone',await:true}
        };
    };
    if(y<ymax-5&&y>ymax-20) {
        //Ore Chunk
        if(RandomNumber(0,100)<2&&PreLoad[y+1]) {
            for(let i=0;i<3;i++){
                PreLoad[y][x+i]={image:'ironore',await:true};
                if(i==1){
                    PreLoad[y+1][x+i]={image:'ironore',await:true};
                };
                PreLoad[y][x+i]
            };
        };
        if(PreLoad[y][x]!=undefined){
            return PreLoad[y][x];
        }
        if(RandomNumber(0,200)<10){
            if(RandomNumber(0,200)<5) {
                return {image:'goldore',await:true};
            } else if(RandomNumber(0,200)<10) {
                return {image:'ironore',await:true};
            } else {
                return {image:'stone',await:true};
            };
        } else {
            return {image:'stone',await:true};
        };
    };
    return false;
});

delete(PreLoad);

let loadedChunks = false;
let lastLoaded = false;

const ChunkDeloader = (safe) => {
    if(lastLoaded){
        if(safe){
            for(let i=lastLoaded.y.min;i<=lastLoaded.y.max;i++) {
                if(i>=safe.y.min&&i<=safe.y.max)continue;
                for(let j=lastLoaded.x.min;j<=lastLoaded.x.max;j++) {
                    if(j>=safe.x.min&&j<=safe.x.max)continue;
                    generator.UnloadChunk(j,i);
                };
            };
        } else {
            for(let i=lastLoaded.y.min;i<=lastLoaded.y.max;i++) {
                for(let j=lastLoaded.x.min;j<=lastLoaded.x.max;j++) {
                    generator.UnloadChunk(j,i);
                };
            };
        }
    };
};

const ChunkLoader = () => {
    let x=Math.floor(((SceneObjects[background][steve].walls[3].x1+16)/64)/6);
    let y=Math.floor(((SceneObjects[background][steve].walls[3].y1+16)/64)/6);
    if(!loadedChunks) {
        loadedChunks = {y:{min:y-5>=0?y-5:0,max:y+5},x:{min:x-8>=0?x-8:0,max:x+8}}
        for(let i=y-5>0?y-5:0;i<=y+5;i++){
            for(let j=x-8>0?x-8:0;j<=x+8;j++){
                generator.LoadNextChunk(j,i);
            };
        };
    } else {
        if((y-3>=0?y-3:0)<loadedChunks.y.min||y+3>loadedChunks.y.max) {
            lastLoaded = loadedChunks;
            ChunkDeloader({x:{min:x-3>=0?x-3:0,max:x+3},y:{min:y-3>=0?y-3:0,max:y+3}});
            loadedChunks = undefined;
            return;
        };
        if((x-5>0?x-5:0)<loadedChunks.x.min) {
            lastLoaded = loadedChunks;
            ChunkDeloader({x:{min:x-3>=0?x-3:0,max:x+3},y:{min:y-3>=0?y-3:0,max:y+3}});
            loadedChunks = undefined;
            return;
        };
        if(x+5>loadedChunks.x.max) {
            lastLoaded = loadedChunks;
            ChunkDeloader({x:{min:x-4>=0?x-4:0,max:x+4},y:{min:y-3>=0?y-3:0,max:y+3}});
            loadedChunks = undefined;
            return;
        };
    };
};

setInterval(ChunkLoader,200);

let borders = scene.CreateBorders(48);
for(let key in borders) {
    document.getElementById(borders[key]).style.backgroundColor = 'transparent';
};

let ltstv = 500

let steve = scene.CreateObject(ltstv, 500, 32, 128, true);
var stdoc = document.getElementById(steve);
scene.object.SetImage(steve,'body');
stdoc.classList.add('SteveBody');
stdoc.classList.add('StevePart');
//BodyParts
let head = scene.CreateObject(ltstv, 500, 32, 32);
var stdoc = document.getElementById(head);
stdoc.classList.add('SteveHead');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,head);
let arms = scene.CreateObject(ltstv+8, 532, 16, 48);
var stdoc = document.getElementById(arms);
stdoc.classList.add('SteveArms');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,arms);
let legs = scene.CreateObject(ltstv+8, 532+48, 16, 48);
var stdoc = document.getElementById(legs);
stdoc.classList.add('SteveLegs');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,legs);
delete(stdoc);
var PhysicsObjects = [];
PhysicsObjects[borders[0]]=true;
PhysicsObjects[borders[1]]=true;
PhysicsObjects[borders[2]]=true;
PhysicsObjects[borders[3]]=true;
PhysicsObjects[steve]=true;

var objId = "";

const ClosestObjects = () => {
    PhysicsObjects = {}
    PhysicsObjects[borders[0]]=true;
    PhysicsObjects[borders[1]]=true;
    PhysicsObjects[borders[2]]=true;
    PhysicsObjects[borders[3]]=true;
    PhysicsObjects[steve]=true;
    for(let id in generator.GetClosestObjects){
        PhysicsObjects[id]=true;
    };
    generator.SetReferencePoint(SceneObjects[background][steve].walls[2].x1+16,SceneObjects[background][steve].walls[2].y1+16);
    setTimeout(ClosestObjects, 50);
};
setTimeout(ClosestObjects, 50);

var physics = new Physics(background);
const PhysicsFunc = () => {
    physics.Next(PhysicsObjects,objId);
    setTimeout(PhysicsFunc, 10);
};
setTimeout(PhysicsFunc, 10);

let l = false
let r = false

let lastinv = 0;

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
        if(lastinv<8) {
            lastinv++;
        } else {
            lastinv=0;
        };
    } else {
        if(lastinv>0) {
            lastinv--;
        } else {
            lastinv=8;
        };
    };
    inventory.MoveTo(lastinv);
});

window.addEventListener('keyup', e => {
    if(e.code=='KeyA')l=false;
    if(e.code=='KeyD')r=false;
});

const Positions = [{min:-45,max:45},{min:-45,max:45}];
let finished = false;

const MoveLegs = () => {
    //let rot = Number(getComputedStyle(document.documentElement).getPropertyValue('--slr1').replace('deg', ''));
    let rot = Number(getComputedStyle(document.documentElement).getPropertyValue('--rot1').replace('deg',''));
    if(rot-5>=Positions[0].min&&!finished){
        document.documentElement.style.setProperty('--rot1', rot-5+'deg');
        document.documentElement.style.setProperty('--rot2', -rot+5+'deg');
        if(rot-5<=Positions[0].min){
            finished=true;
        };
    } else {
        document.documentElement.style.setProperty('--rot1', rot+5+'deg');
        document.documentElement.style.setProperty('--rot2', -rot-5+'deg');
        if(rot+5>=Positions[0].max){
            finished=false;
        };
    };
};

const MoveLegsNormal = () => {
    document.documentElement.style.setProperty('--rot1', '0deg');
    document.documentElement.style.setProperty('--rot2', '0deg');
};

var mov = new Movement(background);
let lastmov = 1;
let lm = 1;

const angle = (cx, cy, ex, ey) => {
    return Math.atan2(ey-cy,ex-cx)*180/Math.PI;
}

const sh = document.getElementById(head);

document.addEventListener('mousemove', (e)=>{
    let op = sh.getBoundingClientRect();
    let x = (op.left + sh.clientWidth / 2);
    let y = (op.top + sh.clientHeight / 2);
    let rect = angle(e.clientX, e.clientY, x, y)
    if(lastmov==1||lm==1){
        if(rect<40&&rect>-20){
            document.documentElement.style.setProperty('--roth', rect+'deg');
        };
    } else if (lastmov==2||lm==2) {
        if(rect<-170||(rect<180&&rect>150)){
            document.documentElement.style.setProperty('--roth', rect+'deg');
        };
    }
});

const Move = () => {
    if(l) {
        mov.MoveLeft(SceneObjects[background][steve], PhysicsObjects, 5);
    };
    if(r) {
        mov.MoveRight(SceneObjects[background][steve], PhysicsObjects, 5);
    };
    if(l&&!r){
        if(lastmov!=1){
            lastmov=1;
            document.documentElement.style.setProperty('--head', "url('../images/slh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srll.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slrl.png')");
            document.documentElement.style.setProperty('--roth', '0deg');
        };
        MoveLegs();
    } else if(r&&!l) {
        if(lastmov!=2){
            lastmov=2;
            document.documentElement.style.setProperty('--head', "url('../images/srh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srrl.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slll.png')");
            document.documentElement.style.setProperty('--roth', '179deg');
        };
        MoveLegs();
    } else if(lastmov!=3) {
        MoveLegsNormal();
        lm=lastmov;
        lastmov=3;
    };
    setTimeout(Move,10);
};
setTimeout(Move,10);

setTimeout(()=>{
    const GF = () =>{
        if(SceneObjects[background][steve].gravity<9){
            SceneObjects[background][steve].gravity++;
        };
    };
    setInterval(GF,20)
},0)

scene.object.FocusOnElement(steve);

var inventory = new Inventory(scene);
inventory.PreparePersonalInventory();

window.addEventListener('keydown', function(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            let init = SceneObjects[background][steve].walls[3].y1
            setTimeout(()=>{
                if(init==SceneObjects[background][steve].walls[3].y1){
                    SceneObjects[background][steve].gravity = -13;
                };
            },20);
            break;
        case 'KeyA':
            l=true;
            break;
        case 'KeyD':
            r=true;
            break;
        case 'Digit1':
            inventory.MoveTo(0);
            break;
        case 'Digit2':
            inventory.MoveTo(1);
            break;
        case 'Digit3':
            inventory.MoveTo(2);
            break;
        case 'Digit4':
            inventory.MoveTo(3);
            break;
        case 'Digit5':
            inventory.MoveTo(4);
            break;
        case 'Digit6':
            inventory.MoveTo(5);
            break;
        case 'Digit7':
            inventory.MoveTo(6);
            break;
        case 'Digit8':
            inventory.MoveTo(7);
            break;
        case 'Digit9':
            inventory.MoveTo(8);
            break;
    };
});

$('body').bind('contextmenu', function(e) {
    let rect = bac.getBoundingClientRect();
    let x = Math.floor((e.clientX-rect.left)/scene.size.h);
    let y = Math.floor((e.clientY-rect.top)/scene.size.h)-1;
    let space = inventory.GetSelectedSpace;
    let item = inventory.GetSelectedItem;
    if(generator.IsPositionFree(x,y)&&item&&item.num>0){
        let obj = scene.CreateObject(x*64,(y+1)*64,64,64);
        scene.object.SetImage(obj,item.item);
        inventory.RemoveItemFromSpace(space,1);
        generator.AddObjectOnPosition(obj,x,y);
        objId=obj;
    };
    return false;
});

const unbreakable = {bedrock:true};

$('body').bind('click', function(e) {
    let rect = bac.getBoundingClientRect();
    let x = Math.floor((e.clientX-rect.left)/scene.size.h);
    let y = Math.floor((e.clientY-rect.top)/scene.size.h)-1;
    if(!generator.IsPositionFree(x,y)&&!unbreakable[scene.object.GetImage(generator.GetObjectOnPosition(x,y))]){
        let obj = generator.GetObjectOnPosition(x,y);
        inventory.AddItemToNextSpace(scene.object.GetImage(obj),1);
        generator.RemoveObjectOnPosition(obj,x,y);
    };
    return false;
})