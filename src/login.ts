import './styles/main.css';
import { AuthForm } from './modules/AuthForm';

document.addEventListener('DOMContentLoaded', () => {
  new AuthForm().init();
});
