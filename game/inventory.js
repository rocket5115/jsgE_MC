class Inventory {
    constructor(map) {
        this.map = map;
        this.inventory = [];
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
        inv.innerHTML = "<div>asd</div><div>asd</div><div>asd</div><div>asd</div><div>asd</div><div>asd</div><div>asd</div><div>asd</div><div>asd</div>"
        this.MoveTo(0);
    };
    MoveTo(id) {
        this.selected=id>=0&&id<9?id:0;
        document.documentElement.style.setProperty('--inv-left', this.selected*74+'px');
    };
    get GetSelectedItem() {
        return inventory[this.selected];
    };
    get GetSelectedSpace() {
        return this.selected;
    };
};