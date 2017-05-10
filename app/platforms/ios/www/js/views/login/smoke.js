/* smoke.js */

export default class Smoke {

    constructor(options, parent) {
        var devicePixelRatio = window.devicePixelRatio || 1;
		this.size = this.getSize();
        const defaults = {
            width: window.innerWidth * devicePixelRatio,
            height: this.size * devicePixelRatio
        };

        Object.assign(this, options, defaults);
        this.onResize = this.onResize.bind(this);
        this.parent = parent;

		this._stop = false;

        this.addEventListeners();
        this.init();

    }

    init() {
        const {
            width,
            height
        } = this;

        this.clock = new THREE.Clock();

        const renderer = this.renderer = new THREE.WebGLRenderer();

        renderer.setSize(width, height);

        this.scene = new THREE.Scene();

        const meshGeometry = new THREE.CubeGeometry(200, 200, 200);
        const meshMaterial = new THREE.MeshLambertMaterial({
            color: 0xaa6666,
            wireframe: false
        });
        this.mesh = new THREE.Mesh(meshGeometry, meshMaterial);
        this.cubeSineDriver = 0;

        this.addCamera();
        this.addLights();
        this.addParticles();
        this.addBackground();
        if (this.parent) {
            this.parent[0].appendChild(renderer.domElement);
        } else {

        }
		this.onResize();
    }

	getSize(){
	 	var html = $('html');
		if(html.hasClass('small-device')){
			return 250;
		}
		if(html.hasClass('iPhone6plus')){
			return 300;
		}
		if(html.hasClass('iPad')){
			return 600;
		}

		return 300;
	}

    evolveSmoke(delta) {
        const {
            smokeParticles
        } = this;

        let smokeParticlesLength = smokeParticles.length;

        while (smokeParticlesLength--) {
            smokeParticles[smokeParticlesLength].rotation.z += delta * 0.2;
        }
    }

    addLights() {
        const {
            scene
        } = this;
        const light = new THREE.DirectionalLight(0xffffff, 0.75);

        light.position.set(-1, 0, 1);
        scene.add(light);
    }

    addCamera() {
        const {
            scene
        } = this;
        const camera = this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);

        camera.position.z = 1000;
        scene.add(camera);
    }

    addParticles() {
        const {
            scene
        } = this;
        const textureLoader = new THREE.TextureLoader();
        const smokeParticles = this.smokeParticles = [];

        textureLoader.load('./img/clouds.png', texture => {
            const smokeMaterial = new THREE.MeshLambertMaterial({
                color: 0xffffff,
                map: texture,
                transparent: true
            });
            smokeMaterial.map.minFilter = THREE.LinearFilter;
            const smokeGeometry = new THREE.PlaneBufferGeometry(300, 300);

            const smokeMeshes = [];
            let limit = 50;

            while (limit--) {
                smokeMeshes[limit] = new THREE.Mesh(smokeGeometry, smokeMaterial);
                smokeMeshes[limit].position.set(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 1000 - 100);
                smokeMeshes[limit].rotation.z = Math.random() * 360;
                smokeParticles.push(smokeMeshes[limit]);
                scene.add(smokeMeshes[limit]);
            }
        });
    }

    addBackground() {
        const {
            scene
        } = this;

		const windowWidth = window.innerWidth + 90;
        const windowHeight = this.size;

		const imageWidth = 626;
        const imageHeight = 260;

        var aspect = windowHeight / windowWidth;

        const textureLoader = new THREE.TextureLoader();
        const textGeometry = new THREE.PlaneBufferGeometry(imageWidth * aspect, imageHeight * aspect);

        // Create lights
        var light = new THREE.PointLight(0xEEEEEE);
        light.position.set(20, 0, 20);
        scene.add(light);

        var lightAmb = new THREE.AmbientLight(0x777777);
        scene.add(lightAmb);

        textureLoader.load('./img/main_logo.png', texture => {
            const textMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                color: 0xffffff,
                opacity: 1,
                transparent: true
            });
            textMaterial.map.minFilter = THREE.LinearFilter;

            const text = new THREE.Mesh(textGeometry, textMaterial);
            text.position.z = 750;
            scene.add(text);
        });
    }

    render() {
        const {
            mesh
        } = this;
        let {
            cubeSineDriver
        } = this;

        cubeSineDriver += 0.03;

        mesh.rotation.x += 0.31;
        mesh.rotation.y += 0.13;
        mesh.position.z = 100 + Math.sin(cubeSineDriver) * 600;

        this.renderer.render(this.scene, this.camera);
    }

    update() {
        this.evolveSmoke(this.clock.getDelta());
        this.render();
		if(this._stop){ return; }
        requestAnimationFrame(this.update.bind(this));
    }

	stop() {
		this._stop = true;
	}

	cleanup(){
		this.scene = null;
	    this.projector = null;
	    this.camera = null;
	    this.renderer = null;
	    this.smokeParticles = null;
	    this.mesh = null;
	}

    onResize() {
        const {
            camera
        } = this;

        const windowWidth = window.innerWidth;
        const windowHeight = this.size;

        camera.aspect = windowWidth / windowHeight;
        camera.updateProjectionMatrix();

		var devicePixelRatio = window.devicePixelRatio || 1;

        this.renderer.setSize(windowWidth * devicePixelRatio, windowHeight * devicePixelRatio);
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize);
    }

}
