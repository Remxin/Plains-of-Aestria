export default class Card {
    constructor(id, space, x, y, z, cards, add_to_space) {
        this.object_group = new THREE.Group() //it contains card, texture and stats
        this.id = id;     //needed for card identification
        this.card; //this is the card data in json got by id

        //needed to make deep copy
        this.cards = JSON.parse(JSON.stringify(cards))

        //final method will be grabbing stats
        //types, img, ect. from database via ID

        //goal is to generate all of the cards
        //and then putting them into local cardsDB

        //decks will be getting the cards via copying
        //cardsDB[unique_id] and putting it into the players local deck
        this.type;
        this.state = 'hand' //deck || hand || board || used 
        this.mana_cost;
        this.hp;
        this.atk;
        this.fraction;
        this.file_path;
        this._id; //id used in db

        this.space = space
        this.x = x
        this.y = y
        this.z = z

        this.width = window.innerWidth / 10
        this.height = window.innerHeight / 4


        this.identify_card_via_id(cards)
        this.load_stats(this.card)
        this.create_stat_display()

        if (add_to_space) {
            this.init()
        }


    }

    //now the board and deck will be managing init
    init() {
        this.object_group.add(this.mesh)
        this.space.scene.add(this.object_group)
    }

    create() {
        this.geometry = new THREE.BoxGeometry(window.innerWidth / 10, window.innerHeight / 4.2, 20)
        let materials = [
            new THREE.MeshBasicMaterial({ map: this.load_custom_texture('../imgs/card_side1.png') }),
            new THREE.MeshBasicMaterial({ map: this.load_custom_texture('../imgs/card_side1.png') }),
            new THREE.MeshBasicMaterial({ map: this.load_custom_texture('../imgs/card_side1.png') }),
            new THREE.MeshBasicMaterial({ map: this.load_custom_texture('../imgs/card_side1.png') }),
            new THREE.MeshBasicMaterial({ map: this.load_texture() }),
            new THREE.MeshBasicMaterial({ map: this.load_custom_texture('../imgs/card_reverse.png') }),
        ]

        this.mesh = new THREE.Mesh(this.geometry, materials)
        this.mesh.rotation.x = (Math.PI / 180) * 270
        this.mesh.position.set(this.x, this.y, this.z)
    }

    full_initialization(x, y, z) {
        this.create()
        this.set_position(x, y, z)
        this.init()
        this.update_position()
    }

    load_stats(card) {
        console.log(card)

        this.type = card.type
        this.mana_cost = card.mana_cost
        this.hp = card.hp
        this.atk = card.atk
        this.fraction = card.fraction
        this.file_path = card.file_path
        this.description = card.description
        this.name = card.name
        this._id = card._id
    }

    update_position() {
        this.x = this.mesh.position.x
        this.y = this.mesh.position.y
        this.z = this.mesh.position.z

        this.hp_stat.position.set(this.x + (this.width / 2.3), this.y + 13, this.z + (this.height / 2.6))
        this.atk_stat.position.set(this.x - (this.width / 2.3), this.y + 13, this.z + (this.height / 2.6))
        this.mana_cost_stat.position.set(this.x + (this.width / 2.3), this.y + 13, this.z - (this.height / 2.6))
    }

    set_position(x, y, z) {
        this.mesh.position.x = x
        this.mesh.position.y = y
        this.mesh.position.z = z
    }

    move_to(x, y, z) {
        this.set_position(x, y, z)
        this.update_position()
    }

    create_stat_display() {
        if (this.hp_stat != null) {
            this.object_group.remove(this.hp_stat)
            this.object_group.remove(this.atk_stat)
            this.object_group.remove(this.mana_cost_stat)
        }

        this.hp_stat = this.dcText(`${this.hp}`, 30, 30, 50, 0xffffff, 0x000000, "hp")
        this.atk_stat = this.dcText(`${this.atk}`, 30, 30, 50, 0xffffff, 0x000000, "atk")
        this.mana_cost_stat = this.dcText(`${this.mana_cost}`, 30, 30, 50, 0xffffff, 0x000000, "mana")

        this.atk_stat.position.set(this.x - (this.width / 2.3), this.y + 12, this.z + (this.height / 2.6))
        this.atk_stat.rotation.x = ((Math.PI) / 180) * 270

        this.hp_stat.position.set(this.x + (this.width / 2.3), this.y + 12, this.z + (this.height / 2.6))
        this.hp_stat.rotation.x = ((Math.PI) / 180) * 270

        this.mana_cost_stat.position.set(this.x + (this.width / 2.3), this.y + 12, this.z - (this.height / 2.6))
        this.mana_cost_stat.rotation.x = ((Math.PI) / 180) * 270

        this.object_group.add(this.hp_stat)
        this.object_group.add(this.atk_stat)
        this.object_group.add(this.mana_cost_stat)
    }

    update_stat_display() {
        this.hp_stat = this.dcText(`${this.hp}`, 30, 30, 50, 0xffffff, 0x000000, "hp")
        this.atk_stat = this.dcText(`${this.atk}`, 30, 30, 50, 0xffffff, 0x000000, "atk")
        this.mana_cost_stat = this.dcText(`${this.mana_cost}`, 30, 30, 50, 0xffffff, 0x000000, "mana")
    }

    dcText(txt, hWorldTxt, hWorldAll, hPxTxt, fgcolor, bgcolor, symbol) { // the routine
        // txt is the text.
        // hWorldTxt is world height of text in the plane.
        // hWorldAll is world height of whole rectangle containing the text.
        // hPxTxt is px height of text in the texture canvas; larger gives sharper text.
        // The plane and texture canvas are created wide enough to hold the text.
        // And wider if hWorldAll/hWorldTxt > 1 which indicates padding is desired.

        let img = new Image()
        if (symbol == 'atk') { img.src = '../imgs/atk_icon.png' }
        else if (symbol == 'hp') { img.src = '../imgs/hp_icon.png' }
        else if (symbol == 'mana') { img.src = '../imgs/mana_cost_icon.png' }


        let kPxToWorld = hWorldTxt / hPxTxt;                // Px to World multplication factor
        // hWorldTxt, hWorldAll, and hPxTxt are given; get hPxAll
        let hPxAll = Math.ceil(hWorldAll / kPxToWorld);     // hPxAll: height of the whole texture canvas

        //hPxAll = 48

        // create the canvas for the texture
        let txtcanvas = document.createElement("canvas"); // create the canvas for the texture
        let ctx = txtcanvas.getContext("2d");
        ctx.font = hPxTxt + "px sans-serif";
        // now get the widths
        let wPxTxt = ctx.measureText(txt).width;         // wPxTxt: width of the text in the texture canvas
        let wWorldTxt = wPxTxt * kPxToWorld;               // wWorldTxt: world width of text in the plane
        let wWorldAll = wWorldTxt + (hWorldAll - hWorldTxt); // wWorldAll: world width of the whole plane
        let wPxAll = Math.ceil(wWorldAll / kPxToWorld);    // wPxAll: width of the whole texture canvas

        //wPxAll = 32

        // next, resize the texture canvas and fill the text
        txtcanvas.width = wPxAll;
        txtcanvas.height = hPxAll;

        if (bgcolor != undefined) { // fill background if desired (transparent if none)
            ctx.fillStyle = "#" + bgcolor.toString(16).padStart(6, '0');
            ctx.fillRect(0, 0, wPxAll, hPxAll);
        }
        ctx.drawImage(img, 0, 0, wPxAll, hPxAll)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#" + fgcolor.toString(16).padStart(6, '0'); // fgcolor
        ctx.font = hPxTxt + "px sans-serif";   // needed after resize
        ctx.fillText(txt, wPxAll / 2, hPxAll / 1.8); // the deed is done
        ctx.strokeText(txt, wPxAll / 2, hPxAll / 1.8)

        ctx.fill()
        ctx.stroke()

        // next, make the texture
        let texture = new THREE.Texture(txtcanvas); // now make texture
        texture.minFilter = THREE.LinearFilter;     // eliminate console message
        texture.needsUpdate = true;                 // duh
        // and make the world plane with the texture
        //let geometry = new THREE.PlaneGeometry(wWorldAll, hWorldAll);
        let geometry = new THREE.PlaneGeometry(wPxAll / 1.4, hPxAll / 1.4);

        let material = new THREE.MeshBasicMaterial(
            { side: THREE.DoubleSide, map: texture, transparent: true, opacity: 1.0 });
        // and finally, the mesh
        let mesh = new THREE.Mesh(geometry, material);
        mesh.wWorldTxt = wWorldTxt; // return the width of the text in the plane
        mesh.wWorldAll = wWorldAll; //    and the width of the whole plane
        mesh.wPxTxt = wPxTxt;       //    and the width of the text in the texture canvas
        // (the heights of the above items are known)
        mesh.wPxAll = wPxAll;       //    and the width of the whole texture canvas
        mesh.hPxAll = hPxAll;       //    and the height of the whole texture canvas
        mesh.ctx = ctx;             //    and the 2d texture context, for any glitter

        //console.log(wPxTxt, hPxTxt, wPxAll, hPxAll);
        //console.log(wWorldTxt, hWorldTxt, wWorldAll, hWorldAll);
        //console.log(mesh)
        return mesh;

    }

    load_texture() {
        const texture = new THREE.TextureLoader().load(`${this.file_path}`)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture
    }

    load_custom_texture(texture_name) {
        const texture = new THREE.TextureLoader().load(`../imgs/${texture_name}`)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture
    }

    identify_card_via_id(cards) {
        //console.log(cards)
        // let card_json = cards[this.id]
        // this.card = card_json
        //console.log(cards)
        for (let card_data of cards) {
            if (this.card) continue

            //console.log('card id', card_data._id, this.id)
            if (card_data._id == this.id) {
                this.card = card_data
                console.log('blablabla')
                console.log(this.card)

            }
        }
    }
}

