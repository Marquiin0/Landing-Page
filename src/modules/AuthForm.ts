import { $ } from '../utils/dom';

export class AuthForm {
  private loginForm: HTMLFormElement | null = null;
  private registerForm: HTMLFormElement | null = null;
  private tabs: HTMLElement | null = null;
  private heroTitle: HTMLElement | null = null;
  private toastEl: HTMLElement | null = null;
  private toastTextEl: HTMLElement | null = null;
  private currentMode: 'login' | 'register' = 'login';
  private toastTimeout: ReturnType<typeof setTimeout> | null = null;

  init(): void {
    this.loginForm = $<HTMLFormElement>('#login-form');
    this.registerForm = $<HTMLFormElement>('#register-form');
    this.tabs = $('.auth__tabs');
    this.heroTitle = $('#auth-hero-title');
    this.toastEl = $('#auth-toast');
    this.toastTextEl = $('#auth-toast-text');

    if (!this.loginForm || !this.registerForm) return;

    this.bindTabs();
    this.bindForms();
    this.bindPasswordToggles();
    this.bindPasswordStrength();
    this.bindPhoneMask();
    this.bindValidation();
  }

  // ─── Tab Switching ───

  private bindTabs(): void {
    document.querySelectorAll<HTMLElement>('[data-tab]').forEach((el) => {
      el.addEventListener('click', () => {
        const tab = el.dataset.tab as 'login' | 'register';
        if (tab === this.currentMode) return;
        this.toggleMode(tab);
      });
    });
  }

  private toggleMode(mode: 'login' | 'register'): void {
    this.currentMode = mode;

    // Update tabs
    document.querySelectorAll('.auth__tab').forEach((tab) => {
      tab.classList.toggle('auth__tab--active', (tab as HTMLElement).dataset.tab === mode);
    });
    this.tabs?.setAttribute('data-active', mode);

    // Toggle forms
    if (mode === 'login') {
      this.registerForm?.classList.add('auth__form--hidden');
      this.loginForm?.classList.remove('auth__form--hidden');
    } else {
      this.loginForm?.classList.add('auth__form--hidden');
      this.registerForm?.classList.remove('auth__form--hidden');
    }

    // Re-trigger form animation
    const activeForm = mode === 'login' ? this.loginForm : this.registerForm;
    if (activeForm) {
      activeForm.style.animation = 'none';
      void activeForm.offsetWidth;
      activeForm.style.animation = '';
    }

    // Update hero title
    if (this.heroTitle) {
      this.heroTitle.textContent = mode === 'login'
        ? 'Bem-vindo de volta!'
        : 'Junte-se à família!';
    }
  }

  // ─── Form Submit ───

  private bindForms(): void {
    this.loginForm?.addEventListener('submit', (e) => this.handleSubmit(e, 'login'));
    this.registerForm?.addEventListener('submit', (e) => this.handleSubmit(e, 'register'));
  }

  private handleSubmit(e: Event, type: 'login' | 'register'): void {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (!this.validateForm(form)) return;

    // Extra: check password match for register
    if (type === 'register') {
      const pw = $<HTMLInputElement>('#reg-password')?.value || '';
      const confirm = $<HTMLInputElement>('#reg-confirm')?.value || '';
      if (pw !== confirm) {
        this.setFieldError($<HTMLInputElement>('#reg-confirm')!, 'As senhas não coincidem');
        return;
      }

      const terms = form.querySelector<HTMLInputElement>('input[name="terms"]');
      if (terms && !terms.checked) {
        this.showToast('Aceite os termos de uso para continuar', true);
        return;
      }
    }

    // Loading state
    const btn = form.querySelector<HTMLButtonElement>('.auth__submit');
    if (btn) {
      btn.classList.add('auth__submit--loading');
      btn.disabled = true;
    }

    // Simulate API call
    setTimeout(() => {
      if (btn) {
        btn.classList.remove('auth__submit--loading');
        btn.disabled = false;
      }

      if (type === 'login') {
        this.showToast('Login realizado com sucesso!');
      } else {
        this.showToast('Conta criada com sucesso!');
        // Switch to login after register
        setTimeout(() => this.toggleMode('login'), 1500);
      }

      form.reset();
      // Clear validation states
      form.querySelectorAll('.form__input').forEach((input) => {
        input.classList.remove('form__input--valid', 'form__input--error');
      });
      form.querySelectorAll('.form__feedback').forEach((fb) => {
        fb.textContent = '';
      });
    }, 1500);
  }

  // ─── Validation ───

  private bindValidation(): void {
    document.querySelectorAll<HTMLInputElement>('.auth .form__input').forEach((input) => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
          this.validateField(input);
        }
      });
    });
  }

  private validateForm(form: HTMLFormElement): boolean {
    const inputs = form.querySelectorAll<HTMLInputElement>('.form__input');
    let valid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) valid = false;
    });

    if (!valid) {
      // Shake the first invalid input
      const firstError = form.querySelector('.form__input--error');
      if (firstError) {
        firstError.classList.add('shake');
        setTimeout(() => firstError.classList.remove('shake'), 400);
        (firstError as HTMLElement).focus();
      }
    }

    return valid;
  }

  private validateField(input: HTMLInputElement): boolean {
    const value = input.value.trim();
    let error = '';

    if (input.required && !value) {
      error = 'Este campo é obrigatório';
    } else if (input.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'E-mail inválido';
    } else if (input.minLength > 0 && value.length > 0 && value.length < input.minLength) {
      error = `Mínimo ${input.minLength} caracteres`;
    } else if (input.type === 'tel' && value && value.replace(/\D/g, '').length < 10) {
      error = 'Telefone inválido';
    }

    if (error) {
      this.setFieldError(input, error);
      return false;
    }

    input.classList.remove('form__input--error');
    input.classList.add('form__input--valid');
    const feedback = input.closest('.form__group')?.querySelector('.form__feedback');
    if (feedback) feedback.textContent = '';
    return true;
  }

  private setFieldError(input: HTMLInputElement, message: string): void {
    input.classList.remove('form__input--valid');
    input.classList.add('form__input--error');
    const feedback = input.closest('.form__group')?.querySelector('.form__feedback');
    if (feedback) feedback.textContent = message;
  }

  // ─── Password Toggle ───

  private bindPasswordToggles(): void {
    document.querySelectorAll<HTMLButtonElement>('.form__toggle-pw').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        if (!targetId) return;

        const input = document.getElementById(targetId) as HTMLInputElement;
        if (!input) return;

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Ocultar senha' : 'Mostrar senha');

        // Change icon opacity
        btn.style.opacity = isPassword ? '1' : '0.5';
      });
    });
  }

  // ─── Password Strength ───

  private bindPasswordStrength(): void {
    const pwInput = $<HTMLInputElement>('#reg-password');
    const strengthEl = $('#pw-strength');
    const textEl = strengthEl?.querySelector('.auth__pw-text');

    if (!pwInput || !strengthEl || !textEl) return;

    pwInput.addEventListener('input', () => {
      const value = pwInput.value;

      if (!value) {
        strengthEl.classList.remove('auth__pw-strength--visible');
        strengthEl.removeAttribute('data-level');
        return;
      }

      strengthEl.classList.add('auth__pw-strength--visible');

      let level = 0;
      if (value.length >= 6) level++;
      if (value.length >= 8 && /[A-Z]/.test(value)) level++;
      if (/[0-9]/.test(value) && /[a-z]/.test(value)) level++;
      if (/[^A-Za-z0-9]/.test(value) && value.length >= 10) level++;

      level = Math.max(1, level);

      strengthEl.setAttribute('data-level', String(level));

      const labels = ['', 'Fraca', 'Média', 'Forte', 'Muito forte'];
      const colors = ['', 'var(--color-error)', '#FF9800', 'var(--color-accent)', 'var(--color-success)'];
      textEl.textContent = labels[level];
      (textEl as HTMLElement).style.color = colors[level];
    });
  }

  // ─── Phone Mask ───

  private bindPhoneMask(): void {
    const phoneInput = $<HTMLInputElement>('#reg-phone');
    if (!phoneInput) return;

    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');
      if (digits.length > 11) digits = digits.slice(0, 11);

      if (digits.length <= 2) {
        phoneInput.value = digits.length ? `(${digits}` : '';
      } else if (digits.length <= 7) {
        phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
      } else {
        phoneInput.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
      }
    });
  }

  // ─── Toast ───

  private showToast(message: string, isError = false): void {
    if (!this.toastEl || !this.toastTextEl) return;

    this.toastTextEl.textContent = message;
    this.toastEl.classList.toggle('auth__toast--error', isError);
    this.toastEl.querySelector('.auth__toast-icon')!.textContent = isError ? '✕' : '✓';
    this.toastEl.classList.add('auth__toast--visible');

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastEl?.classList.remove('auth__toast--visible');
    }, 4000);
  }
}
