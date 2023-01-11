function RaycastDirection(v1,v2) {
    if(v1.type!='vector2'||v2.type!='vector2')return;
    let x1=(v1.x<v2.x?v1.x:v2.x);
    let x2=(v1.x>v2.x?v1.x:v2.x);
    let y1=(v1.y<v2.y?v1.y:v2.y);
    let y2=(v1.y>v2.y?v1.y:v2.y);
    let dx=x2-x1;
    let dy=y2-y1;
    let len=dx<dy?dy:dx;
    return {num:len,x:dx/len,y:dy/len};
};

function Raycast(x1,y1,x2,y2,cb) {
    let vec1;
    let vec2;
    if(typeof(x1)=='object'){if(x1.type=='vector2'){vec1=x1;cb=x2;};};
    if(typeof(y1)=='object'){if(y1.type=='vector2'){vec2=y1;cb=x2;};};
    if(typeof(cb)!='function')throw new Error('Raycast: callback must be a function!');
    vec1 = vec1||vec(x1,y1);
    vec2 = vec2||vec(x2,y2);
    let dir = RaycastDirection(vec1,vec2);
    let x=dir.x;
    let y=dir.y;
    for(let i=0;i<dir.num;i++){
        if(cb){
            cb(x,y)
        };
        x=x+dir.x;
        y=y+dir.y;
    };
};

// Raycast(100,200,400,400, (x,y)=>{
//     console.log('raycast',x,y)
// });