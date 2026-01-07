import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: 'Филадельфия Классик',
    description: 'Лосось, сливочный сыр, авокадо, огурец',
    price: 590,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/a7394400-3407-4f83-9a7c-a86e9b17c117.jpg',
    category: 'Роллы',
    isNew: true
  },
  {
    id: 2,
    name: 'Калифорния с крабом',
    description: 'Краб, авокадо, огурец, тобико',
    price: 520,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Роллы'
  },
  {
    id: 3,
    name: 'Дракон',
    description: 'Угорь, огурец, авокадо, унаги соус',
    price: 680,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/a7394400-3407-4f83-9a7c-a86e9b17c117.jpg',
    category: 'Роллы'
  },
  {
    id: 4,
    name: 'Спайси Тунец',
    description: 'Тунец, спайси соус, огурец, кунжут',
    price: 640,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Роллы'
  },
  {
    id: 5,
    name: 'Нигири с лососем',
    description: 'Свежий лосось, рис, васаби',
    price: 320,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Суши'
  },
  {
    id: 6,
    name: 'Нигири с тунцом',
    description: 'Свежий тунец, рис, васаби',
    price: 350,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Суши'
  },
  {
    id: 7,
    name: 'Премиум сет',
    description: '32 шт: Филадельфия, Калифорния, Дракон',
    price: 2190,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Сеты',
    isNew: true
  },
  {
    id: 8,
    name: 'Семейный сет',
    description: '48 шт: ассорти роллов и суши',
    price: 3200,
    image: 'https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/4ad2a8b0-8fda-439a-aa83-db75f350cb53.jpg',
    category: 'Сеты'
  }
];

const reviews = [
  {
    id: 1,
    name: 'Мария Соколова',
    rating: 5,
    text: 'Восхитительно! Свежайшая рыба, изысканная подача. Теперь только сюда!',
    date: '15.12.2025'
  },
  {
    id: 2,
    name: 'Дмитрий Волков',
    rating: 5,
    text: 'Премиальное качество за свою цену. Доставка быстрая, всё горячее.',
    date: '10.12.2025'
  },
  {
    id: 3,
    name: 'Елена Краснова',
    rating: 5,
    text: 'Лучшие суши в городе! Программа лояльности — приятный бонус.',
    date: '05.12.2025'
  }
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const categories = ['Все', 'Роллы', 'Суши', 'Сеты'];

  const filteredItems = selectedCategory === 'Все' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast({ title: 'Добавлено в корзину', description: item.name });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary">🍣 SAKURA</h1>
          
          <div className="hidden md:flex gap-8">
            {['home', 'menu', 'about', 'delivery', 'reviews', 'contacts'].map(section => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="hover:text-primary transition-colors capitalize"
              >
                {section === 'home' ? 'Главная' : 
                 section === 'menu' ? 'Меню' : 
                 section === 'about' ? 'О нас' : 
                 section === 'delivery' ? 'Доставка' : 
                 section === 'reviews' ? 'Отзывы' : 'Контакты'}
              </button>
            ))}
          </div>

          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={() => setIsCartOpen(true)}
          >
            <Icon name="ShoppingCart" size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </nav>

      <section id="home" className="pt-20 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/f2147272-9a92-4707-9683-8407bc5431ca.jpg)` }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-7xl md:text-9xl font-bold mb-6 animate-fade-in">Искусство вкуса</h2>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Премиальные суши и роллы из свежайших ингредиентов. Доставка за 45 минут.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg px-8" onClick={() => scrollToSection('menu')}>
              Смотреть меню
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Забронировать стол
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Онлайн-запись на мероприятие</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input placeholder="Ваше имя" />
                  <Input placeholder="Телефон" type="tel" />
                  <Input placeholder="Дата и время" type="datetime-local" />
                  <Input placeholder="Количество гостей" type="number" />
                  <Textarea placeholder="Комментарий" />
                  <Button className="w-full">Забронировать</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Gift" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Акции каждую неделю</h3>
                <p className="text-muted-foreground">Скидки до 30% на избранные позиции</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Award" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Программа лояльности</h3>
                <p className="text-muted-foreground">Бонусы с каждого заказа</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardContent className="pt-6 text-center">
                <Icon name="Calendar" size={40} className="mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Банкеты и мероприятия</h3>
                <p className="text-muted-foreground">Проведение событий на высшем уровне</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="menu" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold text-center mb-4">Наше меню</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">Только свежие ингредиенты премиум класса</p>
          
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map(item => (
              <Card key={item.id} className="overflow-hidden hover:shadow-2xl transition-shadow group">
                <div className="relative overflow-hidden h-64">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {item.isNew && (
                    <Badge className="absolute top-4 right-4 bg-primary">Новинка</Badge>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-primary">{item.price} ₽</span>
                    <Button onClick={() => addToCart(item)} size="sm">
                      <Icon name="Plus" size={16} className="mr-1" />
                      В корзину
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-6xl font-bold mb-6">О нас</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Sakura — это премиальный суши-бар, где традиции японской кухни встречаются с современными кулинарными технологиями.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Наши шеф-повара прошли обучение в Токио и используют только свежайшие ингредиенты, доставляемые напрямую из Японии и лучших рыбных хозяйств.
              </p>
              <p className="text-lg text-muted-foreground">
                Мы гордимся нашей программой лояльности, которая позволяет постоянным гостям получать бонусы и эксклюзивные предложения.
              </p>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <img 
                src="https://cdn.poehali.dev/projects/86f48fbd-222f-4a4b-86f4-4c9f3776eab2/files/f2147272-9a92-4707-9683-8407bc5431ca.jpg"
                alt="Наш ресторан"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="delivery" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold text-center mb-12">Доставка</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="Clock" size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">45 минут</h3>
                <p className="text-muted-foreground">Среднее время доставки</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="Wallet" size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">От 1500 ₽</h3>
                <p className="text-muted-foreground">Минимальная сумма заказа</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <Icon name="CreditCard" size={48} className="mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Любой способ</h3>
                <p className="text-muted-foreground">Наличные, карта, онлайн</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold text-center mb-12">Отзывы гостей</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map(review => (
              <Card key={review.id} className="bg-card/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={20} className="text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">{review.text}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{review.name}</span>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-6xl font-bold text-center mb-12">Контакты</h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <Icon name="Phone" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Телефон</p>
                    <p className="text-muted-foreground">+7 (495) 123-45-67</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="MapPin" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Адрес</p>
                    <p className="text-muted-foreground">г. Москва, ул. Примерная, д. 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="Mail" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground">info@sakura.ru</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Icon name="Clock" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold">Режим работы</p>
                    <p className="text-muted-foreground">Ежедневно с 11:00 до 23:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-2xl font-bold mb-4">Напишите нам</h3>
                <div className="space-y-4">
                  <Input placeholder="Ваше имя" />
                  <Input placeholder="Email" type="email" />
                  <Textarea placeholder="Сообщение" rows={4} />
                  <Button className="w-full">Отправить</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Sakura. Все права защищены.</p>
        </div>
      </footer>

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl">Корзина</DialogTitle>
          </DialogHeader>
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ShoppingCart" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Корзина пуста</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <Card key={item.id}>
                  <CardContent className="pt-6 flex gap-4">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{item.price} ₽</span>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                          <Button 
                            size="icon" 
                            variant="destructive" 
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold">Итого:</span>
                  <span className="text-3xl font-bold text-primary">{cartTotal} ₽</span>
                </div>
                <Button className="w-full" size="lg">
                  Оформить заказ
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
