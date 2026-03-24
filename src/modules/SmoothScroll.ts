import { $$ } from '../utils/dom';

export class SmoothScroll {
  init(): void {
    const links = $$<HTMLAnchorElement>('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const headerHeight = 72;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      });
    });
  }
}
