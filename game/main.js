var scene = new SceneCreator((Math.floor(1920/64)*64), (Math.floor(1080/64)*64), 64);
let background = scene.CreateScene();
document.getElementById('SceneElement'+background).style.backgroundColor = 'transparent';
var grid = scene.grid;
var generator = new WorldGenerator(scene,grid);
generator.CreateBottomLayer({
    layers: 3,
    chance: [100, 50, 10, 20, 0]
});
let borders = scene.CreateBorders(10);
let steve = scene.CreateObject(164, 64, 64, 64, true);
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
    for(let id in grid.GetClosestObjects){
        PhysicsObjects[id]=true;
    };
    let x=Math.floor((SceneObjects[background][steve].walls[2].x1+32)/64)
    let y=Math.floor(SceneObjects[background][steve].walls[2].y1/64)-1
    grid.SetReferencePoint(x,y);
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

var mov = new Movement(background);

const Move = () => {
    if(l) {
        mov.MoveLeft(SceneObjects[background][steve], PhysicsObjects, 5)
    };
    if(r) {
        mov.MoveRight(SceneObjects[background][steve], PhysicsObjects, 5)
    };
    setTimeout(Move,10);
};
setTimeout(Move,10);

const GF = () =>{
    if(SceneObjects[background][steve].gravity<9){
        SceneObjects[background][steve].gravity++;
    };
    setTimeout(GF,20)
};
setTimeout(GF,20)

scene.object.FocusOnElement(steve)