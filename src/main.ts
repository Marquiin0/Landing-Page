import './styles/main.css';

import { Loader } from './modules/Loader';
import { Header } from './modules/Header';
import { ParallaxEngine } from './modules/Parallax';
import { ScrollAnimator } from './modules/ScrollAnimator';
import { SmoothScroll } from './modules/SmoothScroll';
import { MenuFilter } from './modules/MenuFilter';
import { Carousel } from './modules/Carousel';
import { Gallery } from './modules/Gallery';
import { Counter } from './modules/Counter';
import { ContactForm } from './modules/ContactForm';
import { CustomCursor } from './modules/Cursor';
import { HeroTextReveal } from './modules/HeroTextReveal';
import { IngredientsCarousel } from './modules/IngredientsCarousel';
import { Cart } from './modules/Cart';

interface PageModule {
  init(): void;
  destroy?(): void;
}

const modules: PageModule[] = [
  new Loader(),
  new HeroTextReveal(),
  new Header(),
  new ParallaxEngine(),
  new ScrollAnimator(),
  new SmoothScroll(),
  new IngredientsCarousel(),
  new MenuFilter(),
  new Cart(),
  new Carousel(),
  new Gallery(),
  new Counter(),
  new ContactForm(),
  new CustomCursor(),
];

document.addEventListener('DOMContentLoaded', () => {
  modules.forEach((m) => m.init());
});
