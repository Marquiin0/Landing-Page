import { $ } from '../utils/dom';
import { menuItems } from '../data/menu-data';
import { CartState } from '../data/CartState';
import type { MenuItem } from '../data/menu-data';

export class ProductPage {
  private item: MenuItem | null = null;
  private quantity = 1;
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return this.showNotFound();

    this.item = menuItems.find((m) => m.id === id) || null;
    if (!this.item) return this.showNotFound();

    this.renderProduct();
    this.renderReviews();
    this.renderRelated();
    this.bindEvents();

    document.title = `${this.item.name} | Sabor da Esquina`;
  }

  private showNotFound(): void {
    const main = $<HTMLElement>('.product-page');
    if (main) {
      main.innerHTML = `
        <div class="container" style="text-align:center;padding:4rem 1rem;">
          <h1 style="font-family:var(--font-display);font-size:var(--text-2xl);color:var(--color-secondary);">Produto não encontrado</h1>
          <p style="color:var(--color-text-muted);margin:1rem 0 2rem;">O produto que você procura não existe ou foi removido.</p>
          <a href="index.html#menu" class="btn btn--primary btn--lg">Ver Cardápio</a>
        </div>
      `;
    }
  }

  private renderProduct(): void {
    const item = this.item!;
    const base = import.meta.env.BASE_URL;

    const resolveImg = (src: string) => src.startsWith('/') ? base + src.slice(1) : src;

    // Breadcrumb
    const crumb = $('#breadcrumb-name');
    if (crumb) crumb.textContent = item.name;

    // Main image
    const mainImg = $<HTMLImageElement>('#product-main-img');
    if (mainImg) {
      const firstImage = item.images?.[0] || item.image;
      mainImg.src = resolveImg(firstImage);
      mainImg.alt = item.name;
    }

    // Badge
    const badge = $('#product-badge');
    if (badge && item.badge) {
      const labels: Record<string, string> = { popular: 'Popular', novo: 'Novo', promocao: 'Promoção' };
      badge.textContent = labels[item.badge] || item.badge;
      badge.removeAttribute('hidden');
      badge.className = `product__badge product__badge--${item.badge}`;
    }

    // Thumbnails
    const thumbsContainer = $('#product-thumbs');
    if (thumbsContainer && item.images && item.images.length > 1) {
      thumbsContainer.innerHTML = item.images.map((img, i) => `
        <button class="product__thumb ${i === 0 ? 'product__thumb--active' : ''}" data-index="${i}">
          <img src="${resolveImg(img)}" alt="${item.name} - foto ${i + 1}" loading="lazy" />
        </button>
      `).join('');
    }

    // Info
    const category = $('#product-category');
    const categoryLabels: Record<string, string> = { lanches: '🍔 Lanches', salgados: '🥟 Salgados', bebidas: '🥤 Bebidas', acai: '🍇 Açaí', porcoes: '🍟 Porções' };
    if (category) category.textContent = categoryLabels[item.category] || item.category;

    const name = $('#product-name');
    if (name) name.textContent = item.name;

    // Rating
    const ratingEl = $('#product-rating');
    if (ratingEl && item.reviews && item.reviews.length > 0) {
      const avg = item.reviews.reduce((s, r) => s + r.rating, 0) / item.reviews.length;
      const stars = '★'.repeat(Math.round(avg)) + '☆'.repeat(5 - Math.round(avg));
      ratingEl.innerHTML = `<span class="product__stars">${stars}</span> <span class="product__rating-text">${avg.toFixed(1)} (${item.reviews.length} avaliações)</span>`;
    }

    // Description
    const desc = $('#product-description');
    if (desc) desc.textContent = item.fullDescription || item.description;

    // Details
    const details = $('#product-details');
    if (details) {
      let html = '';
      if (item.prepTime) html += `<div class="product__detail"><span class="product__detail-icon">⏱️</span><span>Preparo: ${item.prepTime}</span></div>`;
      if (item.ingredients) html += `<div class="product__detail"><span class="product__detail-icon">📋</span><span>Ingredientes: ${item.ingredients.join(', ')}</span></div>`;
      details.innerHTML = html;
    }

    // Price
    const price = $('#product-price');
    if (price) price.textContent = `R$ ${item.price.toFixed(2).replace('.', ',')}`;
  }

  private renderReviews(): void {
    const list = $('#reviews-list');
    const section = $('#product-reviews');
    if (!list || !section) return;

    const reviews = this.item?.reviews;
    if (!reviews || reviews.length === 0) {
      section.setAttribute('hidden', '');
      return;
    }

    list.innerHTML = reviews.map((r) => `
      <div class="review-card">
        <div class="review-card__header">
          <div class="review-card__avatar">${r.name.charAt(0)}</div>
          <div>
            <span class="review-card__name">${r.name}</span>
            <span class="review-card__date">${new Date(r.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <span class="review-card__stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        </div>
        <p class="review-card__comment">${r.comment}</p>
      </div>
    `).join('');
  }

  private renderRelated(): void {
    const grid = $('#related-grid');
    if (!grid || !this.item) return;

    const related = menuItems
      .filter((m) => m.category === this.item!.category && m.id !== this.item!.id)
      .slice(0, 4);

    if (related.length === 0) {
      $('#product-related')?.setAttribute('hidden', '');
      return;
    }

    const base = import.meta.env.BASE_URL;
    const resolveImg = (src: string) => src.startsWith('/') ? base + src.slice(1) : src;

    grid.innerHTML = related.map((item) => `
      <a href="product.html?id=${item.id}" class="related-card">
        <img class="related-card__image" src="${resolveImg(item.image)}" alt="${item.name}" loading="lazy" />
        <h3 class="related-card__name">${item.name}</h3>
        <span class="related-card__price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
      </a>
    `).join('');
  }

  private bindEvents(): void {
    // Quantity
    $('#qty-decrease')?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        this.updateQty();
      }
    });

    $('#qty-increase')?.addEventListener('click', () => {
      this.quantity++;
      this.updateQty();
    });

    // Add to cart
    $('#add-to-cart')?.addEventListener('click', () => {
      if (!this.item) return;
      for (let i = 0; i < this.quantity; i++) {
        CartState.addItem({
          id: this.item.id,
          name: this.item.name,
          price: this.item.price,
          image: this.item.image,
        });
      }
      this.showToast(`${this.quantity}x ${this.item.name} adicionado ao pedido!`);

      const btn = $<HTMLButtonElement>('#add-to-cart');
      if (btn) {
        btn.textContent = '✓ Adicionado!';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '🛒 Adicionar ao Carrinho';
          btn.disabled = false;
        }, 1500);
      }
    });

    // Thumbnail clicks
    $('#product-thumbs')?.addEventListener('click', (e) => {
      const thumb = (e.target as HTMLElement).closest<HTMLElement>('.product__thumb');
      if (!thumb) return;

      const idx = Number(thumb.dataset.index);
      const images = this.item?.images;
      if (!images || !images[idx]) return;

      const base = import.meta.env.BASE_URL;
      const resolveImg = (src: string) => src.startsWith('/') ? base + src.slice(1) : src;

      const mainImg = $<HTMLImageElement>('#product-main-img');
      if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
          mainImg.src = resolveImg(images[idx]);
          mainImg.style.opacity = '1';
        }, 200);
      }

      document.querySelectorAll('.product__thumb').forEach((t) => t.classList.remove('product__thumb--active'));
      thumb.classList.add('product__thumb--active');
    });
  }

  private updateQty(): void {
    const el = $('#qty-value');
    if (el) el.textContent = String(this.quantity);
  }

  private showToast(message: string): void {
    const toast = $('#cart-toast');
    const text = $('#cart-toast-text');
    if (!toast || !text) return;

    text.textContent = message;
    toast.classList.add('cart-toast--visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => toast.classList.remove('cart-toast--visible'), 3000);
  }
}
