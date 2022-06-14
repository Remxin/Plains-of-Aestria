export default class ModelLoader {
    constructor(space, fraction){
        this.fraction = fraction
        this.model_path = null;
        this.space = space
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

        loader.load(`${this.model_path}`, function (gltf) {

            mixer = new THREE.AnimationMixer(gltf);
            console.log("ew lista animacji ",gltf.scene.animations)

            gltf.scene.traverse(function (child) {
                // tu można wykonać dowolną operację dla każdego mesha w modelu
                if (child.isMesh) {
                    console.log(child)
                }

            });
            // dodanie do sceny
            this.space,scene.add(gltf.scene);

        }, undefined, function (error) {
            console.error(error);
        });
    }
}

