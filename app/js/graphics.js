(function(){

    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    var UNITS = {};
    UNITS.STELLAR = 50;
    UNITS.JUPITER = 5;
    UNITS.AU = 1000;
    // 1 Day is = .1 Seconds or 100ms. So over half a minute (36.5 seconds) for one full orbit of Earth
    UNITS.DAY = 100; 

    var TEXTURES = {};
    TEXTURES.CORONA = THREE.ImageUtils.loadTexture( "/app/img/embeds/corona.png", undefined, function(){
        console.log("corona loaded?");
    });
    TEXTURES.CIRCLE = THREE.ImageUtils.loadTexture("/app/img/embeds/circle.png");
    TEXTURES.FADEOFF = THREE.ImageUtils.loadTexture("/app/img/embeds/fadeoff.png");
    TEXTURES.GLOW_PARTICLE = THREE.ImageUtils.loadTexture("/app/img/embeds/glow.png");
    TEXTURES.NEBULA_PARTICLE = THREE.ImageUtils.loadTexture("/app/img/embeds/nebula2.png");


    window.UNITS = UNITS;
    window.TEXTURES = TEXTURES;


    /*UNIT CONVERSIONS


    1 Solar Radius = 50 Three.JS units
    1 Juptier Radius = 10 Three.JS units
    1 AU = 500 ThreeJS Units * (Stellar Radius / 2) + (Stellar Radius (in units) + Planet Size)
    
    In Real Life: 1 Solar Radius = 10 Jupiter Radius = 110 Earth Radius
    In Simulation: 1 Solar Radius = 5 Jupiter Radius = 50 Earth Radius

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
            [25000,60,15,0x5a73ff,0x425fff],  // O
            [11000,18,7,0x5a73ff,0x425fff],   // B
            [7500,3.2,2.5,0x6e9aff,0x5085ff], // A
            [6000,1.7,1.3,0xc0dbff,0x83b0ff], // F
            [5000,1.1,1.1,0xfff3a5,0xffeb6c], // G
            [3500,.8,.9,0xffba78,0xffae61],   // K
            [0,.3,.4,0xff693b,0xff5a27]       // M
        ];
    }

    Star.prototype.info = function() {
        console.log(this);
    };

    Star.prototype.setup = function(starData, scene) {
        // reusable constructor
        this.starData = starData;
        this.determineAttributes();

        // need to draw the corona, fadeoff here as well
        // also need to add particle effects

        if(typeof this.drawable === 'undefined'){
            this.drawable = new THREE.Object3D();
            scene.add(this.drawable);

            var stargeo = new THREE.SphereGeometry(UNITS.STELLAR,32,32);
            var starmat = new THREE.MeshBasicMaterial({color: this.starcolor});
            this.sphereDrawable = new THREE.Mesh(stargeo,starmat);


            this.coronaSprite = new THREE.Sprite( { map: TEXTURES.CORONA, useScreenCoordinates: false, color: 0xffffff } );
            this.coronaSprite.color.setHex(this.glowcolor);
            this.coronaSprite.scale.x = this.coronaSprite.scale.y = this.coronaSprite.scale.x = 140;
            this.coronaSprite.blending = THREE.AdditiveBlending;


            this.fadeOff = new THREE.Sprite( { map: TEXTURES.FADEOFF, useScreenCoordinates: false, color: 0xffffff } );
            this.fadeOff.color.setHex(this.glowcolor);
            this.fadeOff.scale.x = this.fadeOff.scale.y = this.fadeOff.scale.x = 150;
            this.fadeOff.blending = THREE.AdditiveBlending;

            this.drawable.add(this.coronaSprite);
            this.drawable.add(this.fadeOff);
            this.drawable.add(this.sphereDrawable);

            this.scale(this.size);
        }
        else {
            // this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = this.size;
            this.scale(this.size);
            this.sphereDrawable.material.color.setHex(this.starcolor);
            // this.sphereDrawable.color.setHex(this.starcolor);
            this.coronaSprite.color.setHex(this.glowcolor);
            this.fadeOff.color.setHex(this.glowcolor);
            // this.coronaSprite.scale.x = this.coronaSprite.scale.y = this.coronaSprite.scale.x = this.size * 140;

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

        // this.sphereDrawable.scale.x += scaleAmt * 140;
        // this.sphereDrawable.scale.y += scaleAmt * 140;
        // this.sphereDrawable.scale.z += scaleAmt * 140;

        this.coronaSprite.scale.x += scaleAmt * 140;
        this.coronaSprite.scale.y += scaleAmt * 140;
        this.coronaSprite.scale.z += scaleAmt * 140;

        this.fadeOff.scale.x += scaleAmt * 150;
        this.fadeOff.scale.y += scaleAmt * 150;
        this.fadeOff.scale.z += scaleAmt * 150;

        if(Math.abs(this.targetScale - this.drawable.scale.x) <= .005){
            this.scaling = false;
            this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = this.targetScale;
            this.coronaSprite.scale.x = this.coronaSprite.scale.y = this.coronaSprite.scale.z = this.targetScale * 140;
            this.fadeOff.scale.x = this.fadeOff.scale.y = this.fadeOff.scale.z = this.targetScale * 140;
        }
    };

    Star.prototype.update = function(dt) {
        // this.drawable.rotation.y += .5 * dt;
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
            this.glowcolor = this.averages[this.spectralClass][4];
        }
        else if(this.starData.st_teff >= 11000 && this.starData.st_teff < 25000){
            this.spectralClass = 1;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else if(this.starData.st_teff >= 7500 && this.starData.st_teff < 11000){
            this.spectralClass = 2;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else if(this.starData.st_teff >= 6000 && this.starData.st_teff < 7500){
            this.spectralClass = 3;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else if(this.starData.st_teff >= 5300 && this.starData.st_teff < 6000){
            this.spectralClass = 4;
            this.starcolor = 0xFFFFFF;
            this.glowcolor = 0xFFFFFF;
        }
        else if(this.starData.st_teff >= 5000 && this.starData.st_teff < 5300){
            this.spectralClass = 4;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else if(this.starData.st_teff >= 3500 && this.starData.st_teff < 5000){
            this.spectralClass = 5;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else if(this.starData.st_teff >= 1 && this.starData.st_teff < 3500){
            this.spectralClass = 6;
            this.starcolor = this.averages[this.spectralClass][3];
            this.glowcolor = this.averages[this.spectralClass][4];

        }
        else{
            // fall back, make a guess based on radius or size
            if(this.starData.st_rad !== null || this.starData.st_mass !== null){
                for(var i=0;i<7;i++){
                    if(this.starData.st_mass >= this.averages[i][1] || this.starData.st_rad >= this.averages[i][2]){
                        this.spectralClass = i;
                        console.log(this.spectralClass);
                        this.starcolor = this.averages[this.spectralClass][3];
                        this.glowcolor = this.averages[this.spectralClass][4];
                        break;
                    }
                }
            }
            else{
                // if all else fails, its like the sun
                this.spectralClass = 4;
                this.starcolor = this.averages[this.spectralClass][3];
                this.glowcolor = this.averages[this.spectralClass][4];
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
            this.size = 1 + ((Math.random() / 5) - .1);
        }
        // if not use the average size given the temp and color
    };





    var Planet = function(){
        console.log("New Planet Created");
        this.drawableAdded = false;
    }


    Planet.prototype.info = function() {
        console.log(this);
    };

    Planet.prototype.setup = function(planetData, scene,stsize,star) {
        // body...
        this.data = planetData;
        this.scene = scene;
        this.star = star;
        this.starsize = stsize;
        this.angle = 0;
        this.velocity = 5; // The speed that the planet is orbiting at
        this.determineAttributes();
        if(typeof this.orbit !== 'undefined'){
            this.scene.remove(this.orbit);
        }
        this.orbit = undefined;

        if(typeof this.drawable === 'undefined'){
            var geo = new THREE.SphereGeometry(UNITS.JUPITER,32,32);
            var mat = new THREE.MeshBasicMaterial({color: 0x00FF00});
            this.drawable = new THREE.Mesh(geo,mat);
            scene.add(this.drawable);
            this.drawableAdded = true;
            this.scale(this.size);
        }
        else if(this.drawableAdded){
            this.scale(this.size);
        }
        else {
            scene.add(this.drawable);
            this.scale(this.size);       
            this.drawableAdded = true;
        }

        this.drawOrbit(60);
    };

    Planet.prototype.recycle = function() {
        this.scene.remove(this.drawable);
        this.scene.remove(this.orbit);
        this.drawableAdded = false;
    };

    Planet.prototype.drawOrbit = function(segments) {
        
        // this.orbitShape = new THREE.Shape();

        var segLength = 360 / segments;
        this.orbitShape = new THREE.Shape();

        var a = Math.PI / 180 * 0;
        var x = this.focusDistance + Math.cos(a) * this.semiMajorAxis;
        var z = Math.sin(a) * this.minorAxis;

        var startx = x;
        var startz = z;

        this.orbitShape.moveTo(x,z);

        for(var i=1;i<segments;i++){
            a = Math.PI / 180 * (segLength * i);
            x = this.focusDistance + Math.cos(a) * this.semiMajorAxis;
            z = Math.sin(a) * this.minorAxis;
            this.orbitShape.lineTo(x,z);
        }

        this.orbitShape.lineTo(startx,startz);

        console.log("eccentricity: " + this.eccentricity);
        this.inclination = 0;
        this.drawShape( this.orbitShape, 0xffffff, 0, 0, 0, (Math.PI / 180) * 90, this.inclination, 0, 1 );
    };

    Planet.prototype.drawShape = function(shape, color, x, y, z, rx, ry, rz, s) {
        // body...
        console.log("drawing shape");
        var geometry = shape.createPointsGeometry();
        var material = new THREE.LineBasicMaterial( { linewidth: 10, color: color, transparent: true } );

        this.orbit = new THREE.Line( geometry, material );
        this.orbit.position.set( x, y, z );
        this.orbit.rotation.set( rx, ry, rz );
        this.orbit.scale.set( s, s, s );
        this.scene.add( this.orbit );
    };

    Planet.prototype.update = function(dt) {
        // position along the orbit
        var a = Math.PI / 180 * this.angle;
        this.drawable.position.x = this.focusDistance + Math.cos(a)*this.semiMajorAxis;
        this.drawable.position.z = Math.sin(a) * this.minorAxis;

        if(this.eccentricity != 0 || this.velocity === null){
            // Don't need to calculate if the orbit is a circle
            var d = this.drawable.position.distanceTo(this.star.drawable.position);
            this.velocity =  1/d * this.orbitalEnergy;
            // console.log(this.velocity);
        }
        this.angle += this.velocity * dt;
    };

    Planet.prototype.scale = function(scalar) {
        this.drawable.scale.x = this.drawable.scale.y = this.drawable.scale.z = scalar;
    };

    Planet.prototype.determineAttributes = function() {
        // soon to come
        this.determineSize();
        this.determineOrbit();
        this.determineVelocity();
        // console.log(this.data);
    };

    Planet.prototype.determineVelocity = function() {
        this.period = parseFloat(this.data.pl_orbper);
        this.orbitalEnergy = (1 / this.period) * 100000;
        if(this.eccentricity == 0){
            this.velocity = null;
        }
    };

    Planet.prototype.determineOrbit = function() {
        // 1 AU = 500 ThreeJS Units * (Stellar Radius / 2) + (Stellar Radius (in units) + Planet Radius (in units))

        if(this.data.pl_orbsmax){
            this.semiMajorAxis = this.data.pl_orbsmax;
        }
        else{
            if(this.data.pl_orbper){
                this.semiMajorAxis = parseFloat(this.data.pl_orbper) / 1000;
            }
            else{
                this.semiMajorAxis = .5;
            }
        }
        console.log(this.semiMajorAxis);
        this.semiMajorAxis = this.semiMajorAxis >= .01 ? this.semiMajorAxis : .01;
        this.eccentricity = parseFloat(this.data.pl_orbeccen) || 0;
        this.eccentricity = this.eccentricity >= .2 ? this.eccentricity : 0;
        // if eccentricity is 0 we can just use a perfect circle. In fact anything under .2 can be rounded down to 0 eccen
        // console.log(this.data.pl_orbeccen, this.eccentricity);
        this.inclination = this.data.pl_orbincl || 0;
        this.minorAxis = this.semiMajorAxis;
        this.focusDistance = 0;
        if(this.eccentricity != 0){
            this.focusDistance = this.semiMajorAxis * this.eccentricity;
            this.minorAxis = Math.sqrt(Math.abs((this.focusDistance * this.focusDistance) - (this.semiMajorAxis * this.semiMajorAxis)));
            // console.log(this.semiMajorAxis, this.minorAxis);
        }
        this.semiMajorAxis = (UNITS.AU * this.semiMajorAxis) + ((this.starsize * UNITS.STELLAR) + (this.size * UNITS.JUPITER));
        this.minorAxis = (UNITS.AU * this.minorAxis) + ((this.starsize * UNITS.STELLAR) + (this.size * UNITS.JUPITER));
        this.focusDistance = this.focusDistance != 0 ? (UNITS.AU * this.focusDistance) + ((this.starsize * UNITS.STELLAR * .7) + (this.size * UNITS.JUPITER)) : 0;

        // this.semiMajorAxis = (UNITS.AU * this.semiMajorAxis);
        // this.minorAxis = (UNITS.AU * this.minorAxis);
        // this.focusDistance = this.focusDistance != 0 ? (UNITS.AU * this.focusDistance) : 0;
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

        this.targetPan = new THREE.Vector3(0,0,0);
        this.deltaTargetPan = new THREE.Vector3(0,0,0);
        this.panning = false;

        this.star = undefined;
        this.planet = undefined;
        this.planets = [];
        this.planetPool = [];
        this.planetsLength = 0;

        this.container = document.getElementById('render-container');

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(70, width/height, 0.1, 20000);
        // this.camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);

        this.controls = new THREE.OrbitControls(this.camera, this.container);
        // this.controls.addEventListener( 'change', this.render );
        // this.controls = new THREE.RollControls(this.camera, this.container);
        // this.controls.movementSpeed = 100;
        // this.controls.lookSpeed = 3;
        // this.controls.constrainVertical = [ -0.5, 0.5 ];
        // this.controls.mouseLook = false;

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth - 30, window.innerHeight - 15);
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
        this.camera.lookAt(this.scene.position);

        var particleCount = 8,
            particles = new THREE.Geometry(),
            pMaterial =
              new THREE.ParticleBasicMaterial({
                color: 0xFFFFFF,
                size: 20,
                map: TEXTURES.GLOW_PARTICLE,
                // blending: THREE.AdditiveBlending,
                transparent: true,
                depthTest: false
              });

        // // now create the individual particles
        // for(var p = 0; p < particleCount; p++) {
        //     console.log('particle');
        //   // create a particle with random
        //   // position values, -250 -> 250
        //   var pX = Math.random() * 75 - 33,
        //       pY = Math.random() * 75 - 33,
        //       pZ = Math.random() * 75 - 33,
        //       particle = new THREE.Vector3(pX, pY, pZ);

        //   // add it to the geometry
        //   // particles.vertices.push(particle);
        // }

        // create the particle system
        var particleSystem =
          new THREE.ParticleSystem(
            particles,
            pMaterial);

        this.scene.add(particleSystem);
        // this.particles = particles;
        // this.particleSystem = particleSystem;

        document.addEventListener( 'mousemove', this.mousemove, false );
        // this.tick();
    }

    Sim.prototype.mousemove = function(e) {
        
    };

    Sim.prototype.reload = function(system) {
        // Used for reloading the Simulation of the same system with new settings
        // that can't be changed during the simulation on the fly.
    };

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
        // this.planet.update(dt);
        for(var i=0;i<this.planetsLength;i++){
            this.planets[i].update(dt);
        }
    };

    Sim.prototype.nonSimUpdate = function(dt){
        // For updates that aren't part of the simulation...
        // Ex: The Camera Movement, panning around a paused simulation
        // and the star scaling, especially important
        this.controls.update(dt);
        if(this.star.scaling){
            // When new stars are selected they need to animate their size
            // This includes when the sim is paused
            this.star.scaleUpdate(dt);
        }
        if(this.panning){
            // Animate the panning of the camera to one of the auto repositions
            this.deltaTargetPan.sub(this.targetPan, this.camera.position);
            if(this.deltaTargetPan.length() <= 2){
                this.panning = false;
                this.camera.position.set(this.targetPan.x, this.targetPan.y, this.targetPan.z);
            }
            else{
                this.deltaTargetPan.multiplyScalar(5 * dt);
                this.camera.position.addSelf(this.deltaTargetPan);
                this.camera.lookAt(this.scene.position);
            }
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
        // Remove all the planets from the planets array and put them in the pool
        this.emptyPlanets();
        // Reuse the Pooled Planets or create new ones
        this.createPlanets(system);
        this.ready = true;
        console.log(system);
        this.planetsLength = this.planets.length;
    };

    Sim.prototype.createStar = function(system) {
        if(typeof this.star === 'undefined'){
            // if there is no star create a new one
            this.star = new Star();
        }
        this.star.setup(system, this.scene);
    };

    Sim.prototype.createPlanets = function(system) {
        // body...
        var p = system.planets.length;
        for(var i=0;i<p;i++){
            var planet = this.createPlanet();
            planet.setup(system.planets[i], this.scene, this.star.size, this.star);
            this.planets.push(planet);
        }
    };

    Sim.prototype.createPlanet = function() {
        // factory that returns a planet, either new or from pool

        if(this.planetPool.length > 0){
            return this.planetPool.shift();
        }
        else{
            return new Planet();
        }
    };

    Sim.prototype.emptyPlanets = function() {
        // Remove all planets from array and add to the planet pool
        while(this.planets.length > 0){
            this.planets[0].recycle();
            this.planetPool.push(this.planets.shift());
        }
    };

    Sim.prototype.hideOrbitLines = function(){
        for(var i=0;i<this.planets.length;i++){
            this.planets[i].orbit.visible = false;
        }
    };

    Sim.prototype.showOrbitLines = function() {
        for(var i=0;i<this.planets.length;i++){
            this.planets[i].orbit.visible = true;
        }
    };

    Sim.prototype.panCamera = function(x,y,z) {
        this.targetPan.set(x,y,z);
        this.panning = true;
    };

    window.Sim = new Sim();
    window.tick = function(){
        requestAnimFrame(window.tick);
        window.Sim.tick();
    }
    window.tick();



})();