(function(){

    /*UNIT CONVERSIONS


    1 Solar Radius = 100 Three.JS units
    1 Juptier Radius = 10 Three.JS units
    1 AU = 500 ThreeJS Units * (Stellar Radius / 2) + (Stellar Radius (in units) + Planet Size)
    
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
            // var starmat = new THREE.MeshNormalMaterial({color: this.starcolor});
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
        this.drawable.rotation.y += .5 * dt;
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

    Planet.prototype.setup = function(planetData, scene,stsize) {
        // body...
        this.data = planetData;
        this.scene = scene;
        this.starsize = stsize;
        this.determineAttributes();
        if(typeof this.orbit !== 'undefined'){
            this.scene.remove(this.orbit);
        }
        this.orbit = undefined;

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
            this.drawable.position.x = 300;
            this.scale(this.size);
            // this.drawable.material.color.setHex(this.starcolor);         
        }

        this.drawOrbit();
    };

    Planet.prototype.drawOrbit = function() {
        var c1,c2,c3,c4,A1,B1,A2,B2;

        A1 = {x: -this.semiMajorAxis, y: 0};
        A2 = {x: this.semiMajorAxis, y: 0};
        B1 = {x: 0, y: this.minorAxis};
        B1 = {x: 0, y: -this.minorAxis};

        
        this.orbitShape = new THREE.Shape();

        if(this.eccentricity != 0){
            c1 = {x: -this.semiMajorAxis, y: this.minorAxis };
            c2 = {x: this.semiMajorAxis, y: this.minorAxis };
            c3 = {x: this.semiMajorAxis, y: -this.minorAxis };
            c4 = {x: -this.semiMajorAxis, y: -this.minorAxis };

            this.orbitShape.moveTo(A1.x,A1.y);
            this.orbitShape.bezierCurveTo(c1.x,c1.y,c2.x,c2.y,A2.x,A2.y);
            this.orbitShape.bezierCurveTo(c3.x,c3.y,c4.x,c4.y,A1.x,A1.y);            
        }
        else{
            // just draw a normal circle
            this.orbitShape.moveTo( 0, this.semiMajorAxis );
            this.orbitShape.quadraticCurveTo( this.semiMajorAxis, this.semiMajorAxis, this.semiMajorAxis, 0 );
            this.orbitShape.quadraticCurveTo( this.semiMajorAxis, -this.semiMajorAxis, 0, -this.semiMajorAxis );
            this.orbitShape.quadraticCurveTo( -this.semiMajorAxis, -this.semiMajorAxis, -this.semiMajorAxis, 0 );
            this.orbitShape.quadraticCurveTo( -this.semiMajorAxis, this.semiMajorAxis, 0, this.semiMajorAxis );
        }
        console.log("drawing orbit");
        this.drawShape( this.orbitShape, 0xffffff, 0, 0, 0, (Math.PI / 180) * 90, this.inclination, 0, 1 );
    };

    Planet.prototype.drawShape = function(shape, color, x, y, z, rx, ry, rz, s) {
        // body...
        console.log("drawing shape");
        var geometry = shape.createPointsGeometry();
        var material = new THREE.LineBasicMaterial( { linewidth: 10, color: color, transparent: true } );

        console.log(this.orbit);

        this.orbit = new THREE.Line( geometry, material );
        this.orbit.position.set( x, y, z );
        this.orbit.rotation.set( rx, ry, rz );
        this.orbit.scale.set( s, s, s );
        this.scene.add( this.orbit );
    };

    Planet.prototype.update = function(dt) {
        this.drawable.position.x += 1 * dt;
    };

    Planet.prototype.scale = function(scalar) {
        this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = scalar;
    };

    Planet.prototype.determineAttributes = function() {
        // soon to come
        this.determineSize();
        this.determineOrbit();
    };

    Planet.prototype.determineOrbit = function() {
        // 1 AU = 500 ThreeJS Units * (Stellar Radius / 2) + (Stellar Radius (in units) + Planet Radius (in units))

        this.semiMajorAxis = this.data.pl_orbsmax || .5;
        this.semiMajorAxis = this.semiMajorAxis >= .1 ? this.semiMajorAxis : .1;
        this.eccentricity = parseFloat(this.data.pl_orbeccen) || 0;
        this.eccentricity = this.eccentricity >= .2 ? this.eccentricity : 0;
        // if eccentricity is 0 we can just use a perfect circle. In fact anything under .2 can be rounded down to 0 eccen
        // console.log(this.data.pl_orbeccen, this.eccentricity);
        this.inclination = this.data.pl_orbincl || 0;
        this.minorAxis = this.semiMajorAxis;
        this.focusDistance = 0;
        // console.log(this.semiMajorAxis,this.minorAxis);
        if(this.eccentricity != 0){
            this.focusDistance = this.semiMajorAxis * this.eccentricity;
            this.minorAxis = Math.sqrt(Math.abs((this.focusDistance * this.focusDistance) - (this.semiMajorAxis * this.semiMajorAxis)));
            // console.log(this.semiMajorAxis, this.minorAxis);
        }
        this.semiMajorAxis = (500 * this.semiMajorAxis) + ((this.starsize * 100) + (this.size * 10));
        this.minorAxis = (500 * this.minorAxis) + ((this.starsize * 100) + (this.size * 10));
        this.focusDistance = this.focusDistance != 0 ? (500 * this.focusDistance) + ((this.starsize * 100) + (this.size * 10)) : 0;
        console.log(this.semiMajorAxis,this.minorAxis, this.eccentricity, this.focusDistance);
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
        var width = window.innerWidth;
        var height = window.innerHeight;
        this.paused = false;
        this.speed = 1;
        this.ready = false;
        this.lastTick = 0;

        this.star = undefined;
        this.planet = undefined;
        this.planets = [];


        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, width/height, 0.1, 5000);
        // this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 15);
        this.container = document.getElementById('render-container');
        this.container.appendChild(this.renderer.domElement);

        this.ambientLight = new THREE.AmbientLight(0xFFFFFF);
        this.scene.add(this.ambientLight);

        this.stats = new Stats();
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.left = "620px";
        this.container.appendChild(this.stats.domElement);

        this.camera.position.z = 400;
        this.camera.position.y = 50;
        // this.camera.position.z = 0;
        // this.camera.position.y = 1505;
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        // this.tick();
    }

    Sim.prototype.tick = function() {
        // body...
        if(this.lastTick == 0){
            this.lastTick = +new Date();
        }
        var now = +new Date();
        var dt = ((now - this.lastTick) / 1000);

        if(this.ready){
            this.nonSimUpdate(dt);
            if(!this.paused){ this.update(dt * this.speed); }
            this.render();
            this.stats.update();
        } 

        this.lastTick = now;
    };

    Sim.prototype.update = function(dt) {
        // every update in the simulation
        // this.star.rotation.y += 0.01;
        this.star.update(dt);
        this.planet.update(dt);
        // for(var i=0;i<this.planets.length;i++){
        //     this.planets[i].update(dt);
        // }
    };

    Sim.prototype.nonSimUpdate = function(dt){
        // For updates that aren't part of the simulation...
        // Ex: The Camera Movement, panning around a paused simulation
        // and the star scaling, especially important

        if(this.star.scaling){
            this.star.scaleUpdate(dt);
        }
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
        this.createPlanet(system.planets[0],this.star.size);
        this.ready = true;
        console.log(system);

        // Circle

        // var circleRadius = 200;
        // var circleShape = new THREE.Shape();
        // circleShape.moveTo( 0, circleRadius );
        // circleShape.quadraticCurveTo( circleRadius, circleRadius, circleRadius, 0 );
        // circleShape.quadraticCurveTo( circleRadius, -circleRadius, 0, -circleRadius );
        // circleShape.quadraticCurveTo( -circleRadius, -circleRadius, -circleRadius, 0 );
        // circleShape.quadraticCurveTo( -circleRadius, circleRadius, 0, circleRadius );


        // this.addShape( circleShape, 0x00ff11, 0, 0, 0, (Math.PI / 180) * 90, 0, 0, 1 );
    };


    Sim.prototype.createStar = function(system) {
        if(typeof this.star === 'undefined'){
            // if there is no star create a new one
            this.star = new Star();
        }
        this.star.setup(system, this.scene);
    };

    Sim.prototype.createPlanet = function(planetData,starsize) {
        if(typeof this.planet === 'undefined'){
            // if there is no star create a new one
            this.planet = new Planet();
        }
        this.planet.setup(planetData, this.scene, starsize);
    };

    window.Sim = new Sim();
    window.tick = function(){
        requestAnimationFrame(window.tick);
        window.Sim.tick();
    }
    window.tick();



})();