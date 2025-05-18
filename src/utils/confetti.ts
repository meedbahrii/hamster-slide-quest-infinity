
// A simple confetti effect for celebrations
interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: {
    x?: number;
    y?: number;
  };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
}

function createElements(root: HTMLElement, elementCount: number, colors: string[]): HTMLElement[] {
  return Array.from({ length: elementCount }).map((_, index) => {
    const element = document.createElement('div');
    const color = colors[index % colors.length];
    element.style.backgroundColor = color;
    element.style.width = '10px';
    element.style.height = '10px';
    element.style.position = 'absolute';
    element.style.borderRadius = '50%';
    element.style.pointerEvents = 'none';
    root.appendChild(element);
    return element;
  });
}

function randomPhysics(angle: number, spread: number, startVelocity: number, random: () => number) {
  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);
  return {
    x: 0,
    y: 0,
    wobble: random() * 10,
    wobbleSpeed: 0.1 + random() * 0.1,
    velocity: startVelocity * 0.5 + random() * startVelocity,
    angle2D: -radAngle + ((0.5 - random()) * radSpread),
    angle3D: -(Math.PI / 4) + random() * (Math.PI / 2),
    tiltAngle: random() * Math.PI
  };
}

function updateFetti(fetti: any, progress: number, decay: number, gravity: number, drift: number) {
  fetti.physics.x += Math.cos(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.y += Math.sin(fetti.physics.angle2D) * fetti.physics.velocity;
  fetti.physics.z += Math.sin(fetti.physics.angle3D) * fetti.physics.velocity;
  fetti.physics.wobble += fetti.physics.wobbleSpeed;
  fetti.physics.velocity *= decay;
  fetti.physics.y += gravity;
  fetti.physics.x += drift;
  fetti.physics.tiltAngle += 0.1;
  
  const { x, y, tiltAngle, wobble } = fetti.physics;
  const wobbleX = x + (10 * Math.cos(wobble));
  const wobbleY = y + (10 * Math.sin(wobble));
  const transform = `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotate3d(1, 0, 0, ${tiltAngle}rad)`;

  fetti.element.style.transform = transform;
  fetti.element.style.opacity = 1 - progress;
}

function animate(root: HTMLElement, fettis: any[], decay: number, gravity: number, drift: number, ticks: number) {
  const totalTicks = ticks;
  let tick = 0;

  function update() {
    fettis.forEach((fetti) => {
      const progress = tick / totalTicks;
      updateFetti(fetti, progress, decay, gravity, drift);
    });

    tick += 1;

    if (tick < totalTicks) {
      requestAnimationFrame(update);
    } else {
      // Clean up elements
      fettis.forEach(fetti => {
        if (fetti.element.parentNode === root) {
          root.removeChild(fetti.element);
        }
      });
    }
  }

  requestAnimationFrame(update);
}

export default function confetti(options: ConfettiOptions = {}): void {
  const {
    particleCount = 50,
    spread = 70,
    startVelocity = 30,
    decay = 0.9,
    gravity = 1,
    drift = 0,
    ticks = 200,
    origin = { x: 0.5, y: 0.5 },
    colors = ['#ff0000', '#ffa500', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'],
    shapes = [],
    scalar = 1,
    zIndex = 100
  } = options;

  // Create container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = zIndex.toString();
  document.body.appendChild(container);

  const fettis = createElements(container, particleCount, colors)
    .map((element) => {
      const rect = container.getBoundingClientRect();
      const initialX = origin.x ? origin.x * rect.width : rect.width / 2;
      const initialY = origin.y ? origin.y * rect.height : rect.height / 2;
      element.style.left = `${initialX}px`;
      element.style.top = `${initialY}px`;
      
      return {
        element,
        physics: randomPhysics(Math.random() * 360, spread, startVelocity, Math.random)
      };
    });

  animate(container, fettis, decay, gravity, drift, ticks);
  
  // Clean up container after animation
  setTimeout(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }, ticks + 100);
}
