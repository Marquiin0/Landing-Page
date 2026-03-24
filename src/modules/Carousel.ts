import { $, $$, createElement } from '../utils/dom';

export class Carousel {
  private track: HTMLElement | null = null;
  private slides: HTMLElement[] = [];
  private dotsContainer: HTMLElement | null = null;
  private currentIndex = 0;
  private autoplayId: ReturnType<typeof setInterval> | null = null;
  private touchStartX = 0;
  private touchEndX = 0;

  init(): void {
    this.track = $('#testimonials-track');
    this.dotsContainer = $('#testimonials-dots');

    if (!this.track || !this.dotsContainer) return;

    this.slides = $$('.testimonials__slide', this.track);
    if (this.slides.length === 0) return;

    this.createDots();
    this.bindArrows();
    this.bindTouch();
    this.bindHover();
    this.startAutoplay();
  }

  private createDots(): void {
    if (!this.dotsContainer) return;

    this.slides.forEach((_, i) => {
      const dot = createElement('button', {
        className: `testimonials__dot${i === 0 ? ' testimonials__dot--active' : ''}`,
        'aria-label': `Ir para depoimento ${i + 1}`,
      });
      dot.addEventListener('click', () => this.goTo(i));
      this.dotsContainer!.appendChild(dot);
    });
  }

  private bindArrows(): void {
    const prevBtn = $('.testimonials__arrow--prev');
    const nextBtn = $('.testimonials__arrow--next');

    prevBtn?.addEventListener('click', () => this.prev());
    nextBtn?.addEventListener('click', () => this.next());
  }

  private bindTouch(): void {
    if (!this.track) return;

    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe();
    }, { passive: true });
  }

  private handleSwipe(): void {
    const diff = this.touchStartX - this.touchEndX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) this.next();
      else this.prev();
    }
  }

  private bindHover(): void {
    const carousel = $('.testimonials__carousel');
    carousel?.addEventListener('mouseenter', () => this.stopAutoplay());
    carousel?.addEventListener('mouseleave', () => this.startAutoplay());
    carousel?.addEventListener('focusin', () => this.stopAutoplay());
    carousel?.addEventListener('focusout', () => this.startAutoplay());
  }

  private prev(): void {
    const index = this.currentIndex === 0 ? this.slides.length - 1 : this.currentIndex - 1;
    this.goTo(index);
  }

  private next(): void {
    const index = this.currentIndex === this.slides.length - 1 ? 0 : this.currentIndex + 1;
    this.goTo(index);
  }

  private goTo(index: number): void {
    this.currentIndex = index;

    if (this.track) {
      this.track.style.transform = `translateX(-${index * 100}%)`;
    }

    // Update dots
    const dots = $$('.testimonials__dot', this.dotsContainer!);
    dots.forEach((dot, i) => {
      dot.classList.toggle('testimonials__dot--active', i === index);
    });
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.autoplayId = setInterval(() => this.next(), 5000);
  }

  private stopAutoplay(): void {
    if (this.autoplayId) {
      clearInterval(this.autoplayId);
      this.autoplayId = null;
    }
  }

  destroy(): void {
    this.stopAutoplay();
  }
}
