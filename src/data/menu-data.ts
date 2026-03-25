export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'lanches' | 'salgados' | 'bebidas' | 'acai' | 'porcoes';
  image: string;
  badge?: 'popular' | 'novo' | 'promocao';
  images?: string[];
  fullDescription?: string;
  ingredients?: string[];
  prepTime?: string;
  reviews?: Review[];
}

export const menuItems: MenuItem[] = [
  {
    id: 'x-burguer',
    name: 'X-Burguer Clássico',
    description: 'Pão artesanal, hambúrguer 180g, queijo cheddar, alface, tomate e molho especial.',
    price: 22.90,
    category: 'lanches',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    badge: 'popular',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
    ],
    fullDescription: 'Nosso clássico e mais amado hambúrguer! Preparado com pão artesanal feito diariamente, hambúrguer de 180g de carne bovina selecionada grelhado na chapa, queijo cheddar derretido na medida certa, alface crespa fresquinha, tomate maduro fatiado e nosso molho especial secreto que é a marca registrada da casa. Acompanha batata palito crocante.',
    ingredients: ['Pão artesanal', 'Hambúrguer 180g', 'Queijo cheddar', 'Alface', 'Tomate', 'Molho especial'],
    prepTime: '12-15 min',
    reviews: [
      { name: 'Ana Clara', rating: 5, comment: 'Melhor X-Burguer da cidade! O molho especial é incrível.', date: '2024-12-15' },
      { name: 'Pedro H.', rating: 5, comment: 'Carne suculenta e pão muito bom. Virei cliente fiel!', date: '2024-11-20' },
      { name: 'Juliana C.', rating: 4, comment: 'Muito gostoso, só poderia ter mais molho. De resto, perfeito!', date: '2024-10-05' },
      { name: 'Lucas M.', rating: 5, comment: 'Sabor inigualável. Sempre peço quando venho aqui.', date: '2024-09-28' },
    ],
  },
  {
    id: 'x-bacon',
    name: 'X-Bacon Especial',
    description: 'Pão artesanal, hambúrguer 180g, bacon crocante, queijo, cebola caramelizada.',
    price: 28.90,
    category: 'lanches',
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&h=600&fit=crop',
    ],
    fullDescription: 'Para os amantes de bacon! Nosso X-Bacon traz fatias generosas de bacon crocante defumado artesanalmente, combinado com hambúrguer suculento de 180g, queijo derretido e cebola caramelizada no ponto certo. Tudo isso em nosso pão artesanal macio por dentro e levemente tostado.',
    ingredients: ['Pão artesanal', 'Hambúrguer 180g', 'Bacon crocante', 'Queijo', 'Cebola caramelizada'],
    prepTime: '15-18 min',
    reviews: [
      { name: 'Rafael S.', rating: 5, comment: 'O bacon é absurdamente crocante! Top demais.', date: '2024-12-01' },
      { name: 'Marcos O.', rating: 5, comment: 'A cebola caramelizada dá um toque especial incrível.', date: '2024-11-15' },
    ],
  },
  {
    id: 'x-tudo',
    name: 'X-Tudo da Casa',
    description: 'O lanche completo: hambúrguer duplo, bacon, ovo, presunto, queijo, salada.',
    price: 34.90,
    category: 'lanches',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop',
    badge: 'popular',
    images: [
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800&h=600&fit=crop',
    ],
    fullDescription: 'O rei do cardápio! Duas carnes de 180g cada, bacon crocante, ovo na chapa, presunto, queijo cheddar duplo, alface, tomate, cebola, milho, ervilha, batata palha e nosso molho especial. É o lanche mais completo e generoso que você vai encontrar.',
    ingredients: ['Pão artesanal', 'Hambúrguer duplo 360g', 'Bacon', 'Ovo', 'Presunto', 'Queijo duplo', 'Alface', 'Tomate', 'Molho especial'],
    prepTime: '18-22 min',
    reviews: [
      { name: 'João Pedro', rating: 5, comment: 'É impossível comer sozinho! Absurdamente grande e gostoso.', date: '2024-12-10' },
      { name: 'Camila F.', rating: 5, comment: 'Vale cada centavo. O melhor X-Tudo que já comi!', date: '2024-11-25' },
      { name: 'Diego L.', rating: 4, comment: 'Enorme e delicioso. Só demorou um pouco mas valeu a pena.', date: '2024-10-18' },
    ],
  },
  {
    id: 'x-salada',
    name: 'X-Salada Fit',
    description: 'Pão integral, hambúrguer de frango, queijo branco, rúcula e tomate seco.',
    price: 24.90,
    category: 'lanches',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400&h=300&fit=crop',
    badge: 'novo',
    fullDescription: 'Opção mais leve sem abrir mão do sabor! Pão integral macio, hambúrguer de frango grelhado temperado com ervas finas, queijo branco derretido, rúcula fresca e tomate seco. Ideal para quem quer se alimentar bem mantendo o sabor.',
    ingredients: ['Pão integral', 'Hambúrguer de frango', 'Queijo branco', 'Rúcula', 'Tomate seco'],
    prepTime: '12-15 min',
  },
  {
    id: 'coxinha',
    name: 'Coxinha Cremosa',
    description: 'Massa crocante por fora, recheio cremoso de frango desfiado com catupiry.',
    price: 8.90,
    category: 'salgados',
    image: '/images/menu/coxinha.jpg',
    badge: 'popular',
    fullDescription: 'Nossa coxinha é feita artesanalmente todos os dias! Massa crocante por fora e macia por dentro, recheada com frango desfiado temperado e catupiry cremoso. Frita na hora para garantir aquele crocante perfeito.',
    ingredients: ['Massa de batata', 'Frango desfiado', 'Catupiry', 'Temperos especiais'],
    prepTime: '8-10 min',
    reviews: [
      { name: 'Ana Clara', rating: 5, comment: 'As crianças amam! Sempre pedimos uma porção.', date: '2024-12-05' },
      { name: 'Marcos O.', rating: 5, comment: 'Crocante por fora, cremosa por dentro. Perfeita!', date: '2024-11-20' },
    ],
  },
  {
    id: 'pastel-carne',
    name: 'Pastel de Carne',
    description: 'Massa fininha e crocante recheada com carne moída temperada. O clássico!',
    price: 10.90,
    category: 'salgados',
    image: 'https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?w=400&h=300&fit=crop',
    fullDescription: 'Pastel de feira de verdade! Massa fininha e super crocante, recheado generosamente com carne moída temperada com cebola, alho e ervas. Frito em óleo limpo e servido bem quente.',
    ingredients: ['Massa de pastel', 'Carne moída', 'Cebola', 'Alho', 'Temperos'],
    prepTime: '8-10 min',
  },
  {
    id: 'bolinha-queijo',
    name: 'Bolinha de Queijo',
    description: 'Bolinha crocante recheada com queijo derretido. Porção com 10 unidades.',
    price: 15.90,
    category: 'salgados',
    image: '/images/menu/bolinha-queijo.jpg',
    fullDescription: 'Porção com 10 bolinhas de queijo crocantes por fora e com queijo derretendo por dentro. Perfeitas para compartilhar! Acompanha molho especial da casa.',
    ingredients: ['Massa crocante', 'Queijo mussarela', 'Queijo cheddar', 'Temperos'],
    prepTime: '10-12 min',
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural',
    description: 'Suco feito na hora com frutas frescas. Sabores: laranja, maracujá, limão, abacaxi.',
    price: 9.90,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop',
    fullDescription: 'Sucos preparados na hora com frutas frescas e selecionadas. Sem conservantes, sem açúcar adicionado (adoce como preferir). Disponível nos sabores: laranja, maracujá, limão, abacaxi e morango.',
    prepTime: '5 min',
  },
  {
    id: 'milkshake',
    name: 'Milkshake Premium',
    description: 'Milkshake cremoso com sorvete artesanal. Sabores: chocolate, morango, ovomaltine.',
    price: 18.90,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&h=300&fit=crop',
    badge: 'novo',
    fullDescription: 'Milkshake ultra cremoso feito com sorvete artesanal e leite gelado. Finalizado com chantilly e calda. Sabores: chocolate belga, morango com pedaços de fruta, e ovomaltine com crocante.',
    prepTime: '5-8 min',
    reviews: [
      { name: 'Lucas M.', rating: 5, comment: 'O de ovomaltine é viciante! Cremoso e com muito crocante.', date: '2024-12-08' },
    ],
  },
  {
    id: 'refri',
    name: 'Refrigerante Lata',
    description: 'Coca-Cola, Guaraná Antarctica, Sprite, Fanta. Lata 350ml bem gelada.',
    price: 6.90,
    category: 'bebidas',
    image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
    prepTime: '1 min',
  },
  {
    id: 'acai-300',
    name: 'Açaí 300ml',
    description: 'Açaí puro cremoso com granola, banana, leite em pó e mel. Puro sabor!',
    price: 16.90,
    category: 'acai',
    image: '/images/menu/acai-300.jpg',
    badge: 'popular',
    fullDescription: 'Açaí puro e cremoso direto da Amazônia! Servido com granola crocante, banana fatiada, leite em pó e mel. Pode adicionar complementos extras por um valor adicional.',
    ingredients: ['Açaí puro', 'Granola', 'Banana', 'Leite em pó', 'Mel'],
    prepTime: '5 min',
    reviews: [
      { name: 'Rafael S.', rating: 5, comment: 'Açaí cremoso de verdade! Não é aguado como em outros lugares.', date: '2024-12-12' },
    ],
  },
  {
    id: 'acai-500',
    name: 'Açaí 500ml Especial',
    description: 'Açaí cremoso com morango, kiwi, granola, leite condensado e paçoca.',
    price: 24.90,
    category: 'acai',
    image: '/images/menu/acai-500.jpg',
    fullDescription: 'Nosso açaí especial em tamanho generoso! Servido com morango fresco, kiwi fatiado, granola crocante, leite condensado e paçoca esfarelada. Uma verdadeira sobremesa!',
    ingredients: ['Açaí puro', 'Morango', 'Kiwi', 'Granola', 'Leite condensado', 'Paçoca'],
    prepTime: '5-8 min',
  },
  {
    id: 'batata-frita',
    name: 'Batata Frita',
    description: 'Porção generosa de batata frita crocante com cheddar e bacon.',
    price: 19.90,
    category: 'porcoes',
    image: '/images/menu/batata-frita.jpg',
    badge: 'popular',
    fullDescription: 'Porção super generosa de batata frita sequinha e crocante, coberta com cheddar cremoso derretido e bacon crocante picado. Acompanha ketchup e maionese da casa.',
    ingredients: ['Batata frita', 'Cheddar cremoso', 'Bacon crocante', 'Ketchup', 'Maionese'],
    prepTime: '12-15 min',
    reviews: [
      { name: 'Pedro H.', rating: 5, comment: 'Porção enorme! O cheddar com bacon é uma combinação perfeita.', date: '2024-11-30' },
      { name: 'Juliana C.', rating: 4, comment: 'Muito boa! Dá pra dividir entre 2-3 pessoas tranquilamente.', date: '2024-11-10' },
    ],
  },
  {
    id: 'onion-rings',
    name: 'Onion Rings',
    description: 'Anéis de cebola empanados crocantes com molho barbecue artesanal.',
    price: 21.90,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&h=300&fit=crop',
    fullDescription: 'Anéis de cebola roxa empanados em massa crocante e dourada. Servidos com nosso molho barbecue artesanal defumado. Perfeitos como entrada ou acompanhamento.',
    ingredients: ['Cebola roxa', 'Massa empanada', 'Molho barbecue artesanal'],
    prepTime: '10-12 min',
  },
  {
    id: 'isca-frango',
    name: 'Isca de Frango',
    description: 'Tiras de frango empanadas servidas com molho especial da casa.',
    price: 23.90,
    category: 'porcoes',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop',
    badge: 'novo',
    fullDescription: 'Tiras generosas de peito de frango empanadas em farinha panko extra crocante. Servidas com nosso molho especial da casa e limão. Ideais para petiscar com os amigos!',
    ingredients: ['Peito de frango', 'Farinha panko', 'Temperos especiais', 'Molho da casa', 'Limão'],
    prepTime: '12-15 min',
  },
];
