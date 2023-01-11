function vec(x,y,z,w) {
    if(!x&&!y)return;
    if(x&&y&&!z)return new Vector2(x,y);
    if(x&&y&&z&&!w)return new Vector3(x,y,z);
    if(x&&y&&z&&w)return new Vector4(x,y,z,w);
};

class Vector2 {
    #x;
    #y;
    constructor(x,y) {
        if(x==undefined||y==undefined) throw new Error('Vector2 Must have x,y values!');
        this.#x = x;
        this.#y = y;
    };
    get x() { return this.#x; };
    get y() { return this.#y; };
    get type() { return 'vector2'; };
    get data() { return {x:this.#x,y:this.#y}; };
};

class Vector3 {
    #x;
    #y;
    #z;
    constructor(x,y,z) {
        if(x==undefined||y==undefined||z==undefined) throw new Error('Vector3 Must have x,y,z values!');
        this.#x = x;
        this.#y = y;
        this.#z = z;
    };
    get x() { return this.#x; };
    get y() { return this.#y; };
    get z() { return this.#z; };
    get type() { return 'vector3'; };
    get data() { return {x:this.#x,y:this.#y,z:this.#z}; };
};

class Vector4 {
    #x;
    #y;
    #z;
    #w;
    constructor(x,y,z,w) {
        if(x==undefined||y==undefined||z==undefined||w==undefined) throw new Error('Vector4 Must have x,y,z,w values!');
        this.#x = x;
        this.#y = y;
        this.#z = z;
        this.#w = w;
    };
    get x() { return this.#x; };
    get y() { return this.#y; };
    get z() { return this.#z; };
    get w() { return this.#w; };
    get type() { return 'vector4'; };
    get data() { return {x:this.#x,y:this.#y,z:this.#z,w:this.#w}; };
};

function vector2(x,y) {
    return new Vector2(x,y);
};

function vector3(x,y,z) {
    return new Vector3(x,y,z);
};

function vector4(x,y,z,w) {
    return new Vector4(x,y,z,w);
};