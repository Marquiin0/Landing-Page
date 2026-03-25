import { $ } from '../utils/dom';
import { UserState } from '../data/UserState';

export class UserMenu {
  private isOpen = false;
  private dropdown: HTMLElement | null = null;
  private trigger: HTMLElement | null = null;

  init(): void {
    const area = $('#user-area');
    if (!area) return;

    if (!UserState.isLoggedIn()) return;

    const user = UserState.get()!;
    const initials = UserState.getInitials();
    const firstName = UserState.getFirstName();

    // Replace login link with user menu
    area.innerHTML = `
      <div class="user-menu">
        <button class="user-menu__trigger" id="user-trigger" aria-expanded="false" aria-haspopup="true">
          <div class="user-menu__avatar">${initials}</div>
          <span class="user-menu__name">${firstName}</span>
          <svg class="user-menu__arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="user-menu__dropdown" id="user-dropdown">
          <div class="user-menu__header">
            <div class="user-menu__avatar user-menu__avatar--lg">${initials}</div>
            <div class="user-menu__info">
              <span class="user-menu__fullname">${user.name}</span>
              <span class="user-menu__email">${user.email}</span>
            </div>
          </div>
          <div class="user-menu__divider"></div>
          <button class="user-menu__item" data-action="profile">
            <span class="user-menu__item-icon">👤</span>
            <span>Editar Perfil</span>
            <svg class="user-menu__item-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button class="user-menu__item" data-action="settings">
            <span class="user-menu__item-icon">⚙️</span>
            <span>Configurações</span>
            <svg class="user-menu__item-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <button class="user-menu__item" data-action="help">
            <span class="user-menu__item-icon">❓</span>
            <span>Ajuda</span>
            <svg class="user-menu__item-arrow" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div class="user-menu__divider"></div>
          <button class="user-menu__item user-menu__item--logout" data-action="logout">
            <span class="user-menu__item-icon">🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </div>
    `;

    this.trigger = $('#user-trigger');
    this.dropdown = $('#user-dropdown');

    this.bindEvents();
  }

  private bindEvents(): void {
    // Toggle dropdown
    this.trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.dropdown?.contains(e.target as Node)) {
        this.close();
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    // Menu item actions
    this.dropdown?.addEventListener('click', (e) => {
      const item = (e.target as HTMLElement).closest<HTMLElement>('.user-menu__item');
      if (!item) return;

      const action = item.dataset.action;
      switch (action) {
        case 'logout':
          UserState.logout();
          window.location.reload();
          break;
        case 'profile':
        case 'settings':
        case 'help':
          this.showComingSoon();
          this.close();
          break;
      }
    });
  }

  private toggle(): void {
    this.isOpen ? this.close() : this.open();
  }

  private open(): void {
    this.isOpen = true;
    this.dropdown?.classList.add('user-menu__dropdown--open');
    this.trigger?.setAttribute('aria-expanded', 'true');
  }

  private close(): void {
    this.isOpen = false;
    this.dropdown?.classList.remove('user-menu__dropdown--open');
    this.trigger?.setAttribute('aria-expanded', 'false');
  }

  private showComingSoon(): void {
    // Reuse cart toast if available, otherwise create temp toast
    const toast = $('#cart-toast');
    const text = $('#cart-toast-text');
    if (toast && text) {
      text.textContent = 'Em breve! Funcionalidade em desenvolvimento.';
      toast.classList.add('cart-toast--visible');
      setTimeout(() => toast.classList.remove('cart-toast--visible'), 3000);
    }
  }
}
