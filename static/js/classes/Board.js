export default class Board {
    constructor(x, y, z, width, height, space, Card, all_cards, fraction, player_hero, enemy_hero) {
        this.x = x
        this.y = y
        this.z = z
        this.width = width
        this.height = height

        this.geometry;
        this.material;
        this.mesh

        this.space = space //needed for modules

        this.grid_positions = [] //{x: pos, z: pos} ----- positions for the card grid 
        this.grid_display = []   //meshes representing card grid positions 


        this.cards_on_grid = []  //all cards on grid


        this.cards_json = all_cards //array with all of the cards data objects
        this.Card = Card //Card class

        this.deck = [] //it gets shuffeled at initialization -- just numbers that imply order
        this.cards = [] //group objects with card and it's stats
        this.cards_in_hand = [] //cards currently held 
        this.cards_in_order = [] //cards by id -- 0 to max
        this.fraction = fraction

        this.player_hero = player_hero
        this.enemy_hero = enemy_hero
        this.player_hero_hp = 50
        this.enemy_hero_hp = 50
        this.player_hp_canvas
        this.enemy_hp_canvas

        this.starting_player = false
        this.turn_count = 1
        this.mana_available = 1
        this.max_mana = 1
        this.mana_canvas

        this.init()
        this.create_grid()
        this.display_deck()
        this.init_deck()
        this.who_starts()

        //testing purposes only 
        //this.add_one_enemy_card()

        this.add_end_turn_button()
        this.apply_end_turn()
        this.display_both_players_hp_and_player_mana()
    }

    init() {
        const texture = new THREE.TextureLoader().load('../imgs/board.png')
        //texture.wrapS = THREE.RepeatWrapping;
        //texture.wrapT = THREE.RepeatWrapping;
        //texture.repeat.set(2, 1)

        this.geometry = new THREE.PlaneGeometry(this.width, this.height)
        this.material = new THREE.MeshBasicMaterial({
            color: "0xffffff",
            map: texture

        })

        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.position.set(this.x, this.y, this.z)
        this.mesh.rotation.x = (Math.PI / 180) * 270

        this.space.scene.add(this.mesh)
    }

    who_starts(){
        if(this.space.socket.whoseTurn == this.space.socket.userContext.userId){
            alert('cycki')
        }
    }

    display_both_players_hp_and_player_mana(){
          this.create_hp_canvas('player')
          this.create_hp_canvas('enemy')
          this.create_mana_canvas()
    }

    update_hero_hp(user){
        if(!this.player_hp_canvas) return
        if(!this.enemy_hp_canvas)  return
        
        let canvas;
        if(user == 'player') canvas = this.player_hp_canvas
        else canvas = this.enemy_hp_canvas
        
        let ctx = canvas.getContext('2d')
        
        ctx.fillStyle = '#260911'
        ctx.strokeStyle = '#f5e642'
        ctx.lineWidth = 5

        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.moveTo(0,0)
        ctx.lineTo(0, canvas.width)
        ctx.lineTo(canvas.height, canvas.width)
        ctx.lineTo(canvas.height, 0)
        ctx.lineTo(0,0)
        ctx.stroke()

        let img = new Image()
        img.src = '../imgs/hero_hp.png'
        let offset_x =  (canvas.width-64)/1.5 - 5
        let offset_y =  (canvas.width-64) - 5
        ctx.drawImage(img, 0, 0, 64, 64, offset_x, offset_y, canvas.width+16, canvas.height+16)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1
        ctx.font = 30 + "px sans-serif";   // needed after resize
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        
        if(user == 'player'){
            ctx.fillText(this.player_hero_hp, canvas.width/2, canvas.height/2)
            ctx.strokeText(this.player_hero_hp, canvas.width/2, canvas.height/2)
        }
        else{
            ctx.fillText(this.enemy_hero_hp, canvas.width/2, canvas.height/2)
            ctx.strokeText(this.enemy_hero_hp, canvas.width/2, canvas.height/2)
        }
    }

    create_hp_canvas(user){
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')

        canvas.width = 80
        canvas.height = 80

        canvas.style.position = 'absolute'
        canvas.style.zIndex = '10000'

        ctx.fillStyle = '#260911'
        ctx.strokeStyle = '#f5e642'
        ctx.lineWidth = 5
        

        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.moveTo(0,0)
        ctx.lineTo(0, canvas.width)
        ctx.lineTo(canvas.height, canvas.width)
        ctx.lineTo(canvas.height, 0)
        ctx.lineTo(0,0)
        ctx.stroke()

        let img = new Image()
        img.src = '../imgs/hero_hp.png'
        let offset_x =  (canvas.width-64)/1.5 - 5
        let offset_y =  (canvas.width-64) - 5
        ctx.drawImage(img, 0, 0, 64, 64, offset_x, offset_y, canvas.width+16, canvas.height+16)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1
        ctx.font = 30 + "px sans-serif";   // needed after resize
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        

        if(user == 'player'){
            canvas.style.left = '0px'
            canvas.style.bottom = '0px'

            ctx.fillText(this.player_hero_hp, canvas.width/2, canvas.height/2)
            ctx.strokeText(this.player_hero_hp, canvas.width/2, canvas.height/2)

            this.player_hp_canvas = canvas
        }
        else{
            canvas.style.left = '0px'
            canvas.style.top = '0px'

            ctx.fillText(this.player_hero_hp, canvas.width/2, canvas.height/2)
            ctx.strokeText(this.enemy_hero_hp, canvas.width/2, canvas.height/2)
            
            this.enemy_hp_canvas = canvas
        }

        document.body.appendChild(canvas)
    }

    create_mana_canvas(){
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')

        canvas.width = 80
        canvas.height = 80

        canvas.style.position = 'absolute'
        canvas.style.zIndex = '10000'

        ctx.fillStyle = '#260911'
        ctx.strokeStyle = '#f5e642'
        ctx.lineWidth = 5
        

        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.moveTo(0,0)
        ctx.lineTo(0, canvas.width)
        ctx.lineTo(canvas.height, canvas.width)
        ctx.lineTo(canvas.height, 0)
        ctx.lineTo(0,0)
        ctx.stroke()

        let img = new Image()
        img.src = '../imgs/current_mana_icon.png'
        ctx.drawImage(img, 0, 0, 64, 64, 4, 4, canvas.width-8, canvas.height-8)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1.2
        ctx.font = 30 + "px sans-serif"
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        

        canvas.style.left = '0px'
        canvas.style.bottom = '80px'

        ctx.fillText(`${this.mana_available}/${this.max_mana}`, canvas.width/2, canvas.height/2)
        ctx.font = 30 + "px sans-serif"
        ctx.strokeText(`${this.mana_available}/${this.max_mana}`, canvas.width/2, canvas.height/2)

        this.mana_canvas = canvas

        document.body.appendChild(canvas)
    }

    update_mana(){
        let canvas = this.mana_canvas
        let ctx = canvas.getContext('2d')

        ctx.fillStyle = '#260911'
        ctx.strokeStyle = '#f5e642'
        ctx.lineWidth = 5
        

        ctx.fillRect(0,0, canvas.width, canvas.height)
        ctx.moveTo(0,0)
        ctx.lineTo(0, canvas.width)
        ctx.lineTo(canvas.height, canvas.width)
        ctx.lineTo(canvas.height, 0)
        ctx.lineTo(0,0)
        ctx.stroke()

        let img = new Image()
        img.src = '../imgs/current_mana_icon.png'
        ctx.drawImage(img, 0, 0, 64, 64, 4, 4, canvas.width-8, canvas.height-8)

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineWidth = 1.2
        ctx.font = 30 + "px sans-serif"
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#000000'
        

        canvas.style.left = '0px'
        canvas.style.bottom = '80px'

        ctx.fillText(`${this.mana_available}/${this.max_mana}`, canvas.width/2, canvas.height/2)
        ctx.font = 30 + "px sans-serif"
        ctx.strokeText(`${this.mana_available}/${this.max_mana}`, canvas.width/2, canvas.height/2)
    }

    create_grid() {
        for (let row = 0; row < 4; row++) {

            for (let col = -3; col < 4; col++) {
                let height = window.innerHeight / 4.7
                let width = window.innerWidth / 10

                let geometry = new THREE.BoxGeometry(width, height, 20)
                let material = new THREE.MeshBasicMaterial({
                    map: this.load_texture('card_placeholder1.png')
                })

                let mesh = new THREE.Mesh(geometry, material)
                mesh.rotation.x = (Math.PI / 180) * 270

                let x = -col * window.innerWidth / 7
                let y = -3
                let z = row * (height + 35) - height * 1.8
                mesh.position.set(x, y, z)

                mesh.used = false //it's needed to verify card placement on tile, starting with no card on tile -> used=false
                this.grid_display.push(mesh)
                this.grid_positions.push({
                    x: mesh.position.x,
                    z: mesh.position.z
                })
                this.cards_on_grid.push(null)

                this.space.scene.add(mesh)
            }
        }

        console.log(this.cards_on_grid.length)
    }

    load_texture(texture_name) {
        const texture = new THREE.TextureLoader().load(`../imgs/${texture_name}`)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture
    }

    display_deck() {
        let geometry = new THREE.BoxGeometry(window.innerWidth / 10, window.innerHeight / 4.2, 20)
        let materials = [
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_side1.png') }), //right
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_side1.png') }), //left
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_side1.png') }),    //top 
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_side1.png') }), //bottom
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_reverse.png') }), //front -- its top and left is top 
            new THREE.MeshBasicMaterial({ map: this.load_texture('../imgs/card_reverse.png') })  //back
        ]

        let mesh = new THREE.Mesh(geometry, materials)
        mesh.rotation.x = (Math.PI / 180) * 270

        //right side of player;s board, z=0 and x=1/2width + offset
        let x = this.width / 2 + 75
        let z = 0
        let y = 10
        mesh.position.set(x, y, z)

        this.space.scene.add(mesh)
    }

    init_deck() {
        //gets players chosen deck ~~somehow~~
        //implementation only for testing
        for (let item of this.cards_json) {
            if(item.fraction == this.fraction){
                this.deck.push(item._id)
            }
        }
        this.shuffle_deck()
        this.init_cards_in_deck() //this just sound cooler, and i can do what i want ok ?
        this.draw_card(5)
    }

    init_cards_in_deck() {
        this.add_cards_in_order()
    }

    add_cards_in_order() {
        for (let i = 0; i <= this.deck.length - 1; i++) {
            let x = this.width / 2 + 75
            let z = 0
            let y = 0

            let card = new this.Card(this.deck[i], this.space, x, y, z, this.cards_json, false)
            card.state = 'deck'
            this.cards_in_order.push(card)
        }

        this.cards = this.cards_in_order
    }

    shuffle_deck() {
        let new_deck = this.deck

        for (let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = new_deck[i]
            new_deck[i] = new_deck[j]
            new_deck[j] = temp
        }
    }

    draw_card(to_draw) {
        if (to_draw == 0) return
        if (this.deck.length == 0) return

        let first_card_id = this.deck[this.deck.length - 1]
        this.deck.pop()

        let drawn_card;
        for (let card_data of this.cards_in_order) {
            if (card_data._id == first_card_id) {
                drawn_card = card_data
            }
        }

        let index = 0;
        let is_empty_space = false
        for(let card of this.cards_in_hand){
            if(card == null){
                this.cards_in_hand[index] = drawn_card
                is_empty_space = true
                break
            }
            index += 1
        }

        let to_new_space = -5 * drawn_card.width + this.cards_in_hand.length * (drawn_card.width + 10)
        let to_empty_space = -5 * drawn_card.width + index * (drawn_card.width + 10)
        if(!is_empty_space) this.cards_in_hand.push(drawn_card)


        let card_destination_in_hand = ((is_empty_space) ? to_empty_space : to_new_space)
        console.log(to_new_space, to_empty_space, index, this.cards_in_hand.length, this.cards_in_hand)
        
        //console.log(first_card_id, drawn_card)
        drawn_card.full_initialization(drawn_card.x, drawn_card.y, drawn_card.z)
        //console.log(drawn_card)

        new TWEEN.Tween(drawn_card.object_group.position)
            .to({
                y: 50,
            }, 400)
            .easing(TWEEN.Easing.Elastic.InOut)
            .start()
            .onUpdate(drawn_card.update_position())
            .onComplete(() => {
                new TWEEN.Tween(drawn_card.mesh.position)
                    .to({
                        x: 0,
                        z: 0
                    }, 400)
                    .easing(TWEEN.Easing.Exponential.Out)
                    .start()
                    .onUpdate(() => {
                        drawn_card.update_position()
                        drawn_card.set_position(drawn_card.x, drawn_card.y, drawn_card.z)
                    })
                    .onComplete(() => {
                        new TWEEN.Tween(drawn_card.mesh.position)
                            .to({
                                x: card_destination_in_hand,
                                z: this.height / 2 + 100
                            }, 1000)
                            .easing(TWEEN.Easing.Cubic.Out)
                            .start()
                            .onUpdate(() => {
                                drawn_card.update_position()
                                drawn_card.set_position(drawn_card.x, drawn_card.y, drawn_card.z)
                                drawn_card.state = 'hand'
                            })
                            .onComplete(this.draw_card(to_draw - 1))
                    })
            })
        //console.log(drawn_card)
    }

    add_one_enemy_card() {
        let index = Math.floor(Math.random() * 14)
        let tile = this.grid_display[index] //position for card

        //position extraction
        let x = tile.position.x
        let y = 5
        let z = tile.position.z

        //create card, update cards_on_grid and initialize card
        let card = new this.Card(this.deck[3], this.space, x, y, z, this.cards_json, false)
        this.cards_on_grid[index] = card
        card.full_initialization(card.x, card.y, card.z)


    }

    add_end_turn_button() {
        let button = document.createElement('div')
        button.id = 'end-turn'
        button.style.position = 'absolute'
        button.style.backgroundColor = 'rgba(202, 28, 111, 0.2)'
        button.style.border = '2px solid crimson'

        button.style.fontFamily = 'Arial'
        button.style.textAlign = 'center'
        button.style.color = 'black'
        button.style.fontSize = '30px'

        button.style.width = '150px'
        button.style.height = 'wrap-content'
        button.style.top = `${window.innerHeight / 2}px`
        button.style.right = '0px'
        button.style.visibility = 'hidden'

        button.innerText = 'End Turn'

        this.end_turn_button = button
        document.body.appendChild(button)


        button.onmouseover = () => {
            button.style.color = 'white'
            button.style.backgroundColor = 'rgba(221, 248, 131, 0.6)'
            button.style.border = '2px solid gold'
        }

        button.onmouseout = () => {
            button.style.color = 'black'
            button.style.backgroundColor = 'rgba(202, 28, 111, 0.2)'
            button.style.border = '2px solid crimson'
        }
    }

    apply_end_turn() {
        this.end_turn_button.addEventListener('click', () => {
            this.space.socket.passTurn()
            this.end_turn()
        })
    }

    async end_turn() {
        this.turn_count += 1

        await this.initialize_attack()
        this.draw_card(1)
        this.max_mana += 1
        this.mana_available = this.max_mana
        this.update_mana()
    }

    async initialize_attack() {
        //player cards if 14 to 27 on grid
        //enemy cards if 0 to 13 on grid
        let run = true
        let index = 27
        while (run) {
            console.log(index, this.cards_on_grid[index])
            await this.minions_attack(index)

            if (index == 0) run = false
            index -= 1
        }

        this.delete_dead_minions()
    }

    //-1 INDEX WILL BE HERO || IMPORTANT || IMPORTANT || IMPORTANT || IMPORTANT || IMPORTANT
    identify_enemy(index) {
        let current_card = this.cards_on_grid[index]
        if (current_card == null) return
        //console.log(current_card, '|||||', index)


        //identify grid index to attack using ~~magic~~
        let attack_index;
        if (index > 20) { //player cards
            attack_index = ((this.cards_on_grid[index - 14]) ? index - 14 : ((this.cards_on_grid[index - 21]) ? index - 21 : -1))
        }
        else if (index <= 20 && index > 13) {
            attack_index = ((this.cards_on_grid[index - 7]) ? index - 7 : ((this.cards_on_grid[index - 14]) ? index - 14 : -1))
        }
        else if (index <= 13 && index > 6) {
            attack_index = ((this.cards_on_grid[index + 7]) ? index + 7 : ((this.cards_on_grid[index + 14]) ? index + 14 : -1))
        }
        else if (index <= 6 && index > -1) {
            attack_index = ((this.cards_on_grid[index + 14]) ? index + 14 : ((this.cards_on_grid[index + 21]) ? index + 21 : -1))
        }

        //console.log(index, current_card, attack_index, 'AAAAAAAAAAAAAAAAAAAAAAAAA')

        return attack_index
    }

    delete_dead_minions() {
        let index = 0
        for (let minion of this.cards_on_grid) {
            if (minion != null && minion.hp < 1) {
                this.space.scene.remove(minion.object_group)
                minion = null
                this.cards_on_grid[index] = null
            }

            index += 1
        }
    }

    async minions_attack(index) {
        let current_card = this.cards_on_grid[index]
        if (current_card == null) return

        let attack_index = this.identify_enemy(index)
        console.log(attack_index, 'jdjdjd')

        if (attack_index == -1) await this.attack_enemy_hero(current_card, index)
        else if(attack_index > 0) await this.attack_minion(current_card, attack_index)
    }

    async attack_minion(card, atk_index) {
        let enemy_card = this.cards_on_grid[atk_index]

        //calculate new hp values for both cards
        enemy_card.hp = enemy_card.hp - card.atk
        //console.log(enemy_card.hp, card.hp)

        return await this.attack_animation(card, enemy_card)
    }

    attack_enemy_hero(card, index) {
        let old_x = card.mesh.position.x
        let old_y = card.mesh.position.y
        let old_z = card.mesh.position.z

        return new Promise((resolve, reject) => {
            let attacked_hero; 
            let attacked_player;
            let hero_hp;
            if(index < 14){
                attacked_hero = this.player_hero
                attacked_player = 'player'
                hero_hp = this.player_hero_hp
            }
            else{
                attacked_hero = this.enemy_hero
                attacked_player = 'enemy'
                hero_hp = this.enemy_hero_hp
            }

            new TWEEN.Tween(card.mesh.position)
            .to({
                x: attacked_hero.mesh.position.x,
                z: attacked_hero.mesh.position.z,
                y: 200
            }, 500)
            .easing(TWEEN.Easing.Exponential.Out)
            .start()
            .onUpdate(() => {
                card.update_position()
                card.set_position(card.x, card.y, card.z)
            })
            .onComplete(() => {
                new TWEEN.Tween(card.mesh.position)
                    .to({
                        y: 20
                    }, 200)
                    .easing(TWEEN.Easing.Bounce.Out)
                    .start()
                    .onUpdate(() => {
                        card.update_position()
                        card.set_position(card.x, card.y, card.z)
                    })
                    .onComplete(() => {
                        new TWEEN.Tween(card.mesh.position)
                            .to({
                                x: old_x,
                                y: old_y,
                                z: old_z
                            }, 500)
                            .easing(TWEEN.Easing.Exponential.Out)
                            .start()
                            .onUpdate(() => {
                                card.update_position()
                                card.set_position(card.x, card.y, card.z)
                            })
                            .onComplete(() => {
                                card.create_stat_display()
                                card.update_position()
                                card.set_position(card.x, card.y, card.z)

                                //add here update of enemy health
                                if(index < 14){
                                    this.player_hero_hp -= card.atk
                                }
                                else{
                                    this.enemy_hero_hp -= card.atk
                                }

                                //console.log(hero_hp, this.player_hero_hp, this.enemy_hero_hp)
                                this.update_hero_hp(attacked_player)
                                return resolve(card)
                            })
                    })
            })
        })
        
    }

    attack_animation(card, enemy_card) {
        return new Promise((resolve, reject) => {
            //position to go back after attack animation---------//|
            let card_x = card.mesh.position.x                    //|
            let card_z = card.mesh.position.z                    //|
            let card_y = card.object_group.position.y            //|
            //---------------------------------------------------//|

            new TWEEN.Tween(card.mesh.position)
                .to({
                    x: enemy_card.mesh.position.x,
                    z: enemy_card.mesh.position.z,
                    y: 150
                }, 500)
                .easing(TWEEN.Easing.Exponential.Out)
                .start()
                .onUpdate(() => {
                    card.update_position()
                    card.set_position(card.x, card.y, card.z)
                })
                .onComplete(() => {
                    new TWEEN.Tween(card.mesh.position)
                        .to({
                            y: 20
                        }, 200)
                        .easing(TWEEN.Easing.Bounce.Out)
                        .start()
                        .onUpdate(() => {
                            card.update_position()
                            card.set_position(card.x, card.y, card.z)
                        })
                        .onComplete(() => {
                            new TWEEN.Tween(card.mesh.position)
                                .to({
                                    x: card_x,
                                    z: card_z,
                                    y: card_y
                                }, 500)
                                .easing(TWEEN.Easing.Exponential.Out)
                                .start()
                                .onUpdate(() => {
                                    card.update_position()
                                    card.set_position(card.x, card.y, card.z)
                                })
                                .onComplete(() => {
                                    enemy_card.create_stat_display()
                                    enemy_card.update_position()
                                    enemy_card.set_position(enemy_card.x, enemy_card.y, enemy_card.z)
                                    return resolve(card)
                                })
                        })
                })
        })

    }


}
