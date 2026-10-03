/**
 * Warzone Web Destroyer - 2.5D DOM Rigid Body Physics Engine
 * Handles ragdolling titles, chucking cards, gravity acceleration, and shatters in Document DOM coordinates.
 */

class WarzonePhysicsEngine {
  constructor() {
    this.bodies = [];
    this.gravity = 0.65;
    this.airResistance = 0.99;
    this.groundBounce = 0.45;
    this.wallBounce = 0.55;
    this.running = false;
    this.lastTime = 0;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.loop();
  }

  stop() {
    this.running = false;
  }

  clear() {
    this.bodies.forEach(body => {
      if (body.element && body.element.parentNode) {
        body.element.parentNode.removeChild(body.element);
      }
    });
    this.bodies = [];
  }

  /**
   * Spawns a physical thrown DOM object in document coordinates
   */
  addBody({
    element,
    x,
    y,
    vx = 0,
    vy = 0,
    angle = 0,
    vAngle = 0,
    width = 100,
    height = 50,
    mass = 1,
    floorY = null,
    shatterOnFloor = false,
    onImpact = null,
    lifetime = 9000
  }) {
    const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, window.innerHeight);

    const body = {
      id: 'body_' + Math.random().toString(36).substr(2, 9),
      element,
      x,
      y,
      vx,
      vy,
      angle,
      vAngle,
      width,
      height,
      mass,
      floorY: floorY !== null ? floorY : Math.min(docHeight - height - 10, y + window.innerHeight * 0.7),
      shatterOnFloor,
      onImpact,
      bounces: 0,
      createdAt: performance.now(),
      lifetime
    };

    if (element) {
      element.style.position = 'absolute';
      element.style.zIndex = '2147483644';
      element.style.pointerEvents = 'none';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.transform = `rotate(${angle}deg)`;
      element.style.transformOrigin = 'center center';
      element.style.willChange = 'transform, left, top, opacity';
    }

    this.bodies.push(body);
    if (!this.running) this.start();
    return body;
  }

  update(dt) {
    const now = performance.now();
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth, window.innerWidth);

    for (let i = this.bodies.length - 1; i >= 0; i--) {
      const b = this.bodies[i];

      // Age expiration
      if (now - b.createdAt > b.lifetime) {
        if (b.element) {
          b.element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          b.element.style.opacity = '0';
          b.element.style.transform += ' scale(0.5)';
          setTimeout(() => {
            if (b.element && b.element.parentNode) {
              b.element.parentNode.removeChild(b.element);
            }
          }, 600);
        }
        this.bodies.splice(i, 1);
        continue;
      }

      // Kinematic update
      b.vy += this.gravity * (dt / 16.6);
      b.vx *= Math.pow(this.airResistance, dt / 16.6);
      b.vy *= Math.pow(this.airResistance, dt / 16.6);

      b.x += b.vx * (dt / 16.6);
      b.y += b.vy * (dt / 16.6);
      b.angle += b.vAngle * (dt / 16.6);

      // Document Boundaries & Collisions
      const floorLevel = b.floorY;
      if (b.y > floorLevel) {
        b.y = floorLevel;
        b.vy = -b.vy * this.groundBounce;
        b.vAngle *= 0.6;
        b.bounces++;

        if (b.onImpact && Math.abs(b.vy) > 2) {
          b.onImpact(b);
        }

        if (b.shatterOnFloor && (b.bounces > 1 || Math.abs(b.vy) < 2)) {
          // Explode into shrapnel!
          if (window.WarzoneParticles) {
            window.WarzoneParticles.createDebrisShower(b.x, b.y, 20);
          }
          if (window.WarzoneSFX) {
            window.WarzoneSFX.play('shatter');
          }
          if (b.element && b.element.parentNode) {
            b.element.parentNode.removeChild(b.element);
          }
          this.bodies.splice(i, 1);
          continue;
        }

        // Apply floor friction
        b.vx *= 0.88;
        if (Math.abs(b.vy) < 0.5) b.vy = 0;
      }

      // Left and Right Document Walls
      if (b.x < 10) {
        b.x = 10;
        b.vx = -b.vx * this.wallBounce;
        b.vAngle = -b.vAngle * 0.8;
      } else if (b.x > docWidth - b.width - 10) {
        b.x = docWidth - b.width - 10;
        b.vx = -b.vx * this.wallBounce;
        b.vAngle = -b.vAngle * 0.8;
      }

      // Update DOM transform
      if (b.element) {
        b.element.style.left = `${b.x}px`;
        b.element.style.top = `${b.y}px`;
        b.element.style.transform = `rotate(${b.angle}deg)`;
      }
    }
  }

  loop() {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min(now - this.lastTime, 64);
    this.lastTime = now;

    this.update(dt);

    if (this.bodies.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.running = false;
    }
  }
}

window.WarzonePhysics = new WarzonePhysicsEngine();
