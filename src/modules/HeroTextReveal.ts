import { $$ } from '../utils/dom';

export class HeroTextReveal {
  init(): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lines = $$<HTMLElement>('.hero__title-line');
    if (lines.length === 0) return;

    let charIndex = 0;

    lines.forEach((line) => {
      const text = line.textContent || '';
      line.innerHTML = '';

      // Preserve class on line element
      const originalClasses = line.className;
      line.className = originalClasses;

      for (const char of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.style.animationDelay = `${0.8 + charIndex * 0.04}s`;
        span.textContent = char === ' ' ? '\u00A0' : char;

        // Keep text-accent on the accent line
        if (line.classList.contains('text-accent')) {
          span.style.color = 'inherit';
        }

        line.appendChild(span);
        charIndex++;
      }
    });
  }
}
