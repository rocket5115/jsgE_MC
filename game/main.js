var scene = new SceneCreator(((Math.floor(1920/64)*64)+64)*2, ((Math.floor(1080/64)*64)+64)*2, 64);
let background = scene.CreateScene();
document.getElementById('SceneElement'+background).style.backgroundColor = 'transparent';
let sky = scene.CreateObject(0,0,scene.size.x,scene.size.y);
scene.object.DisablePhysics(sky);
scene.object.SetImage(sky, 'sky');
var grid = scene.grid;

var ymax = Math.floor(scene.size.y/scene.size.h);
yrng = [80,50,40,10]

const RandomNumber = (min,max) => {
    return Math.floor((Math.random()*(max-min))+min);
};
var generator = new ChunkGenerator(scene,grid)
generator.PreLoadChunks(6, function(x,y){
    if(y>ymax-1)return false;
    if(y>ymax-2){
        return {image:'bedrock'}
    };
    if(y<ymax&&y>ymax-4){
        if(RandomNumber(0,100)>yrng[(ymax-y)-1]){
            return {image:'bedrock'}
        } else {
            return {image:'stone'}
        };
    };
    console.log(y,ymax-4, ymax-3)
    if(y<=ymax-4&&y>ymax-7){
        let rand = RandomNumber(0,100)
        if(rand>95){
            return {image:'diamondore'}
        } else if(rand>90) {
            return {image:'goldore'}
        } else if(rand>85) {
            return {image:'ironore'}
        } else {
            return {image:'stone'}
        };
    };
    /*else if(y<=ymax-3) {
        if(RandomNumberCheck(98,Math.random()*100)){
            return {image:'diamondore'}
        } else if(RandomNumberCheck(93,Math.random()*100)) {
            return {image:'ironore'}
        } else if(RandomNumberCheck(96,Math.random()*100)) {
            return {image:'goldore'}
        } else {
            return {image:'stone'}
        };
    };*/
    return false;
});

let borders = scene.CreateBorders(10);
let steve = scene.CreateObject(164, 500, 32, 128, true);
var stdoc = document.getElementById(steve);
scene.object.SetImage(steve,'body');
stdoc.classList.add('SteveBody');
stdoc.classList.add('StevePart');
//BodyParts
let head = scene.CreateObject(164, 500, 32, 32);
var stdoc = document.getElementById(head);
stdoc.classList.add('SteveHead');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,head);
let arms = scene.CreateObject(164+8, 532, 16, 48);
var stdoc = document.getElementById(arms);
stdoc.classList.add('SteveArms');
stdoc.classList.add('StevePart');
scene.object.AttachElementToElement(steve,arms);
let legs = scene.CreateObject(164+8, 532+48, 16, 48);
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
    physics.Next(PhysicsObjects);
    setTimeout(PhysicsFunc, 10);
};
setTimeout(PhysicsFunc, 10);

let l = false
let r = false

window.addEventListener('keydown', function(e) {
    if(e.code=='Space'){
        e.preventDefault();
        SceneObjects[background][steve].gravity = -13;
    } else if(e.code=='KeyA') {
        l=true;
    } else if(e.code=='KeyD'){
        r=true;
    };
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
    if(l) {
        mov.MoveLeft(SceneObjects[background][steve], PhysicsObjects, 5);
    };
    if(r) {
        mov.MoveRight(SceneObjects[background][steve], PhysicsObjects, 5);
    };
    if(l){
        if(lastmov!=1){
            lastmov=1;
            document.documentElement.style.setProperty('--head', "url('../images/slh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srll.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slrl.png')");
            document.documentElement.style.setProperty('--roth', '0deg');
        };
        MoveLegs();
    } else if(r) {
        if(lastmov!=2){
            lastmov=2;
            document.documentElement.style.setProperty('--head', "url('../images/srh.png')");
            document.documentElement.style.setProperty('--leg1', "url('../images/srrl.png')");
            document.documentElement.style.setProperty('--leg2', "url('../images/slll.png')");
            document.documentElement.style.setProperty('--roth', '179deg');
        };
        MoveLegs();
    } else {
        MoveLegsNormal();
    };
    setTimeout(Move,10);
};
setTimeout(Move,10);

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