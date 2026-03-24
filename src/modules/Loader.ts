import { $ } from '../utils/dom';

export class Loader {
  private loader: HTMLElement | null = null;
  private minDisplayTime = 800;
  private startTime = Date.now();

  init(): void {
    this.loader = $('#loader');
    if (!this.loader) return;

    window.addEventListener('load', () => this.hide());

    // Fallback: hide after 4s max
    setTimeout(() => this.hide(), 4000);
  }

  private hide(): void {
    if (!this.loader) return;

    const elapsed = Date.now() - this.startTime;
    const remaining = Math.max(0, this.minDisplayTime - elapsed);

    setTimeout(() => {
      this.loader!.classList.add('loader--hidden');
      this.loader!.addEventListener('transitionend', () => {
        this.loader!.remove();
      }, { once: true });
    }, remaining);
  }
}
