export default class ModelLoader {
    constructor(space, fraction, is_enemy){
        this.fraction = fraction
        this.model_path = null;
        this.space = space
        this.is_enemy = is_enemy

        this.identify_model()
        this.load_model()
    }

    identify_model(){
        switch(this.fraction){
            case 'undead':
                this.model_path = 'imgs/3d_models/undead_hero/undead_hero.gltf'
                break;

            case 'demon':
                this.model_path = 'imgs/3d_models/demon_hero/demon_hero.gltf'
                break;

            case 'human':
                this.model_path = 'imgs/3d_models/human_hero/human_hero.gltf'
                break;
        }
    }

    load_model(){
        const loader = new THREE.GLTFLoader()
        const _this = this

        loader.load(`${this.model_path}`, function (gltf) {

            let mixer = new THREE.AnimationMixer(gltf);
            //console.log("ew lista animacji ",gltf.scene.animations)

            gltf.scene.traverse(function (child) {
                // tu można wykonać dowolną operację dla każdego mesha w modelu
                if (child.isMesh) {
                    //console.log(child)
                }

            });
            // dodanie do sceny
            console.log(_this.space, _this.fraction, 'blablabla', gltf.scene)
            _this.space.scene.add(gltf.scene);

            if(!_this.is_enemy){
                _this.place_player_hero(gltf)
            }
            else {
                _this.place_enemy_hero(gltf)
            }

            _this.mesh = gltf.scene

        }, undefined, function (error) {
            console.error(error);
        });
    }

    place_player_hero(gltf){
        let z = window.innerHeight/1.7
        let x = window.innerWidth/2.2

        if(this.fraction == 'demon'){
            gltf.scene.scale.set(0.2, 0.2, 0.2)
            gltf.scene.position.set(x,310,z)
        } 
        else if(this.fraction == 'undead'){
            gltf.scene.position.set(x,0,z)
            gltf.scene.scale.set(1.2,1.2,1.2)
        }
        else if(this.fraction == 'human'){
            gltf.scene.position.set(x,0,z+20)
            gltf.scene.scale.set(1.4, 1.4, 1.4)
        }

        gltf.scene.rotation.y += (Math.PI/180)*180
    }

    place_enemy_hero(gltf){
        let z = -window.innerHeight/1.5
        let x = 0

        if(this.fraction == 'demon'){
            gltf.scene.scale.set(0.2, 0.2, 0.2)
            gltf.scene.position.set(x,310,z)
        } 
        else if(this.fraction == 'undead'){
            gltf.scene.position.set(x,0,z)
            gltf.scene.scale.set(1.2,1.2,1.2)
        }
        else if(this.fraction == 'human'){
            gltf.scene.position.set(x,0,z+20)
            gltf.scene.scale.set(1.4, 1.4, 1.4)
        }
    }
}

