import { $ } from '../utils/dom';

export class CustomCursor {
  private cursor: HTMLElement | null = null;
  private rafId: number | null = null;
  private mouseX = 0;
  private mouseY = 0;
  private currentX = 0;
  private currentY = 0;
  private isMoving = false;
  private stopTimer: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    // Only on desktop with fine pointer and no reduced motion
    if (
      !window.matchMedia('(pointer: fine)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.innerWidth < 1024
    ) {
      // Remove cursor element entirely if not needed
      document.getElementById('cursor')?.remove();
      return;
    }

    this.cursor = $('#cursor');
    if (!this.cursor) return;

    document.body.classList.add('custom-cursor-active');

    document.addEventListener('mousemove', this.onMouseMove, { passive: true });
    document.addEventListener('mousedown', this.onMouseDown, { passive: true });
    document.addEventListener('mouseup', this.onMouseUp, { passive: true });
    document.addEventListener('mouseover', this.onMouseOver, { passive: true });
    document.addEventListener('mouseout', this.onMouseOut, { passive: true });
  }

  private onMouseMove = (e: MouseEvent): void => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    if (!this.isMoving) {
      this.isMoving = true;
      this.tick();
    }

    // Stop animation loop 100ms after last mouse movement
    if (this.stopTimer) clearTimeout(this.stopTimer);
    this.stopTimer = setTimeout(() => {
      this.isMoving = false;
    }, 100);
  };

  private tick = (): void => {
    if (!this.isMoving || !this.cursor) return;

    // Simple lerp - fast enough to feel responsive
    this.currentX += (this.mouseX - this.currentX) * 0.2;
    this.currentY += (this.mouseY - this.currentY) * 0.2;

    this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;

    this.rafId = requestAnimationFrame(this.tick);
  };

  private onMouseDown = (): void => {
    this.cursor?.classList.add('cursor--clicking');
  };

  private onMouseUp = (): void => {
    this.cursor?.classList.remove('cursor--clicking');
  };

  private onMouseOver = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select, [role="button"]')) {
      this.cursor?.classList.add('cursor--hovering');
    }
  };

  private onMouseOut = (e: MouseEvent): void => {
    const target = e.target as HTMLElement;
    if (target.closest('a, button, input, textarea, select, [role="button"]')) {
      this.cursor?.classList.remove('cursor--hovering');
    }
  };

  destroy(): void {
    this.isMoving = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.stopTimer) clearTimeout(this.stopTimer);
    document.removeEventListener('mousemove', this.onMouseMove);
  }
}
