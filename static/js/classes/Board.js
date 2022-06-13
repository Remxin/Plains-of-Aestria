export default class Board {
    constructor(x, y, z, width, height, space, Card, all_cards){
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

        this.turn_count = 0

        this.init()
        this.create_grid()
        this.display_deck()
        this.init_deck()
        
        //testing purposes only 
        this.add_one_enemy_card()
        this.add_end_turn_button()
        this.apply_end_turn()
    }

    init(){
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
        this.mesh.rotation.x = (Math.PI/180)*270

        this.space.scene.add(this.mesh)
    }

    create_grid(){
        for(let row = 0; row < 4; row++){

            for(let col = -3; col < 4; col++){
                let height = window.innerHeight/4.7
                let width = window.innerWidth/10

                let geometry = new THREE.BoxGeometry(width, height, 20)
                let material = new THREE.MeshBasicMaterial({
                    map: this.load_texture('card_placeholder1.png')
                })

                let mesh = new THREE.Mesh(geometry, material)
                mesh.rotation.x = (Math.PI/180) * 270

                let x = -col*window.innerWidth/7
                let y = -8
                let z = row*(height+35) - height*1.8
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

    load_texture(texture_name){
        const texture = new THREE.TextureLoader().load(`../imgs/${texture_name}`)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        return texture
    }

    display_deck(){
        let geometry = new THREE.BoxGeometry(window.innerWidth/10, window.innerHeight/4.2, 20 )
        let materials = [
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_side1.png')}), //right
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_side1.png')}), //left
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_side1.png')}),    //top 
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_side1.png')}), //bottom
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_reverse.png')}), //front -- its top and left is top 
            new THREE.MeshBasicMaterial({map: this.load_texture('../imgs/card_reverse.png')})  //back
        ]

        let mesh = new THREE.Mesh(geometry, materials)
        mesh.rotation.x = (Math.PI/180) * 270
        
        //right side of player;s board, z=0 and x=1/2width + offset
        let x = this.width/2 + 75
        let z = 0
        let y = 10
        mesh.position.set(x, y, z)

        this.space.scene.add(mesh)
    }

    init_deck(){
        //gets players chosen deck ~~somehow~~
        //implementation only for testing
        for(let i in this.cards_json){
            this.deck.push(i)
        }
        this.shuffle_deck()
        this.init_cards_in_deck() //this just sound cooler, and i can do what i want ok ?
        this.draw_card(5)
    }

    init_cards_in_deck(){
        this.add_cards_in_order()
    }

    add_cards_in_order(){
        for(let i = 0; i <= this.deck.length - 1; i++){  
            let x = this.width/2 + 75
            let z = 0
            let y = 0
            
            let card = new this.Card(i, this.space, x,y,z, this.cards_json, false)
            card.state = 'deck'
            this.cards_in_order.push(card)
        }

        this.cards = this.cards_in_order
    }

    shuffle_deck(){
        let new_deck = this.deck

        for (let i = this.deck.length - 1; i > 0; i--){
            let j = Math.floor(Math.random()*(i + 1))
            let temp = new_deck[i]
            new_deck[i] = new_deck[j]
            new_deck[j] = temp
        }
    }

    draw_card(to_draw){
        if(to_draw == 0) return

        let first_card_id = this.deck[this.deck.length-1]
        this.deck.pop()
        
        let drawn_card = this.cards_in_order[first_card_id]
        this.cards_in_hand.push(drawn_card)


        //console.log(first_card_id, drawn_card)
        drawn_card.full_initialization(drawn_card.x,drawn_card.y,drawn_card.z)
        //console.log(drawn_card)

        new TWEEN.Tween(drawn_card.object_group.position)
            .to({
                y:50,
                },400)
                .easing(TWEEN.Easing.Elastic.InOut)
                .start()
                .onUpdate(drawn_card.update_position())
                .onComplete( () => {
                    new TWEEN.Tween(drawn_card.mesh.position)
                    .to({
                        x:0,
                        z:0
                        },400)
                        .easing(TWEEN.Easing.Exponential.Out)
                        .start()
                        .onUpdate(()=>{
                            drawn_card.update_position()
                            drawn_card.set_position(drawn_card.x,drawn_card.y,drawn_card.z)
                        })
                        .onComplete( () => {
                            new TWEEN.Tween(drawn_card.mesh.position)
                            .to({
                                x: -5*drawn_card.width + this.cards_in_hand.length*(drawn_card.width+10),
                                z: this.height/2+100
                                },1000)
                                .easing(TWEEN.Easing.Cubic.Out)
                                .start()
                                .onUpdate(()=>{
                                    drawn_card.update_position()
                                    drawn_card.set_position(drawn_card.x,drawn_card.y,drawn_card.z)
                                    drawn_card.state = 'hand'
                                })
                                .onComplete(this.draw_card(to_draw-1))
                        })
                })
        //console.log(drawn_card)
    }

    add_one_enemy_card(){
        let index = Math.floor(Math.random()*14)
        let tile = this.grid_display[index] //position for card

        //position extraction
        let x = tile.position.x
        let y = 5
        let z = tile.position.z

        //create card, update cards_on_grid and initialize card
        let card = new this.Card(3, this.space, x,y,z, this.cards_json, false)
        this.cards_on_grid[index] = card
        card.full_initialization(card.x,card.y,card.z)
        
        
    }

    add_end_turn_button(){
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
        button.style.top = `${window.innerHeight/2}px`
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

    apply_end_turn(){
        this.end_turn_button.addEventListener('click', () => {
            this.end_turn()
        })
    }

    async end_turn(){
        this.turn_count += 1
        
        await this.initialize_attack()
    }

    async initialize_attack(){
        //player cards if 14 to 27 on grid
        //enemy cards if 0 to 13 on grid
        let run = true
        let index = 27
        while(run){
            console.log(index, this.cards_on_grid[index])     
            await this.minions_attack(index)

            if(index == 0) run = false
            index -= 1
        }

        this.delete_dead_minions()
    }

    //-1 INDEX WILL BE HERO || IMPORTANT || IMPORTANT || IMPORTANT || IMPORTANT || IMPORTANT
    identify_enemy(index){
        let current_card = this.cards_on_grid[index]
        if (current_card == null) return
        //console.log(current_card, '|||||', index)


        //identify grid index to attack using ~~magic~~
        let attack_index;
        if(index > 20){ //player cards
            attack_index = ((this.cards_on_grid[index-14]) ? index-14 : ((this.cards_on_grid[index-21]) ? index-21 : -1))                
        }
        else if(index <= 20 && index > 13){
            attack_index = ((this.cards_on_grid[index-7]) ? index-7 : ((this.cards_on_grid[index-14]) ? index-14 : -1))
        }
        else if(index <= 13 && index > 6){
            attack_index = ((this.cards_on_grid[index+7]) ? index+7 : ((this.cards_on_grid[index+14]) ? index+14 : -1))
        }
        else if(index <= 6 && index > -1){
            attack_index = ((this.cards_on_grid[index+14]) ? index+14 : ((this.cards_on_grid[index+21]) ? index+21 : -1))
        }
        
        //console.log(index, current_card, attack_index, 'AAAAAAAAAAAAAAAAAAAAAAAAA')

        return attack_index
    }

    delete_dead_minions(){
        
    }

    async minions_attack(index){
        let current_card = this.cards_on_grid[index]
        if (current_card == null) return
        
        let attack_index = this.identify_enemy(index)
        if(attack_index == -1) this.attack_enemy_hero()
        else await this.attack_minion(current_card, attack_index)
    }

    async attack_minion(card, atk_index){
        let enemy_card = this.cards_on_grid[atk_index]

        //calculate new hp values for both cards
        enemy_card.hp = enemy_card.hp - card.atk
        //console.log(enemy_card.hp, card.hp)

        return await this.attack_animation(card, enemy_card)
    }

    attack_enemy_hero(){

    }

    attack_animation(card, enemy_card){
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
                    y:20
                },200)
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