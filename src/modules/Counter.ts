import { $$ } from '../utils/dom';
import { easeOutCubic } from '../utils/easing';

export class Counter {
  private duration = 2000;

  init(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Just show final values
      $$<HTMLElement>('[data-counter]').forEach((el) => {
        el.textContent = el.dataset.counter || '0';
      });
      return;
    }

    const elements = $$<HTMLElement>('[data-counter]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animate(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => observer.observe(el));
  }

  private animate(el: HTMLElement): void {
    const target = parseFloat(el.dataset.counter || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / this.duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * target;

      el.textContent = decimals > 0
        ? current.toFixed(decimals).replace('.', ',')
        : Math.floor(current).toString();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }
}
