const GeneratedChunks = [];
const GeneratedChunksImages = [];

class ChunkGenerator {
    constructor(scene) {
        this.map = scene;
        this.xchunks = [];
        this.ychunks = [];
        this.chunks = [];
        this.loadedchunks=[];
        this.p=this.map.size.h;
        this.range=3;
        this.reference={x1:0,x2:0+this.range,y1:0,y2:0+this.range};
    };
    get scene() {
        return this.map;
    };
    DivChunks(x,p,y,func) {
        let fl = Math.floor(x/p);
        if(x/p!=fl) {
            for(let i=0;i<fl;i++){
                if(i!=fl-1){
                    this.xchunks[i]={s:i*p,e:(i*p)+p-1}
                } else {
                    this.xchunks[i]={s:i*p,e:x-1};
                };
            };
        } else {
            for(let i=0;i<fl;i++){
                this.xchunks[i]={s:i*p,e:(i*p)+p-1}
            };
        };
        fl = Math.floor(y/p);
        if(y/p!=fl) {
            for(let i=0;i<fl;i++){
                if(i!=fl-1){
                    this.ychunks[i]={s:i*p,e:(i*p)+p-1}
                } else {
                    this.ychunks[i]={s:i*p,e:y-1};
                };
            };
        } else {
            for(let i=0;i<fl;i++){
                this.ychunks[i]={s:i*p,e:(i*p)+p-1}
            };
        };
        this.ychunks.forEach((chunk,k) => {
            this.chunks[k]={s:chunk.s,e:chunk.e};
            for(let i=chunk.s;i<=chunk.e;i++){
                GeneratedChunks[i]=[];
                GeneratedChunksImages[i]=[];
                this.loadedchunks[i]=[];
            };
            for(let i=0;i<this.xchunks.length;i++){
                this.chunks[k][i]=this.xchunks[i];
                GeneratedChunks.forEach((gen,key)=>{
                    for(let j=this.xchunks[i].s;j<=this.xchunks[i].e;j++){
                        gen[j]=false;
                        GeneratedChunksImages[key][j]=false;
                        this.loadedchunks[key][j]=false;
                    };
                });
            };
        });
        func=func||function(){return true};
        this.Generator(func);
    };
    PreLoadChunks(s,func) {
        this.DivChunks(this.map.size.x/this.map.size.h,s||6,this.map.size.y/this.map.size.h,func);        
    };
    Generator(func) {
        for(let i=this.chunks.length-1;i>=0;i--){
            let y=this.chunks[i].s
            let loop = function(y,chunk,map,p) {
                for(let key in chunk){
                    if(typeof(Number(key))!='number')return;
                    let arr=chunk[key];
                    for(let j=arr.s;j<=arr.e;j++){
                        let f=func(j,y)
                        if(f){
                            if(f.await!=undefined&&f.await){
                                GeneratedChunks[y-1][j]={image:f.image||'bedrock'};
                                GeneratedChunksImages[y-1][j]={image:f.image||'bedrock'};
                            } else {
                                GeneratedChunks[y-1][j]=map.CreateObject(j*p,y*p,p,p);
                                map.object.SetImage(GeneratedChunks[y-1][j],f.image||'bedrock');
                                GeneratedChunksImages[y-1][j]={image:f.image||'bedrock'};
                            };
                        };
                    };
                };
            };
            while(y!=this.chunks[i].e+2){
                loop(y,this.chunks[i],this.map,this.p);
                y++;
            };
        };
    };
    SetReferencePoint(x,y) {
        x=Math.floor(x/this.p);
        y=Math.floor(y/this.p);
        this.reference={x1:x-this.range>-1?x-this.range:0,x2:x+this.range<GeneratedChunks[0].length?x+this.range:GeneratedChunks[0].length-1,y1:y-this.range>-1?y-this.range:0,y2:y+this.range<GeneratedChunks.length?y+this.range:GeneratedChunks.length-1};
    };
    get GetClosestObjects() {
        let retval = [];
        let i=0;
        GeneratedChunks.forEach((grid,k)=>{
            if(i<this.reference.y1||i>this.reference.y2){i++;return;};
            for(let j=this.reference.x1;j<=this.reference.x2;j++){
                if(grid[j]!=false&&typeof(grid[j])=='string'){retval[grid[j]]=true;};
            };
            i++;
        });
        return retval;
    };
    LoadNextChunk(x,y) {
        if(!this.chunks[y]){
            if(!this.chunks[y-1]){
                y++;
            } else {
                y--;
            };
        };
        if(!this.chunks[y]||!this.chunks[y][x]||this.loadedchunks[y][x]){
            return;
        };
        this.loadedchunks[y][x]=true;
        for(let yx=this.chunks[y].s;yx<=this.chunks[y].e;yx++){
            for(let i=this.chunks[y][x].s;i<=this.chunks[y][x].e;i++){
                if(GeneratedChunks[yx][i].image){
                    GeneratedChunks[yx][i]=this.map.CreateObject(i*this.p,(yx+1)*this.p,this.p,this.p);
                    this.map.object.SetImage(GeneratedChunks[yx][i],GeneratedChunksImages[yx][i].image);
                };
            };
        };
    };
    UnloadChunk(x,y) {
        if(!this.chunks[y]){
            if(!this.chunks[y-1]){
                return;
            } else {
                y--;
            };
        };
        if(!this.chunks[y][x]||!this.loadedchunks[y][x]){
            return;
        };
        this.loadedchunks[y][x]=false;
        for(let yx=this.chunks[y].s;yx<=this.chunks[y].e;yx++){
            for(let i=this.chunks[y][x].s;i<=this.chunks[y][x].e;i++){
                if(typeof(GeneratedChunks[yx][i])=='string'&&GeneratedChunks[yx][i]){
                    this.map.DeleteObject(GeneratedChunks[yx][i]);
                    GeneratedChunks[yx][i]={image:GeneratedChunksImages[yx][i]};
                };
            };
        };
    };
    AddObjectOnPosition(id,x,y) {
        GeneratedChunks[y][x]=id;
        GeneratedChunksImages[y][x]=this.map.object.GetImage(id);
    };
    RemoveObjectOnPosition(id,x,y) {
        GeneratedChunks[y][x]=undefined;
        GeneratedChunksImages[y][x]=undefined;
        this.map.DeleteObject(id);
    };
    IsPositionFree(x,y) {
        return (GeneratedChunks[y][x]==false||GeneratedChunks[y][x]==undefined);
    };
    GetObjectOnPosition(x,y) {
        return GeneratedChunks[y][x];
    };
};