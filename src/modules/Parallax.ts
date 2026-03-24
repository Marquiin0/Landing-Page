import { $$ } from '../utils/dom';

export class ParallaxEngine {
  private layers: { el: HTMLElement; speed: number }[] = [];
  private ticking = false;

  init(): void {
    // Disable on mobile, touch devices, or reduced motion
    if (
      window.matchMedia('(max-width: 768px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      'ontouchstart' in window
    ) {
      return;
    }

    const elements = $$<HTMLElement>('[data-parallax-speed]');
    this.layers = elements.map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallaxSpeed || '0'),
    }));

    if (this.layers.length === 0) return;

    // Use scroll event with RAF throttle instead of constant loop
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  private onScroll = (): void => {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(this.update);
    }
  };

  private update = (): void => {
    const scrollY = window.scrollY;

    // Only apply parallax when hero is visible
    if (scrollY > window.innerHeight) {
      this.ticking = false;
      return;
    }

    for (const layer of this.layers) {
      const y = -(scrollY * layer.speed);
      layer.el.style.transform = `translate3d(0,${y}px,0)`;
    }

    this.ticking = false;
  };

  destroy(): void {
    window.removeEventListener('scroll', this.onScroll);
  }
}
