var emitter = new IAVRA.PARTICLE.Emitter()
	.setCounter({
		start: function(emitter) {},
		update: function(emitter) { return 1; }
	})
	.addBehaviour({
		setup: function(emitter, particle) {
			particle.texture = PIXI.Texture.fromImage('img/particle.png');
			particle.position.set(Graphics.width / 2, Graphics.height / 2);
			particle.life = 200;
		},
		update: function(emitter, particle, index) {
			if(++particle.age > particle.life) { particle.dead = true; }
			particle.velocity.x += Math.random() - 0.5;
			particle.velocity.y += Math.random() - 0.5;
		}
	});