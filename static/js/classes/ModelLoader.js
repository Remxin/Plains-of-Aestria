export default class ModelLoader {
    constructor(space, fraction){
        this.fraction = fraction
        this.model_path = null;
        this.space = space

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
            console.log(_this.space, _this.fraction, 'blablabla')
            _this.space.scene.add(gltf.scene);
            
            let z = window.innerHeight/1.7
            let x = window.innerWidth/2.2
            if(_this.fraction == 'demon'){
                gltf.scene.scale.set(0.2, 0.2, 0.2)
                gltf.scene.position.set(x,310,z)
            } 
            else if(_this.fraction == 'undead'){
                gltf.scene.position.set(x,0,z)
                gltf.scene.scale.set(1.4,1.4,1.4)
            }
            else if(_this.fraction == 'human'){
                gltf.scene.position.set(x,0,z)
                gltf.scene.scale.set(5000, 5000, 5000)
            }
            
            gltf.scene.rotation.y += (Math.PI/180)*180

        }, undefined, function (error) {
            console.error(error);
        });
    }
}

