import { $, $$, createElement } from '../utils/dom';
import { menuItems } from '../data/menu-data';
import type { MenuItem } from '../data/menu-data';

export class MenuFilter {
  private grid: HTMLElement | null = null;
  private filterBtns: HTMLElement[] = [];
  private currentFilter = 'todos';

  init(): void {
    this.grid = $('#menu-grid');
    this.filterBtns = $$('.menu__filter-btn');

    if (!this.grid) return;

    this.renderCards(menuItems);
    this.bindFilters();
    this.bindTiltEffect();
  }

  private renderCards(items: MenuItem[]): void {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    items.forEach((item) => {
      const card = this.createCard(item);
      this.grid!.appendChild(card);
    });
  }

  private createCard(item: MenuItem): HTMLElement {
    const card = createElement('div', {
      className: 'menu__card',
      'data-category': item.category,
    });

    const badgeHtml = item.badge
      ? `<span class="menu__card-badge menu__card-badge--${item.badge}">${this.badgeLabel(item.badge)}</span>`
      : '';

    card.innerHTML = `
      <div class="menu__card-image">
        ${badgeHtml}
        <img src="${item.image}" alt="${item.name}" loading="lazy" decoding="async" width="400" height="300" />
      </div>
      <div class="menu__card-content">
        <h3 class="menu__card-name">${item.name}</h3>
        <p class="menu__card-description">${item.description}</p>
        <div class="menu__card-footer">
          <span class="menu__card-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
          <button class="menu__card-btn">Pedir</button>
        </div>
      </div>
    `;

    return card;
  }

  private badgeLabel(badge: string): string {
    const labels: Record<string, string> = {
      popular: 'Popular',
      novo: 'Novo',
      promocao: 'Promoção',
    };
    return labels[badge] || badge;
  }

  private bindFilters(): void {
    this.filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter || 'todos';
        if (filter === this.currentFilter) return;

        this.currentFilter = filter;

        // Update active button
        this.filterBtns.forEach((b) => b.classList.remove('menu__filter-btn--active'));
        btn.classList.add('menu__filter-btn--active');

        this.filterCards(filter);
      });
    });
  }

  private filterCards(filter: string): void {
    const cards = $$<HTMLElement>('.menu__card', this.grid!);

    cards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === 'todos' || category === filter;

      if (!shouldShow) {
        card.classList.add('menu__card--hiding');
        setTimeout(() => {
          card.classList.add('menu__card--hidden');
          card.classList.remove('menu__card--hiding');
        }, 300);
      } else {
        card.classList.remove('menu__card--hidden');
        requestAnimationFrame(() => {
          card.classList.remove('menu__card--hiding');
        });
      }
    });
  }

  private bindTiltEffect(): void {
    // Only on desktop, no touch, no reduced motion
    if (
      window.matchMedia('(max-width: 1024px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      'ontouchstart' in window
    ) {
      return;
    }

    let ticking = false;
    let lastCard: HTMLElement | null = null;
    let lastX = 0;
    let lastY = 0;

    this.grid?.addEventListener('mousemove', (e: MouseEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.menu__card');
      if (!card) {
        if (lastCard) this.resetTilt(lastCard);
        lastCard = null;
        return;
      }

      lastCard = card;
      lastX = e.clientX;
      lastY = e.clientY;

      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (lastCard) this.applyTilt(lastCard, lastX, lastY);
          ticking = false;
        });
      }
    }, { passive: true });

    this.grid?.addEventListener('mouseleave', () => {
      if (lastCard) this.resetTilt(lastCard);
      lastCard = null;
    }, { passive: true });
  }

  private applyTilt(card: HTMLElement, clientX: number, clientY: number): void {
    const rect = card.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.setProperty('--tilt-x', `${rotateX}deg`);
    card.style.setProperty('--tilt-y', `${rotateY}deg`);
    card.style.setProperty('--tilt', '1');
  }

  private resetTilt(card: HTMLElement): void {
    card.style.removeProperty('--tilt');
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  }
}
