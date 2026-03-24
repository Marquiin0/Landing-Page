import { $, $$ } from '../utils/dom';

export class ContactForm {
  private form: HTMLFormElement | null = null;
  private toast: HTMLElement | null = null;

  init(): void {
    this.form = $<HTMLFormElement>('#contact-form');
    this.toast = $('#contact-toast');

    if (!this.form) return;

    // Real-time validation
    const inputs = $$<HTMLInputElement | HTMLTextAreaElement>('.form__input', this.form);
    inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
          this.validateField(input);
        }
      });
    });

    // Submit
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  private validateField(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    const feedback = input.parentElement?.querySelector('.form__feedback');

    if (input.required && !input.value.trim()) {
      this.showError(input, feedback, 'Este campo é obrigatório');
      return false;
    }

    if (input.type === 'email' && input.value && !input.validity.valid) {
      this.showError(input, feedback, 'Insira um e-mail válido');
      return false;
    }

    if (input.minLength > 0 && input.value.length < input.minLength) {
      this.showError(input, feedback, `Mínimo de ${input.minLength} caracteres`);
      return false;
    }

    // Valid
    input.classList.remove('form__input--error');
    input.classList.add('form__input--valid');
    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('form__feedback--visible');
    }
    return true;
  }

  private showError(
    input: HTMLInputElement | HTMLTextAreaElement,
    feedback: Element | null | undefined,
    message: string
  ): void {
    input.classList.remove('form__input--valid');
    input.classList.add('form__input--error');
    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('form__feedback--visible');
    }
    // Shake animation
    input.style.animation = 'none';
    requestAnimationFrame(() => {
      input.style.animation = 'shake 0.4s ease';
    });
  }

  private handleSubmit(e: Event): void {
    e.preventDefault();
    if (!this.form) return;

    const inputs = $$<HTMLInputElement | HTMLTextAreaElement>('.form__input', this.form);
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Simulate submission
    const submitBtn = $<HTMLButtonElement>('.form__submit', this.form);
    if (submitBtn) {
      submitBtn.classList.add('form__submit--loading');
      submitBtn.disabled = true;
    }

    setTimeout(() => {
      if (submitBtn) {
        submitBtn.classList.remove('form__submit--loading');
        submitBtn.disabled = false;
      }

      // Show toast
      this.toast?.classList.add('contact__toast--visible');
      setTimeout(() => {
        this.toast?.classList.remove('contact__toast--visible');
      }, 4000);

      // Reset form
      this.form!.reset();
      inputs.forEach((input) => {
        input.classList.remove('form__input--valid', 'form__input--error');
      });
    }, 1500);
  }
}
