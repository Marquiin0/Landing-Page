import { $, $$ } from '../utils/dom';

export class Gallery {
  private lightbox: HTMLDialogElement | null = null;
  private lightboxImg: HTMLImageElement | null = null;
  private images: HTMLImageElement[] = [];
  private currentIndex = 0;

  init(): void {
    this.lightbox = $<HTMLDialogElement>('#lightbox');
    this.lightboxImg = $<HTMLImageElement>('#lightbox-img');
    this.images = $$<HTMLImageElement>('.gallery__item img');

    if (!this.lightbox || this.images.length === 0) return;

    // Open lightbox on image click
    this.images.forEach((img, i) => {
      img.closest('.gallery__item')?.addEventListener('click', () => this.open(i));
    });

    // Close button
    $('.gallery__lightbox-close')?.addEventListener('click', () => this.close());

    // Navigation
    $('.gallery__lightbox-prev')?.addEventListener('click', () => this.prev());
    $('.gallery__lightbox-next')?.addEventListener('click', () => this.next());

    // Keyboard
    this.lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    });

    // Click backdrop to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
  }

  private open(index: number): void {
    this.currentIndex = index;
    this.updateImage();
    this.lightbox?.showModal();
    document.body.style.overflow = 'hidden';
  }

  private close(): void {
    this.lightbox?.close();
    document.body.style.overflow = '';
  }

  private prev(): void {
    this.currentIndex = this.currentIndex === 0 ? this.images.length - 1 : this.currentIndex - 1;
    this.updateImage();
  }

  private next(): void {
    this.currentIndex = this.currentIndex === this.images.length - 1 ? 0 : this.currentIndex + 1;
    this.updateImage();
  }

  private updateImage(): void {
    if (!this.lightboxImg) return;
    const img = this.images[this.currentIndex];
    // Use higher resolution for lightbox
    this.lightboxImg.src = img.src.replace(/w=\d+/, 'w=1200').replace(/h=\d+/, 'h=800');
    this.lightboxImg.alt = img.alt;
  }
}
