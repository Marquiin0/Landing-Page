import './styles/main.css';
import { PaymentPage } from './modules/PaymentPage';

document.addEventListener('DOMContentLoaded', () => {
  new PaymentPage().init();
});
