class ChunkGenerator {
    constructor(scene,grid) {
        this.map = scene;
        this.grid = grid;
        this.xchunks = [];
        this.ychunks = [];
        this.chunks = [];
    };
    DivChunks(x,p,y) {
        let fl = Math.floor(x/p)
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
            for(let i=0;i<this.xchunks.length;i++){
                this.chunks[k][i]=this.xchunks[i];
            };
        });
    };
    PreLoadChunks(s) {
        this.DivChunks(this.map.size.x/this.map.size.h,s||6,Math.floor((this.map.size.y)/this.map.size.h)-1);        
    };
};