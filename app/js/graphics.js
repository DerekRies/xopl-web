(function(){

    /*UNIT CONVERSIONS


    1 Solar Radius = 100 Three.JS units
    1 Juptier Radius = 10 Three.JS units
    
    1 Solar Radius = .1 Jupiter Radius = .01 Earth Radius

    Sun is about 110x the size of Earth, 10x the size of Jupiter
    Jupiter is about 10x the size of the Earth

    KOI-55 is .2 Solar Radii
    so it is about 20 ThreeJS units

    KOI-55 b is about .067 Jupiter Radii
    so it is about .67 ThreeJS units

    */

    var Star = function(){
        console.log("NEW STAR CREATED");
        this.averages = [
        // [temp, mass, radius] // Spectral Class
            [25000,60,15,0x5a73ff],  // O
            [11000,18,7,0x5a73ff],   // B
            [7500,3.2,2.5,0x6e9aff], // A
            [6000,1.7,1.3,0x8bb5ff], // F
            [5000,1.1,1.1,0xfff3a5], // G
            [3500,.8,.9,0xffba78],   // K
            [0,.3,.4,0xff693b]       // M
        ];
    }

    Star.prototype.info = function() {
        console.log(this);
    };

    Star.prototype.setup = function(starData, scene) {
        // reusable constructor
        this.starData = starData;
        this.determineAttributes();

        if(typeof this.drawable === 'undefined'){
            var stargeo = new THREE.SphereGeometry(100,32,32);
            var starmat = new THREE.MeshBasicMaterial({color: this.starcolor});
            this.drawable = new THREE.Mesh(stargeo,starmat);
            scene.add(this.drawable);
            this.scale(this.size);
        }
        else {
            // this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = this.size;
            this.scale(this.size);
            this.drawable.material.color.setHex(this.starcolor);         
        }
    };

    Star.prototype.scale = function(scalar) {
        this.targetScale = parseFloat(scalar);
        this.startScale = this.drawable.scale.x;
        this.scaling = true;
    }

    Star.prototype.scaleUpdate = function(dt) {

        var dScale = this.targetScale - this.drawable.scale.x;
        var scaleAmt = dScale * dt * 8;
        this.drawable.scale.x += scaleAmt;
        this.drawable.scale.y += scaleAmt;
        this.drawable.scale.z += scaleAmt;

        if(Math.abs(this.targetScale - this.drawable.scale.x) <= .005){
            this.scaling = false;
            this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = this.targetScale;
        }
    };

    Star.prototype.update = function(dt) {
        if(this.scaling){
            this.scaleUpdate(dt);
        }
    };

    Star.prototype.determineAttributes = function() {
        this.determineColor();
        this.determineSize();
    };

    Star.prototype.determineColor = function() {
        // determine color given spectral class and temperature
        if(this.starData.st_teff >= 25000){
            this.spectralClass = 0;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 11000 && this.starData.st_teff < 25000){
            this.spectralClass = 1;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 7500 && this.starData.st_teff < 11000){
            this.spectralClass = 2;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 6000 && this.starData.st_teff < 7500){
            this.spectralClass = 3;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 5500 && this.starData.st_teff < 6000){
            this.spectralClass = 4;
            this.starcolor = 0xFFFFFF;
        }
        else if(this.starData.st_teff >= 5000 && this.starData.st_teff < 5500){
            this.spectralClass = 4;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 3500 && this.starData.st_teff < 5000){
            this.spectralClass = 5;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else if(this.starData.st_teff >= 1 && this.starData.st_teff < 3500){
            this.spectralClass = 6;
            this.starcolor = this.averages[this.spectralClass][3];
        }
        else{
            // fall back, make a guess based on radius or size
            if(this.starData.st_rad !== null || this.starData.st_mass !== null){
                for(var i=0;i<7;i++){
                    if(this.starData.st_mass >= this.averages[i][1] || this.starData.st_rad >= this.averages[i][2]){
                        this.spectralClass = i;
                        this.starcolor = 0x5a73ff;
                        break;
                    }
                }
            }
            else{
                // if all else fails, its like the sun
                this.spectralClass = 4;
                this.starcolor = this.averages[this.spectralClass][3];
            }
        }

    };

    Star.prototype.determineSize = function() {
        // body...
        // determine size is easy if radius is given
        if(this.starData.st_rad !== null){
            this.size = parseFloat(this.starData.st_rad);
        }
        else{
            this.size = 1;
        }
        // if not use the average size given the temp and color
    };


    var Planet = function(){
        console.log("New Planet Created");
    }


    Planet.prototype.info = function() {
        console.log(this);
    };

    Planet.prototype.setup = function(planetData, scene) {
        // body...
        this.data = planetData;
        this.determineAttributes();

        if(typeof this.drawable === 'undefined'){
            var geo = new THREE.SphereGeometry(10,32,32);
            var mat = new THREE.MeshBasicMaterial({color: 0x00FF00});
            this.drawable = new THREE.Mesh(geo,mat);
            this.drawable.position.x = 300;
            scene.add(this.drawable);
            this.scale(this.size);
        }
        else {
            // this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = this.size;
            this.scale(this.size);
            // this.drawable.material.color.setHex(this.starcolor);         
        }
    };

    Planet.prototype.scale = function(scalar) {
        this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = scalar;
    };

    Planet.prototype.determineAttributes = function() {
        // soon to come
        this.determineSize();
    };

    Planet.prototype.determineSize = function() {
        this.size = this.data.pl_radj || 1;
    };

    Planet.prototype.hide = function() {
        this.drawable.visible = false;
    };

    Planet.prototype.show = function() {
        this.drawable.visible = true;
    };

    Planet.prototype.toggleVisible = function() {
       this.drawable.visible = !this.drawable.visible;
    };

    var Sim = function(){}

    Sim.prototype.init = function(){
        this.paused = false;
        this.speed = 1;
        this.ready = false;
        this.lastTick = 0;

        this.star = undefined;
        this.planets = [];


        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 15);
        this.container = document.getElementById('render-container');
        this.container.appendChild(this.renderer.domElement);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = "620px";
        this.container.appendChild(this.stats.domElement);

        this.camera.position.z = 400;
        this.camera.position.y = 0;
        // this.tick();
    }

    Sim.prototype.tick = function() {
        // body...
        if(this.lastTick == 0){
            this.lastTick = +new Date();
        }
        var now = +new Date();
        var dt = ((now - this.lastTick) / 1000) * this.speed;

        if(this.ready){
            this.nonSimUpdate(dt);
            if(!this.paused){ this.update(dt); }
            this.render();
            this.stats.update();
        } 

        this.lastTick = now;
    };

    Sim.prototype.update = function(dt) {
        // every update in the simulation
        // this.star.rotation.y += 0.01;
        this.star.update(dt);
        // for(var i=0;i<this.planets.length;i++){
        //     this.planets[i].update(dt);
        // }
    };

    Sim.prototype.nonSimUpdate = function(dt){
        // For updates that aren't part of the simulation...
        // Ex: The Camera Movement, panning around a paused simulation
    };

    Sim.prototype.render = function() {
        // every frame
        this.renderer.render(this.scene,this.camera);
    };

    Sim.prototype.loadSystem = function(system) {
        // Creates the system to be rendered, reusing the star.
        // Recycle or create Star
        // Create Planets
        this.createStar(system);
        this.createPlanet(system.planets[0]);
        this.ready = true;
        console.log(system);
    };

    Sim.prototype.createStar = function(system) {
        if(typeof this.star === 'undefined'){
            // if there is no star create a new one
            this.star = new Star();
        }
        this.star.setup(system, this.scene);
    };

    Sim.prototype.createPlanet = function(planetData) {
        if(typeof this.planet === 'undefined'){
            // if there is no star create a new one
            this.planet = new Planet();
        }
        this.planet.setup(planetData, this.scene);
    };

    window.Sim = new Sim();
    window.tick = function(){
        requestAnimationFrame(window.tick);
        window.Sim.tick();
    }
    window.tick();



})();