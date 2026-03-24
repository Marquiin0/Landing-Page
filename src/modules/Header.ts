import { $, $$ } from '../utils/dom';

export class Header {
  private header: HTMLElement | null = null;
  private hamburger: HTMLElement | null = null;
  private nav: HTMLElement | null = null;
  private navLinks: HTMLElement[] = [];
  private sections: HTMLElement[] = [];
  private backToTop: HTMLElement | null = null;
  private ticking = false;

  init(): void {
    this.header = $('#header');
    this.hamburger = $('#hamburger');
    this.nav = $('#nav');
    this.navLinks = $$('.header__nav-link');
    this.sections = $$('section[id]');
    this.backToTop = $('#back-to-top');

    if (!this.header) return;

    // Scroll behavior - passive for performance
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // Mobile menu toggle
    this.hamburger?.addEventListener('click', () => this.toggleMobileMenu());

    // Nav link clicks close mobile menu
    this.navLinks.forEach((link) => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Back to top
    this.backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Active section tracking
    this.setupIntersectionObserver();

    // Initial scroll check
    this.handleScroll();
  }

  private onScroll = (): void => {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
    }
  };

  private handleScroll(): void {
    const scrollY = window.scrollY;

    // Sticky header style
    if (scrollY > 100) {
      this.header!.classList.add('header--scrolled');
    } else {
      this.header!.classList.remove('header--scrolled');
    }

    // Back to top visibility
    if (scrollY > window.innerHeight) {
      this.backToTop?.classList.add('back-to-top--visible');
    } else {
      this.backToTop?.classList.remove('back-to-top--visible');
    }
  }

  private toggleMobileMenu(): void {
    const isOpen = this.nav?.classList.toggle('nav--open');
    this.hamburger?.classList.toggle('active');
    this.hamburger?.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  private closeMobileMenu(): void {
    this.nav?.classList.remove('nav--open');
    this.hamburger?.classList.remove('active');
    this.hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  private setupIntersectionObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            this.navLinks.forEach((link) => {
              link.classList.toggle(
                'nav-link--active',
                link.getAttribute('href') === `#${id}`
              );
            });
          }
        });
      },
      {
        rootMargin: '-40% 0px -55% 0px',
      }
    );

    this.sections.forEach((section) => observer.observe(section));
  }
}
