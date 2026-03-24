import { $$ } from '../utils/dom';

export class ScrollAnimator {
  init(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = $$<HTMLElement>('[data-animate]');
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    elements.forEach((el) => observer.observe(el));
  }
}
