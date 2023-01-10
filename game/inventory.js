class Inventory {
    constructor(map) {
        this.map = map;
        this.personalInventory = [];
        this.invObject = [];
        this.selected = 0;
    };
    PreparePersonalInventory() {
        this.invObject = new SceneCreator(this.map.size.x,this.map.size.y);
        this.invObject.CreateScene();
        let x=(64*9)+(10*10);
        let y=84;
        let inv = document.getElementById(this.invObject.CreateObject(Math.floor(window.innerWidth-x)/2,Math.floor(window.innerHeight-(y+20)),x,y));
        inv.style.position = "fixed";
        inv.style.zIndex = 2;
        inv.className = "inventory";
        inv.innerHTML = '<div id="Inv0"></div><div id="Inv1"></div><div id="Inv2"></div><div id="Inv3"></div><div id="Inv4"></div><div id="Inv5"></div><div id="Inv6"></div><div id="Inv7"></div><div id="Inv8"></div>';
        for(let i=0;i<=8;i++) {
            this.personalInventory[i]=false;
        };
        this.MoveTo(0);
    };
    MoveTo(id) {
        this.selected=id>=0&&id<9?id:0;
        document.documentElement.style.setProperty('--inv-left', this.selected*74+'px');
    };
    AddItemToNextSpace(item, num) {
        if(!item||!num||num<=0)return;
        let free = -1;
        for(let i=0;i<=8;i++) {
            if(!this.personalInventory[i]||(this.personalInventory[i]&&(this.personalInventory[i].item==item&&this.personalInventory[i].stack>=(this.personalInventory[i].num+num)))){free=i;break;};
        };
        if(free==-1)return 'No Free Space';
        if(this.personalInventory[free]){
            this.personalInventory[free].num=this.personalInventory[free].num+num;
        } else {
            this.personalInventory[free]={item:item,num:num,stack:64};
        };
        document.documentElement.style.setProperty('--inv-'+free, `"${this.personalInventory[free].num}"`);
        document.getElementById('Inv'+free).style.backgroundImage = `url("./images/${item}.png")`
        return true;
    };
    RemoveItemFromSpace(space, num) {
        if(space==undefined)return;
        if(!num) {
            if(this.personalInventory[space])this.personalInventory[space]=false;
        } else {
            if(this.personalInventory[space]&&this.personalInventory[space].num>=num){
                this.personalInventory[space].num=this.personalInventory[space].num-num;
                if(this.personalInventory[space].num<=0) {
                    document.documentElement.style.setProperty('--inv-'+space, "");
                    document.getElementById('Inv'+space).style.backgroundImage = ``;
                };
            };
        };
    };
    get GetSelectedItem() {
        return this.personalInventory[this.selected];
    };
    get GetSelectedSpace() {
        return this.selected;
    };
};