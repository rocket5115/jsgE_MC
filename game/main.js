var scene = new SceneCreator(((Math.floor(1920/64)*64)+64)*4, ((Math.floor(1080/64)*64)+64)*4, 64);
let background = scene.CreateScene();
document.getElementById('SceneElement'+background).style.backgroundColor = 'transparent';
let sky = scene.CreateObject(0,0,scene.size.x,scene.size.y);
scene.object.DisablePhysics(sky);
scene.object.SetImage(sky, 'sky');

var ymax = Math.floor(scene.size.y/scene.size.h)-2;
yrng = [80,50,40,10]

const RandomNumber = (min,max) => {
    return Math.floor((Math.random()*(max-min))+min);
};
var generator = new WorldGenerator(new ChunkGenerator(scene));
const YFuncArgument = (rng,res) => {
    if(rng<=0)return res.failure;
    if(RandomNumber(0,200)<rng) {
        return res.success;
    } else {
        return res.failure||'stone';
    };
};
const ConstYFunc = (chance,start) => {
    let startchance = start||200;
    return function() {
        let rng=YFuncArgument((startchance-(startchance-chance))-3,{success:'ironore',failure:'stone'});
        if(rng=='stone')rng=YFuncArgument((startchance-(startchance-chance))-6,{success:'goldore',failure:'stone'});
        if(rng=='stone')rng=YFuncArgument((startchance-(startchance-chance)),{success:'coalore',failure:'stone'});
        return {image:rng,await:true};
    };
};
const DivideChunksIntoBioms = (chunks) => { //Divide Chunks int bioms for Creating World
    chunks[0]='lowland';
    chunks[chunks.length-1]='lowland';
};

generator.CreateWorld({
    bottom: {y:ymax,ymax:ymax,image:'bedrock',await:true},
    phase: [
        ()=>{return {image:YFuncArgument(150,{success:'bedrock',failure:'stone'}),await:true}},
        ()=>{return {image:YFuncArgument(80,{success:'bedrock',failure:'stone'}),await:true}},
        ()=>{return {
            image:function(){
                let stn=YFuncArgument(40,{success:'bedrock',failure:'stone'});
                if(stn=='bedrock')return stn;
                let rng=YFuncArgument(7,{success:'diamondore',failure:'stone'});
                if(rng=='stone')rng=YFuncArgument(8,{success:'goldore',failure:'stone'});
                if(rng=='stone')rng=YFuncArgument(15,{success:'ironore',failure:'stone'});
                return rng;
            }(),
            await:true}
        },
        ()=>{return {
            image:function(){
                let stn = YFuncArgument(10,{success:'diamondore',failure:'stone'});
                if(stn=='diamonore')return stn;
                let rng=YFuncArgument(11,{success:'ironore',failure:'stone'});
                if(rng=='stone')rng=YFuncArgument(6,{success:'goldore',failure:'stone'});
                return rng;
            }(),
            await:true}
        },
        ()=>{return {
            image:function(){
                let stn = YFuncArgument(6,{success:'diamondore',failure:'stone'});
                if(stn=='diamonore')return stn;
                let rng=YFuncArgument(5,{success:'ironore',failure:'stone'});
                if(rng=='stone')rng=YFuncArgument(3,{success:'goldore',failure:'stone'});
                return rng;
            }(),
            await:true}
        },
        ()=>{return {
            image:function(){
                let stn = YFuncArgument(2,{success:'diamondore',failure:'stone'});
                if(stn=='diamonore')return stn;
                let rng=YFuncArgument(2,{success:'ironore',failure:'stone'});
                return rng;
            }(),
            await:true}
        },
        ConstYFunc(10),
        ConstYFunc(3),
        ConstYFunc(0),
        ConstYFunc(2),
        ConstYFunc(1),
        ConstYFunc(4),
        ConstYFunc(8),
        ConstYFunc(0),
        ConstYFunc(5),
        ConstYFunc(2),
        ConstYFunc(3),
        ConstYFunc(6),
        ConstYFunc(8),
    ]
});

generator=generator.generator;
/*generator.PreLoadChunks(6, function(x,y){
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
        } else if(RandomNumber(0,200)<10) {
            return {image:'ironore',await:true}
        } else {
            return {image:'stone',await:true}
        };
    };
    if(y<ymax-5&&y>ymax-20) {
        return {image:'stone',await:true}
    };
    return false;
});*/

let borders = scene.CreateBorders(10);
let steve = scene.CreateObject(scene.size.x/2, 500, 32, 128, true);
var stdoc = document.getElementById(steve);
scene.object.SetImage(steve,'body');
stdoc.classList.add('SteveBody');
stdoc.classList.add('StevePart');
//BodyParts
let head = scene.CreateObject(scene.size.x/2, 500, 32, 32);
var stdoc = document.getElementById(head);
stdoc.classList.add('SteveHead');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,head);
let arms = scene.CreateObject(scene.size.x/2+8, 532, 16, 48);
var stdoc = document.getElementById(arms);
stdoc.classList.add('SteveArms');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,arms);
let legs = scene.CreateObject(scene.size.x/2+8, 532+48, 16, 48);
var stdoc = document.getElementById(legs);
stdoc.classList.add('SteveLegs');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,legs);

const GenChunks = [];

setInterval(()=>{
    let x=Math.floor(((SceneObjects[background][steve].walls[3].x1+16)/64)/6);
    let y=Math.floor(((SceneObjects[background][steve].walls[3].y1+16)/64)/6);
    generator.LoadNextChunk(x,y);
    generator.LoadNextChunk(x,y-1);
    generator.LoadNextChunk(x,y+1);
    generator.LoadNextChunk(x,y-2);
    generator.LoadNextChunk(x,y+2);

    generator.LoadNextChunk(x-1,y);
    generator.LoadNextChunk(x-1,y-1);
    generator.LoadNextChunk(x-1,y+1);
    generator.LoadNextChunk(x-1,y-2);
    generator.LoadNextChunk(x-1,y+2);

    generator.LoadNextChunk(x+1,y);
    generator.LoadNextChunk(x+1,y-1);
    generator.LoadNextChunk(x+1,y+1);
    generator.LoadNextChunk(x+1,y-2);
    generator.LoadNextChunk(x+1,y+2);

    generator.LoadNextChunk(x-2,y);
    generator.LoadNextChunk(x-2,y-1);
    generator.LoadNextChunk(x-2,y+1);
    generator.LoadNextChunk(x-2,y-2);
    generator.LoadNextChunk(x-2,y+2);

    generator.LoadNextChunk(x+2,y);
    generator.LoadNextChunk(x+2,y-1);
    generator.LoadNextChunk(x+2,y+1);
    generator.LoadNextChunk(x+2,y-2);
    generator.LoadNextChunk(x+2,y+2);

    generator.LoadNextChunk(x-3,y);
    generator.LoadNextChunk(x-3,y+1);
    generator.LoadNextChunk(x-3,y-1);
    generator.LoadNextChunk(x-3,y+2);
    generator.LoadNextChunk(x-3,y-2);

    generator.LoadNextChunk(x+3,y);
    generator.LoadNextChunk(x+3,y+1);
    generator.LoadNextChunk(x+3,y-1);
    generator.LoadNextChunk(x+3,y+2);
    generator.LoadNextChunk(x+3,y-2);

    generator.UnloadChunk(x-4,y);
    generator.UnloadChunk(x-4,y+1);
    generator.UnloadChunk(x-4,y-1);
    generator.UnloadChunk(x-4,y+2);
    generator.UnloadChunk(x-4,y-2);
    generator.UnloadChunk(x+4,y);
    generator.UnloadChunk(x+4,y+1);
    generator.UnloadChunk(x+4,y-1);
    generator.UnloadChunk(x+4,y+2);
    generator.UnloadChunk(x+4,y-2);
},50);
delete(stdoc);
var PhysicsObjects = [];
PhysicsObjects[borders[0]]=true;
PhysicsObjects[borders[1]]=true;
PhysicsObjects[borders[2]]=true;
PhysicsObjects[borders[3]]=true;
PhysicsObjects[steve]=true;

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
    //setTimeout(ClosestObjects, 50);
};
setInterval(ClosestObjects, 50);

var physics = new Physics(background);
const PhysicsFunc = () => {
    physics.Next(PhysicsObjects);
    //setTimeout(PhysicsFunc, 10);
};
setInterval(PhysicsFunc, 10);

let l = false;
let r = false;
let s = false;

window.addEventListener('keydown', function(e) {
    if(e.code=='Space'&&!s){
        e.preventDefault();
        s=true;
        let init = SceneObjects[background][steve].walls[3].y1
        setTimeout(()=>{
            if(init==SceneObjects[background][steve].walls[3].y1){
                SceneObjects[background][steve].gravity = -13;
            };
        },20);
    } else if(e.code=='KeyA') {
        l=true;
    } else if(e.code=='KeyD'){
        r=true;
    };
});

window.addEventListener('keyup', e => {
    if(e.code=='KeyA')l=false;
    if(e.code=='KeyD')r=false;
    if(e.code=='Space')s=false;
});

const Positions = [{min:-45,max:45},{min:-45,max:45}];
let finished = false;

const MoveLegs = () => {
    let rot = Number(getComputedStyle(document.documentElement).getPropertyValue('--rot1').replace('deg',''));
    if(rot-3>=Positions[0].min&&!finished){
        document.documentElement.style.setProperty('--rot1', rot-3+'deg');
        document.documentElement.style.setProperty('--rot2', -rot+3+'deg');
        if(rot-3<=Positions[0].min){
            finished=true;
        };
    } else {
        document.documentElement.style.setProperty('--rot1', rot+3+'deg');
        document.documentElement.style.setProperty('--rot2', -rot-3+'deg');
        if(rot+3>=Positions[0].max){
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

const angle = (cx, cy, ex, ey) => {
    return Math.atan2(ey-cy,ex-cx)*180/Math.PI;
}

const sh = document.getElementById(head);

document.addEventListener('mousemove', (e)=>{
    let op = sh.getBoundingClientRect();
    let x = (op.left + sh.clientWidth / 2);
    let y = (op.top + sh.clientHeight / 2);
    let rect = angle(e.clientX, e.clientY, x, y)
    if(lastmov==1){
        if(rect<40&&rect>-20){
            document.documentElement.style.setProperty('--roth', rect+'deg');
        };
    } else if (lastmov==2) {
        if(rect<-170||(rect<180&&rect>150)){
            document.documentElement.style.setProperty('--roth', rect+'deg');
        };
    }
});

const Move = () => {
    if(l&&!r) {
        mov.MoveLeft(SceneObjects[background][steve], PhysicsObjects, 4);
    };
    if(r&&!l) {
        mov.MoveRight(SceneObjects[background][steve], PhysicsObjects, 4);
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
        lastmov=3
        MoveLegsNormal();
    };
    //setTimeout(Move,10);
};
setInterval(Move,10);

const GF = () =>{
    if(SceneObjects[background][steve].gravity<9){
        SceneObjects[background][steve].gravity++;
    };
};
setInterval(GF,20)

scene.object.FocusOnElement(steve);

$('body').bind('contextmenu', function(e) {
    return false;
});