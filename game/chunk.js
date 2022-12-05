const GeneratedChunks = [];

class ChunkGenerator {
    constructor(scene,grid) {
        this.map = scene;
        this.grid = grid;
        this.xchunks = [];
        this.ychunks = [];
        this.chunks = [];
        this.p=this.map.size.h;
        this.range=3;
        this.reference={x1:0,x2:0+this.range,y1:0,y2:0+this.range};
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
            };
            for(let i=0;i<this.xchunks.length;i++){
                this.chunks[k][i]=this.xchunks[i];
                GeneratedChunks.forEach(gen=>{
                    for(let j=this.xchunks[i].s;j<=this.xchunks[i].e;j++){
                        gen[j]=false;
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
        let fill = 1;
        for(let i=this.chunks.length-1;i>=this.chunks.length-fill;i--){
            let y=this.chunks[i].s
            let loop = function(y,chunk,map,p) {
                for(let key in chunk){
                    if(typeof(Number(key))!='number')return;
                    let arr=chunk[key];
                    for(let j=arr.s;j<=arr.e;j++){
                        let f=func(j,y)
                        if(f){
                            GeneratedChunks[y-1][j]=map.CreateObject(j*p,y*p,p,p);
                            map.object.SetImage(GeneratedChunks[y-1][j],f.image||'bedrock');
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
        y=Math.floor(y/this.p)+1;
        this.reference={x1:x-this.range>-1?x-this.range:0,x2:x+this.range<GeneratedChunks[0].length?x+this.range:GeneratedChunks[0].length-1,y1:y-this.range>-1?y-this.range:0,y2:y+this.range<GeneratedChunks.length?y+this.range:GeneratedChunks.length-1};
    };
    get GetClosestObjects() {
        let retval = [];
        let i=0;
        GeneratedChunks.forEach(grid=>{
            if(i<this.reference.y1||i>this.reference.y2){i++;return;};
            for(let j=this.reference.x1;j<this.reference.x2;j++){
                if(grid[j]!=false){retval[grid[j]]=true;}
            };
        });
        return retval
    };
};