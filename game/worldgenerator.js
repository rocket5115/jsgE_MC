class WorldGenerator {
    constructor(chunk) {
        this.gen = chunk;
        this.ymax = Math.floor(chunk.scene.size.y/chunk.scene.size.h);
    };
    CreateWorld(data) {
        this.gen.PreLoadChunks(6, (x,y) => {
            if(y>=this.ymax)return;
            if(data.bottom&&(data.bottom.y==y||data.bottom.ymax<=y)) {
                return {image:data.bottom.image,await:data.bottom.await};
            };
            if(data.phase[(ymax-y)-1]){
                return data.phase[(ymax-y)-1](x,y);
            };
            return false;
        });
    };
    get generator() {
        return this.gen;
    }
};