import { $ } from '../utils/dom';
import { menuItems } from '../data/menu-data';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export class Cart {
  private items: CartItem[] = [];
  private drawer: HTMLElement | null = null;
  private backdrop: HTMLElement | null = null;
  private badgeEl: HTMLElement | null = null;
  private itemsContainer: HTMLElement | null = null;
  private totalEl: HTMLElement | null = null;
  private emptyState: HTMLElement | null = null;
  private footerEl: HTMLElement | null = null;
  private toastEl: HTMLElement | null = null;
  private toastTextEl: HTMLElement | null = null;
  private toggleBtn: HTMLElement | null = null;
  private isOpen = false;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    this.injectHTML();
    this.cacheElements();
    this.bindEvents();
    this.render();
  }

  destroy(): void {
    this.drawer?.remove();
    this.backdrop?.remove();
    this.toastEl?.remove();
    this.toggleBtn?.remove();
  }

  // ─── HTML Injection ───

  private injectHTML(): void {
    this.injectCartIcon();
    this.injectDrawer();
    this.injectToast();
  }

  private injectCartIcon(): void {
    const header = $('.header__container');
    if (!header) return;

    const btn = document.createElement('button');
    btn.className = 'header__cart';
    btn.id = 'cart-toggle';
    btn.setAttribute('aria-label', 'Abrir carrinho');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'cart-drawer');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
      </svg>
      <span class="header__cart-badge" id="cart-badge" aria-live="polite" hidden>0</span>
    `;

    // Insert before hamburger (after CTA and Login link)
    const hamburger = $('#hamburger', header);
    if (hamburger) {
      header.insertBefore(btn, hamburger);
    } else {
      header.appendChild(btn);
    }
  }

  private injectDrawer(): void {
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'cart-backdrop';
    backdrop.id = 'cart-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);

    // Drawer
    const drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.id = 'cart-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Carrinho de compras');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="cart-drawer__header">
        <h2 class="cart-drawer__title">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
          </svg>
          Seu Pedido
        </h2>
        <button class="cart-drawer__close" id="cart-close" aria-label="Fechar carrinho">&times;</button>
      </div>
      <div class="cart-drawer__items" id="cart-items"></div>
      <div class="cart-drawer__empty" id="cart-empty">
        <div class="cart-drawer__empty-icon">🛒</div>
        <p class="cart-drawer__empty-text">Seu carrinho está vazio</p>
        <p class="cart-drawer__empty-hint">Adicione itens do cardápio!</p>
      </div>
      <div class="cart-drawer__footer" id="cart-footer" hidden>
        <div class="cart-drawer__total">
          <span class="cart-drawer__total-label">Total</span>
          <span class="cart-drawer__total-value" id="cart-total">R$ 0,00</span>
        </div>
        <button class="cart-drawer__checkout" id="cart-checkout">Finalizar Pedido</button>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  private injectToast(): void {
    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.id = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
      <span class="cart-toast__icon">✓</span>
      <span class="cart-toast__text" id="cart-toast-text"></span>
    `;
    document.body.appendChild(toast);
  }

  // ─── Cache & Bind ───

  private cacheElements(): void {
    this.drawer = $('#cart-drawer');
    this.backdrop = $('#cart-backdrop');
    this.badgeEl = $('#cart-badge');
    this.itemsContainer = $('#cart-items');
    this.totalEl = $('#cart-total');
    this.emptyState = $('#cart-empty');
    this.footerEl = $('#cart-footer');
    this.toastEl = $('#cart-toast');
    this.toastTextEl = $('#cart-toast-text');
    this.toggleBtn = $('#cart-toggle');
  }

  private bindEvents(): void {
    // Cart icon toggle
    this.toggleBtn?.addEventListener('click', () => this.openDrawer());

    // Close button
    $('#cart-close')?.addEventListener('click', () => this.closeDrawer());

    // Backdrop click
    this.backdrop?.addEventListener('click', () => this.closeDrawer());

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.closeDrawer();
    });

    // Delegated click on menu grid for "Pedir" buttons
    const menuGrid = $('#menu-grid');
    menuGrid?.addEventListener('click', (e) => this.onPedirClick(e));

    // Delegated click on cart items for quantity/remove
    this.itemsContainer?.addEventListener('click', (e) => this.onCartItemClick(e));

    // Checkout button
    $('#cart-checkout')?.addEventListener('click', () => {
      this.closeDrawer();
      const contact = $('#contact');
      contact?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Event Handlers ───

  private onPedirClick(e: Event): void {
    const target = e.target as HTMLElement;
    const btn = target.closest('.menu__card-btn');
    if (!btn) return;

    const card = btn.closest<HTMLElement>('.menu__card');
    if (!card) return;

    const itemId = card.dataset.itemId;
    if (!itemId) return;

    const menuItem = menuItems.find((item) => item.id === itemId);
    if (!menuItem) return;

    this.addItem({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
    });

    // Button feedback animation
    const btnEl = btn as HTMLElement;
    btnEl.textContent = '✓ Adicionado';
    btnEl.style.pointerEvents = 'none';
    setTimeout(() => {
      btnEl.textContent = 'Pedir';
      btnEl.style.pointerEvents = '';
    }, 1200);
  }

  private onCartItemClick(e: Event): void {
    const target = e.target as HTMLElement;
    const cartItem = target.closest<HTMLElement>('.cart-item');
    if (!cartItem) return;

    const id = cartItem.dataset.cartId;
    if (!id) return;

    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (!action) return;

    switch (action) {
      case 'increase':
        this.updateQuantity(id, 1);
        break;
      case 'decrease':
        this.updateQuantity(id, -1);
        break;
      case 'remove':
        this.removeItem(id);
        break;
    }
  }

  // ─── State Management ───

  private addItem(item: Omit<CartItem, 'quantity'>): void {
    const existing = this.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.render();
    this.showToast(item.name);
  }

  private removeItem(id: string): void {
    this.items = this.items.filter((i) => i.id !== id);
    this.render();
    if (this.items.length === 0 && this.isOpen) {
      setTimeout(() => this.closeDrawer(), 300);
    }
  }

  private updateQuantity(id: string, delta: number): void {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(id);
      return;
    }
    this.render();
  }

  private getTotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  private getCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ─── Rendering ───

  private render(): void {
    this.renderItems();
    this.renderBadge();
  }

  private renderItems(): void {
    if (!this.itemsContainer || !this.emptyState || !this.footerEl || !this.totalEl) return;

    if (this.items.length === 0) {
      this.itemsContainer.innerHTML = '';
      this.itemsContainer.style.display = 'none';
      this.emptyState.removeAttribute('hidden');
      this.footerEl.setAttribute('hidden', '');
      return;
    }

    this.emptyState.setAttribute('hidden', '');
    this.itemsContainer.style.display = '';
    this.footerEl.removeAttribute('hidden');

    this.itemsContainer.innerHTML = this.items
      .map((item) => this.renderCartItem(item))
      .join('');

    this.totalEl.textContent = `R$ ${this.getTotal().toFixed(2).replace('.', ',')}`;
  }

  private renderCartItem(item: CartItem): string {
    const imgSrc = this.resolveImage(item.image);
    return `
      <div class="cart-item" data-cart-id="${item.id}">
        <img class="cart-item__image" src="${imgSrc}" alt="${item.name}" width="64" height="64" loading="lazy" />
        <div class="cart-item__info">
          <h3 class="cart-item__name">${item.name}</h3>
          <span class="cart-item__price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
          <div class="cart-item__controls">
            <button class="cart-item__qty-btn" data-action="decrease" aria-label="Diminuir quantidade">−</button>
            <span class="cart-item__qty" aria-label="Quantidade">${item.quantity}</span>
            <button class="cart-item__qty-btn" data-action="increase" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
        <button class="cart-item__remove" data-action="remove" aria-label="Remover ${item.name}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
            <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
          </svg>
        </button>
      </div>
    `;
  }

  private resolveImage(src: string): string {
    if (src.startsWith('/')) {
      const base = import.meta.env.BASE_URL;
      return base + src.slice(1);
    }
    return src;
  }

  private renderBadge(): void {
    if (!this.badgeEl) return;

    const count = this.getCount();
    if (count > 0) {
      this.badgeEl.textContent = String(count);
      this.badgeEl.removeAttribute('hidden');
      // Trigger bounce animation
      this.badgeEl.classList.remove('header__cart-badge--bounce');
      void this.badgeEl.offsetWidth; // force reflow
      this.badgeEl.classList.add('header__cart-badge--bounce');
    } else {
      this.badgeEl.setAttribute('hidden', '');
    }
  }

  // ─── Toast ───

  private showToast(itemName: string): void {
    if (!this.toastEl || !this.toastTextEl) return;

    this.toastTextEl.textContent = `${itemName} adicionado ao pedido!`;
    this.toastEl.classList.add('cart-toast--visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl?.classList.remove('cart-toast--visible');
    }, 3000);
  }

  // ─── Drawer Open/Close ───

  private openDrawer(): void {
    if (this.isOpen) return;
    this.isOpen = true;

    this.drawer?.classList.add('cart-drawer--open');
    this.backdrop?.classList.add('cart-backdrop--visible');
    this.drawer?.setAttribute('aria-hidden', 'false');
    this.toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus close button
    const closeBtn = $('#cart-close', this.drawer!);
    closeBtn?.focus();
  }

  private closeDrawer(): void {
    if (!this.isOpen) return;
    this.isOpen = false;

    this.drawer?.classList.remove('cart-drawer--open');
    this.backdrop?.classList.remove('cart-backdrop--visible');
    this.drawer?.setAttribute('aria-hidden', 'true');
    this.toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Return focus to toggle button
    this.toggleBtn?.focus();
  }
}
