export function $<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T | null {
  return scope.querySelector<T>(selector);
}

export function $$<T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document
): T[] {
  return Array.from(scope.querySelectorAll<T>(selector));
}

export function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement | Window | Document,
  event: K,
  handler: (e: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): void {
  el.addEventListener(event, handler as EventListener, options);
}

export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  children?: (HTMLElement | string)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (key === 'className') {
        el.className = value;
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  if (children) {
    for (const child of children) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    }
  }
  return el;
}
