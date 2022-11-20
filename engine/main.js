const Scenes = {};
const SceneObjects = {}; // Used as physics reference

class SceneCreator {
    constructor(x,y,h) {
        this.x = x||1920;
        this.y = y||1080;
        this.id = Math.floor((this.x/this.y)*Math.random()*10);
        this.lgrid;
        if(h){
            this.lgrid = new Grid(x,y,h);
        };
        this.lobj = new MiscObject(this.id);
    };
    get grid() {
        return this.lgrid;
    };
    get object() {
        return this.lobj;
    };
    get size() {
        return {x:this.x,y:this.y};
    };
    get GetId() {
        return this.id;
    };
    CreateScene() {
        $("#ScenesContainer").append(`<container id="SceneElement${this.id}" class="Scene" style="position:absolute;width:${this.x}px;height:${this.y}px;max-width:${this.x}px;max-height:${this.y}px"></container>`);
        SceneObjects[this.id]={};
        return this.id;
    };
    CreateObject(x,y,w,h,s) {
        let objid = "SE"+(Math.random()*5).toFixed(10);
        $("#SceneElement"+this.id).append(`<div id="${objid}" style="position:absolute;width:${w}px;height:${h}px;left:${x}px;top:${y}px"></div>`);
        SceneObjects[this.id][objid]={
            id: objid,
            walls: [
                {x1:x,x2:x+w,y1:y,y2:y},
                {x1:x+w,x2:x+w,y1:y,y2:y+h},
                {x1:x,x2:x+w,y1:y+h,y2:y+h},
                {x1:x,x2:x,y1:y,y2:y+h}
            ],
            collisions: [],
            collided: [],
            attached: [],
            disabled: false,
            static: s!=undefined?s:false,
            gravity: 9
        };
        return objid;
    };
    CreateBorders(p1,p2,p3,p4) {
        let objs = [1,1,1,1]
        if(typeof(p1)==='number'){
            p1=p1>0?p1:1;
            objs[0]=p1;objs[1]=p1;objs[2]=p1;objs[3]=p1;
        };
        if(typeof(p2)==='number'){
            p2=p2>0?p2:1;
            objs[1]=p2;objs[3]=p2;
        };
        if(typeof(p3)==='number'){
            p3=p3>0?p3:1;
            objs[2]=p3;
        };
        if(typeof(p4)==='number'){
            p4=p4>0?p4:1;
            objs[3]=p4;
        };
        p1 = this.CreateObject(0,0,this.x,objs[0]);
        p2 = this.CreateObject(this.x-objs[1],0,objs[1],this.y);
        p3 = this.CreateObject(0,this.y,this.x,objs[2]);
        p4 = this.CreateObject(0,0,objs[3],this.y);
        return [p1,p2,p3,p4];
    };
};

// 0 - north, 1 - east, 2 - south, 3 - west || góra, prawo, dół, lewo

const GetDirections = (pw,cw) => {
    let right = (pw[1].x1<=cw[3].x1);
    let left = (pw[3].x1>=cw[1].x1);
    let down = (pw[0].y1>=cw[2].y1);
    let top = (pw[2].y1<=cw[0].y1);
    return {left:left,right:right,top:top,down:down,inside:left&&right,between:!left&&!right,ldif:(left&&pw[3].x1-cw[1].x1)||0,rdif:(right&&cw[3].x1-pw[1].x1)||0,tdif:(top&&cw[0].y1-pw[2].y1)||0,ddif:(down&&pw[0].y1-cw[2].y1)};
};

class Physics {
    constructor(id) {
        this.id = id;
    };
    Next(obj) {
        let statics = [];
        let dynamics = [];
        for(let id in obj) {
            if(SceneObjects[this.id][id].static===true){dynamics[dynamics.length]=SceneObjects[this.id][id];continue;};
            statics[statics.length]=SceneObjects[this.id][id];continue;
        };
        dynamics.forEach(obj=>{
            let tdif = 100;
            if(obj.gravity>0){
                for(let i=0;i<statics.length;i++){
                    let dist = GetDirections(obj.walls, statics[i].walls);
                    if(dist.top&&dist.between){
                        let dif=(dist.tdif-obj.gravity>0);
                        if(dif) {
                            if(tdif>obj.gravity){
                                tdif=obj.gravity;
                            };
                        } else {
                            if(tdif>dist.tdif){
                                tdif=dist.tdif;
                            };
                        };
                    };
                };
                if(tdif==100)tdif=0;
                let doc = document.getElementById(obj.id);
                doc.style.top = Number(doc.style.top.replace('px', ''))+tdif+'px';
                for(let i=0;i<4;i++) {
                    obj.walls[i].y1=obj.walls[i].y1+tdif;
                    obj.walls[i].y2=obj.walls[i].y2+tdif;
                };
                if(obj.attached.length>0){
                    obj.attached.forEach(obj=>{
                        let doc = document.getElementById(obj.id);
                        doc.style.left=Number(doc.style.left.replace('px',''))+tdif+'px';
                        for(let j=0;j<4;j++) {
                            obj.walls[i].y1=obj.walls[i].y1+tdif;
                            obj.walls[i].y2=obj.walls[i].y2+tdif;
                        };
                    });
                };
            } else if(obj.gravity<0) {
                for(let i=0;i<statics.length;i++){
                    let dist = GetDirections(obj.walls, statics[i].walls);
                    if(dist.down&&dist.between){
                        let dif=(dist.ddif+obj.gravity>=0);
                        if(dif) {
                            tdif=obj.gravity;
                        } else {
                            tdif=-dist.ddif;
                        };
                    };
                };
                if(tdif==100)tdif=0;
                let doc = document.getElementById(obj.id);
                doc.style.top = Number(doc.style.top.replace('px', ''))+tdif+'px';
                for(let i=0;i<4;i++) {
                    obj.walls[i].y1=obj.walls[i].y1+tdif;
                    obj.walls[i].y2=obj.walls[i].y2+tdif;
                };
                if(obj.attached.length>0){
                    obj.attached.forEach(obj=>{
                        let doc = document.getElementById(obj.id);
                        doc.style.left=Number(doc.style.left.replace('px',''))+tdif+'px';
                        for(let j=0;j<4;j++) {
                            obj.walls[i].y1=obj.walls[i].y1+tdif;
                            obj.walls[i].y2=obj.walls[i].y2+tdif;
                        };
                    });
                };
            };
        });
    };
};

class Movement {
    constructor(id) {
        this.id = id;
    };
    MoveLeft(obj,objs,num) {
        let statics = [];
        for(let id in objs) {
            statics[statics.length]=SceneObjects[this.id][id];
        };
        let tdif = 100;
        for(let i=0;i<statics.length;i++) {
            let dist = GetDirections(obj.walls, statics[i].walls);
            if(dist.left&&!dist.right&&!dist.top&&!dist.down){
                let dif=(dist.ldif-num>0);
                if(dif){
                    if(tdif>num){
                        tdif=num;
                    };
                } else {
                    tdif=dist.ldif;
                };
            };
        };
        if(tdif==100)tdif=0;
        if(tdif>num)tdif=num;
        let doc = document.getElementById(obj.id);
        doc.style.left = Number(doc.style.left.replace('px', ''))-tdif+'px';
        for(let i=0;i<4;i++) {
            obj.walls[i].x1=obj.walls[i].x1-tdif;
            obj.walls[i].x2=obj.walls[i].x2-tdif;
        };
    };
    MoveRight(obj,objs,num) {
        let statics = [];
        for(let id in objs) {
            statics[statics.length]=SceneObjects[this.id][id];
        };
        let tdif = 100;
        for(let i=0;i<statics.length;i++) {
            let dist = GetDirections(obj.walls, statics[i].walls);
            if(dist.right&&!dist.left&&!dist.top&&!dist.down){
                let dif=(dist.rdif-num>0);
                if(dif){
                    if(tdif>num){
                        tdif=num;
                    };
                } else {
                    tdif=dist.rdif;
                };
            };
        };
        if(tdif==100)tdif=0;
        if(tdif>num)tdif=num;
        let doc = document.getElementById(obj.id);
        doc.style.left = Number(doc.style.left.replace('px', ''))+tdif+'px';
        for(let i=0;i<4;i++) {
            obj.walls[i].x1=obj.walls[i].x1+tdif;
            obj.walls[i].x2=obj.walls[i].x2+tdif;
        };
    };
};

class Grid {
    constructor(x,y,h) {
        this.x = Math.floor(x/h);
        this.y = Math.floor(y/h)-1;
        this.h = h;
        this.grid = [];
        for(let i=0;i<this.y;i++) {
            this.grid[i]=[];
        };
        this.grid.forEach(y=>{
            for(let i=0;i<this.x;i++) {
                y[i]=false;
            };
        });
        this.chunk = {x1:0,x2:3,y1:0,y2:3};
    };
    IsFree(x,y) {
        return this.grid[y][x];
    };
    IsAdjacent(x,y) {
        return ((this.grid[y-1]!=undefined&&this.grid[y-1][x]!=false)||(this.grid[y+1]!=undefined&&this.grid[y+1][x]!=false)||(this.grid[y][x-1]!=undefined&&this.grid[y][x-1]!=false)||(this.grid[y][x+1]!=undefined&&this.grid[y][x+1]!=false));
    };
    GetObjectOnGrid(x,y) {
        return this.grid[y][x];
    };
    SetObjectOnGrid(x,y,o) {
        this.grid[y][x]=o;
        return true;
    };
    get GetClosestObjects() {
        let objs = {};
        let i=0;
        this.grid.forEach(grid=>{
            if(i<this.chunk.y1||i>this.chunk.y2){i++;return;};
            for(let j=this.chunk.x1;j<this.chunk.x2;j++){
                if(grid[j]!=false)objs[grid[j]]=true;
            };
        });
        return objs;
    };
    SetReferencePoint(x,y) {
        this.chunk={x1:x,x2:x+3<=this.x?x+3:this.x,y1:y,y2:y+3<=this.y?y+3:this.y};
    };
};

const FocusOn = [];

class MiscObject {
    constructor(id) {
        this.id = id;
    };
    SetImage(id,url) {
        if(!SceneObjects[this.id][id])return;
        let doc = document.getElementById(id);
        doc.style.backgroundImage='url("'+url+'")';
        console.log(url)
        return true;
    };
    GetImage(id) {
        if(!SceneObjects[this.id][id])return;
        let doc = document.getElementById(id);
        return(doc.style.backgroundImage.replace('url("../','').replace('.png")',''));
    };
    FocusOnElement(obj) {
        FocusOn[0]=document.getElementById(obj);
        return true;
    };
    ClearFocus() {
        FocusOn[0]=undefined;
        return true;
    };
};

const FocusOnElement = () =>{
    if(FocusOn[0]!=undefined){
        let elementRect=FocusOn[0].getBoundingClientRect();
        window.scrollTo((elementRect.left + window.pageXOffset) - (1920/2), (elementRect.top + window.pageYOffset) - (1080 / 2));
    };
    setTimeout(FocusOnElement,15);
};
setTimeout(FocusOnElement,15);

const RandomNumberCheck = (num1,num2) => {
    if(num1==100)return false;
    if(num1==0)return true;
    if(num2<num1)return true;
    return true;
};

class WorldGenerator {
    constructor(map,grid) {
        this.map = map;
        this.grid = grid;
        this.id = map.GetId;
        this.x = map.size.x;
        this.y = map.size.y;
    };
    CreateBottomLayer(metadata) {
        metadata=metadata||{};
        let num = metadata.layers||3;
        let material = metadata.material||'./images/bedrock.png';
        let filler = metadata.filler||'./images/stone.png';
        let chance = metadata.chance||[];
        let yrepeat = Math.floor(this.y/64)-1;
        let y=[];
        let ychance=[];
        for(let i=0;i<num;i++){
            y[i]=yrepeat;yrepeat--;
            if(chance.length==0){
                ychance[i]=100;
            } else {
                ychance[i]=chance[i]||chance[chance.length-1];
            };
            this.lasty++;
        };
        let x=Math.floor(this.x/64);
        y.forEach((y,k)=>{
            for(let i=0;i<x;i++){
                let rand = Math.random()*100;
                let obj = this.map.CreateObject(i*64,y*64,64,64);
                if(RandomNumberCheck(ychance[k],rand)){
                    this.map.object.SetImage(obj, material, false);
                } else {
                    this.map.object.SetImage(obj, filler, false);
                };
                this.grid.SetObjectOnGrid(i,y-1,obj);
            };
        });
        return true;
    };
};