/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  Mountain, 
  ChefHat, 
  Leaf, 
  Music, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Utensils
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  name: string;
  description: string;
  price: string;
}

interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

// --- Data ---
const FEATURED_DISHES = [
  { name: "Lamb Dal Bhat", icon: "🍛", price: "$18", desc: "Traditional Nepali platter with slow-cooked lamb, lentil soup, and mustard greens." },
  { name: "Chicken Momo Soup", icon: "🍜", price: "$14", desc: "Hand-made dumplings served in a rich, spiced Himalayan bone broth." },
  { name: "Butter Chicken", icon: "🥘", price: "$17", desc: "Tandoori-grilled chicken in a creamy tomato sauce with fenugreek leaves." },
  { name: "Vegetable Thali", icon: "🫕", price: "$15", desc: "A balanced feast featuring seasonal vegetables, pickles, and basmati rice." },
  { name: "Himalayan Yak Burger", icon: "🧆", price: "$19", desc: "Lean, protein-rich yak meat seasoned with mountain herbs on a brioche bun." },
  { name: "Mango Lassi", icon: "🥛", price: "$6", desc: "Refreshing yogurt-based drink blended with premium Alphonso mangoes." },
];

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'appetizers',
    label: 'Appetizers',
    items: [
      { name: "Steamed Momos", description: "Choice of veg or chicken dumplings", price: "$12" },
      { name: "Samosa Chaat", description: "Crushed samosas with chickpeas and chutney", price: "$10" },
      { name: "Onion Bhaji", description: "Crispy spiced onion fritters", price: "$8" },
      { name: "Himalayan Wings", description: "Spicy chili-garlic glazed wings", price: "$13" },
    ]
  },
  {
    id: 'mains',
    label: 'Mains',
    items: [
      { name: "Sherpa Stew", description: "Hearty mountain stew with hand-pulled noodles", price: "$16" },
      { name: "Lamb Rogan Josh", description: "Tender lamb in a Kashmiri chili sauce", price: "$20" },
      { name: "Paneer Tikka Masala", description: "Cottage cheese in spiced tomato gravy", price: "$17" },
      { name: "Everest Curry", description: "Chef's special spicy mixed meat curry", price: "$22" },
    ]
  },
  {
    id: 'desserts',
    label: 'Desserts',
    items: [
      { name: "Gulab Jamun", description: "Sweet milk solids in saffron syrup", price: "$7" },
      { name: "Kheer", description: "Traditional Himalayan rice pudding", price: "$8" },
      { name: "Kulfi", description: "Pistachio and cardamom frozen treat", price: "$7" },
      { name: "Chocolate Momo", description: "A modern twist on a classic dumpling", price: "$9" },
    ]
  },
  {
    id: 'drinks',
    label: 'Drinks',
    items: [
      { name: "Masala Chai", description: "Hand-brewed with whole spices", price: "$4" },
      { name: "Himalayan Coffee", description: "Organic beans from Nepal hills", price: "$5" },
      { name: "Everest Lager", description: "Imported Nepalese beer", price: "$8" },
      { name: "Mint Lemonade", description: "Freshly squeezed with rock salt", price: "$6" },
    ]
  }
];

const TESTIMONIALS = [
  { name: "Sarah Jenkins", quote: "The best Momos I've ever had outside of Kathmandu. The atmosphere is so cozy, it really feels like a mountain escape.", rating: 5 },
  { name: "Michael Chen", quote: "Butter Chicken was perfection, but the Lamb Dal Bhat is the real star. Authentic flavors and amazing service!", rating: 5 },
  { name: "David Thompson", quote: "A hidden gem. The Masala Chai tastes exactly like the one I had on my trek to Everest Base Camp.", rating: 5 },
];

const GALLERY_ITEMS = [
  { label: "Momos", color: "from-burgundy to-saffron" },
  { label: "Dal Bhat", color: "from-forest to-gold" },
  { label: "Interior", color: "from-saffron to-burgundy" },
  { label: "Tandoor", color: "from-stone-700 to-stone-500" },
  { label: "Spices", color: "from-gold to-forest" },
  { label: "Staff", color: "from-burgundy to-stone-800" },
  { label: "Desserts", color: "from-saffron to-stone-400" },
  { label: "Culture", color: "from-forest to-burgundy" },
];

// --- Components ---

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-serif mb-4"
    >
      {title}
    </motion.h2>
    <div className="w-20 h-1 bg-gold mx-auto mb-4" />
    {subtitle && <p className="text-stone-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('appetizers');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Testimonial auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleReservation = (e: FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen selection:bg-saffron selection:text-white">
      {/* 1. Sticky Navigation Bar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-burgundy py-3 shadow-lg' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <a href="#home" className="flex items-center gap-2 text-white font-serif text-2xl group">
            <span className="text-gold group-hover:scale-110 transition-transform">▲</span>
            <span className="tracking-tight">Himalayan Kitchen</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Menu', 'About', 'Gallery', 'Reservations', 'Contact'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`}
                className="text-white/90 hover:text-gold transition-colors text-sm font-medium uppercase tracking-wider"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              className="fixed inset-0 bg-burgundy z-40 flex flex-col items-center justify-center gap-8 md:hidden"
            >
              {['Home', 'Menu', 'About', 'Gallery', 'Reservations', 'Contact'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white text-3xl font-serif hover:text-gold transition-colors"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 2. Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-forest/40 to-burgundy/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=2000" 
            alt="Restaurant Atmosphere" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <motion.div 
          style={{ opacity: heroOpacity }}
          className="container relative z-20 text-center px-6"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-7xl lg:text-8xl font-serif font-black mb-6 leading-tight"
          >
            A Journey Through the <br />
            <span className="text-gold italic">Himalayas</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-cream/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
          >
            Experience the vibrant spices of Nepal and the soul-warming traditions of the mountains in the heart of the city.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="#menu" className="bg-saffron hover:bg-burgundy text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all hover:-translate-y-1 shadow-xl">
              View Our Menu
            </a>
            <a href="#reservations" className="border-2 border-white text-white hover:bg-white hover:text-burgundy px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all">
              Reserve a Table
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <div className="w-1 h-12 border border-white/30 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* 3. Featured Dishes Section */}
      <section id="featured" className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <SectionHeading 
            title="Our Signature Creations" 
            subtitle="Hand-crafted dishes that capture the essence of mountain culinary heritage."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_DISHES.map((dish, idx) => (
              <motion.div 
                key={dish.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-all group border-b-4 border-transparent hover:border-saffron"
              >
                <span className="text-5xl mb-6 block group-hover:scale-110 transition-transform">{dish.icon}</span>
                <h3 className="text-2xl font-serif mb-3">{dish.name}</h3>
                <p className="text-stone-600 mb-6">{dish.desc}</p>
                <span className="text-saffron font-bold text-xl">{dish.price}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Choose Us / USP Section */}
      <section className="py-24 bg-burgundy text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { icon: <Mountain className="w-12 h-12 mx-auto text-gold mb-4" />, title: "Authentic Recipes", desc: "Heritage flavors passed down through generations in Kathmandu." },
              { icon: <Leaf className="w-12 h-12 mx-auto text-gold mb-4" />, title: "Fresh Ingredients", desc: "Sourced locally and spiced with authentic Himalayan herbs." },
              { icon: <ChefHat className="w-12 h-12 mx-auto text-gold mb-4" />, title: "Expert Chefs", desc: "Masters of the tandoor and traditional clay pot cooking." },
              { icon: <Music className="w-12 h-12 mx-auto text-gold mb-4" />, title: "Cultural Ambiance", desc: "Immerse yourself in the sounds and sights of the high peaks." },
            ].map((usp, idx) => (
              <motion.div 
                key={usp.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                {usp.icon}
                <h4 className="text-xl font-serif text-gold mb-2">{usp.title}</h4>
                <p className="text-cream/70 text-sm leading-relaxed">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Menu Highlight Tabs */}
      <section id="menu" className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <SectionHeading title="The Kitchen Menu" />
          
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-8 py-3 font-serif font-bold transition-all border-b-2 ${activeTab === cat.id ? 'border-burgundy text-burgundy bg-white shadow-sm' : 'border-transparent text-stone-400 hover:text-burgundy'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
            <AnimatePresence mode="wait">
              {MENU_CATEGORIES.find(c => c.id === activeTab)?.items.map((item, idx) => (
                <motion.div 
                  key={`${activeTab}-${item.name}`}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: idx % 2 === 0 ? 20 : -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex justify-between items-start border-b border-stone-200 pb-4 group"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="text-xl font-serif group-hover:text-saffron transition-colors">{item.name}</h4>
                    <p className="text-stone-500 text-sm italic">{item.description}</p>
                  </div>
                  <span className="text-saffron font-bold text-lg">{item.price}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. About Us Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2"
            >
              <h2 className="text-4xl md:text-5xl font-serif mb-8">Our Story</h2>
              <p className="text-stone-600 text-lg mb-6 leading-relaxed">
                Founded in 2015, Himalayan Kitchen brings the rich culinary traditions of Nepal and the Himalayan region to your table. Our journey began with a simple mission: to share the warmth of mountain hospitality through honest, flavorful cooking.
              </p>
              <p className="text-stone-600 text-lg mb-8 leading-relaxed">
                Every dish we serve is a tribute to the diverse cultures of the South Asian landscape, blending the robust spices of India with the delicate textures of Tibet and Nepal.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-saffron flex items-center justify-center text-white">
                  <Utensils className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-burgundy">Authentic Flavors</p>
                  <p className="text-sm text-stone-500">Traditional mountain recipes</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 relative"
            >
              <div className="bg-forest p-12 text-white relative z-10 rounded-sm">
                <div className="absolute inset-4 border border-gold/30 pointer-events-none" />
                <MessageSquare className="text-gold w-10 h-10 mb-6" />
                <p className="text-2xl font-serif italic mb-10 leading-snug">
                  "Food is the ingredient that binds us together, across any mountain peak."
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <p className="text-3xl font-serif text-gold">500+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Happy Guests/Week</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-gold">10+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Years Experience</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-gold">40+</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Menu Items</p>
                  </div>
                  <div>
                    <p className="text-3xl font-serif text-gold">100%</p>
                    <p className="text-xs uppercase tracking-widest opacity-70">Authentic</p>
                  </div>
                </div>
              </div>
              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-gold -z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Testimonials Section */}
      <section className="py-24 bg-cream/50">
        <div className="container mx-auto px-6">
          <SectionHeading title="Guest Experiences" />
          <div className="max-w-4xl mx-auto relative px-12">
            <div className="overflow-hidden">
              <motion.div 
                animate={{ x: `-${testimonialIdx * 100}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="flex"
              >
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className="min-w-full text-center py-8">
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-gold text-gold" />)}
                    </div>
                    <p className="text-2xl md:text-3xl font-serif italic text-stone-700 mb-8 leading-relaxed">
                      "{t.quote}"
                    </p>
                    <p className="font-bold text-burgundy uppercase tracking-widest">— {t.name}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Controls */}
            <button 
              onClick={() => setTestimonialIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-burgundy transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
              onClick={() => setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length)}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-burgundy transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setTestimonialIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${testimonialIdx === i ? 'w-8 bg-saffron' : 'bg-stone-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Reservation / Booking Section */}
      <section id="reservations" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden">
            <div className="lg:w-1/3 bg-burgundy p-12 text-white">
              <h3 className="text-3xl font-serif text-gold mb-6">Book Your Table</h3>
              <p className="mb-8 text-cream/80">Join us for an unforgettable dining experience in our cozy mountain-inspired space.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <MapPin className="text-gold" />
                  <span>123 Mountain View Ave, Vancouver</span>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="text-gold" />
                  <a href="tel:6045550199" className="hover:text-gold transition-colors">(604) 555-0199</a>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="text-gold" />
                  <span>Mon–Sun: 11am – 10pm</span>
                </div>
              </div>

              <div className="mt-12 p-4 border border-gold/30 bg-gold/5 rounded">
                <p className="text-gold font-bold text-sm uppercase tracking-widest mb-1">⚠️ Limited Seating</p>
                <p className="text-xs text-cream/70">Weekends fill up fast — book your table today to avoid disappointment.</p>
              </div>
            </div>

            <div className="lg:w-2/3 p-12 bg-cream/20">
              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center"
                >
                  <div className="w-20 h-20 bg-forest text-white rounded-full flex items-center justify-center mb-6">
                    <Utensils className="w-10 h-10" />
                  </div>
                  <h4 className="text-3xl font-serif text-burgundy mb-4">Namaste!</h4>
                  <p className="text-stone-600 mb-8">Your reservation request has been received. We'll confirm via email shortly.</p>
                  <button onClick={() => setFormSubmitted(false)} className="text-saffron font-bold uppercase tracking-widest border-b-2 border-saffron">Make another booking</button>
                </motion.div>
              ) : (
                <form onSubmit={handleReservation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">Email</label>
                    <input required type="email" placeholder="john@example.com" className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2"><Calendar className="w-4 h-4" /> Date</label>
                    <input required type="date" className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2"><Clock className="w-4 h-4" /> Time</label>
                    <select required className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors">
                      <option value="">Select Time</option>
                      {['11:00 AM', '12:00 PM', '1:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2"><Users className="w-4 h-4" /> Party Size</label>
                    <select required className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors">
                      {[1, 2, 3, 4, 5, 6, '7+'].map(n => <option key={n}>{n} {n === 1 ? 'Person' : 'People'}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2"><Phone className="w-4 h-4" /> Phone</label>
                    <input required type="tel" placeholder="(604) 000-0000" className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-stone-700 uppercase tracking-wider flex items-center gap-2">Special Requests</label>
                    <textarea rows={3} className="w-full p-3 bg-white border border-stone-200 focus:border-saffron outline-none transition-colors" placeholder="Allergies, celebrations, etc."></textarea>
                  </div>
                  <button type="submit" className="md:col-span-2 bg-saffron hover:bg-burgundy text-white py-4 font-bold uppercase tracking-widest transition-colors shadow-lg mt-4">
                    Confirm Reservation
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Gallery Section */}
      <section id="gallery" className="py-24 bg-cream">
        <div className="container mx-auto px-6">
          <SectionHeading title="Our Gallery" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {GALLERY_ITEMS.map((item, idx) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className={`relative group overflow-hidden rounded-sm bg-gradient-to-br ${item.color} flex items-center justify-center p-4 ${idx === 0 || idx === 5 ? 'md:col-span-2' : ''} ${idx === 2 ? 'md:row-span-2' : ''}`}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <span className="relative z-10 text-white font-serif text-xl uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {item.label}
                </span>
                {/* Placeholder image overlay effect */}
                <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer id="contact" className="bg-stone-900 text-stone-400 py-20 border-t-4 border-gold">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <a href="#" className="text-white font-serif text-3xl mb-6 block">Himalayan Kitchen</a>
              <p className="mb-8 leading-relaxed">
                Authentic flavors from the roof of the world. A culinary journey you won't forget, right in your neighborhood.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-saffron hover:text-white transition-all"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-saffron hover:text-white transition-all"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center hover:bg-saffron hover:text-white transition-all"><MessageSquare className="w-5 h-5" /></a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-serif text-xl mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Menu', 'About', 'Gallery', 'Reservations'].map(link => (
                  <li key={link}><a href={`#${link.toLowerCase()}`} className="hover:text-gold transition-colors">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif text-xl mb-6">Hours</h4>
              <ul className="space-y-3">
                <li className="flex justify-between"><span>Mon–Fri</span> <span className="text-white">11am – 10pm</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span className="text-white">11am – 11pm</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span className="text-white">12pm – 9pm</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-serif text-xl mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0" />
                  <span>123 Mountain View Ave, Vancouver, BC</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-gold shrink-0" />
                  <a href="tel:6045550199" className="hover:text-white transition-colors">(604) 555-0199</a>
                </li>
                <li className="flex gap-3">
                  <Clock className="w-5 h-5 text-gold shrink-0" />
                  <span>info@himalayankitchen.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Himalayan Kitchen. All rights reserved. | Namaste</p>
          </div>
        </div>
      </footer>

      {/* Floating Reserve Button */}
      <motion.a 
        href="#reservations"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: isScrolled ? 1 : 0, scale: isScrolled ? 1 : 0.5 }}
        className="fixed bottom-8 right-8 z-40 bg-saffron text-white p-4 rounded-full shadow-2xl hover:bg-burgundy transition-colors group"
      >
        <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <span className="absolute right-full mr-4 bg-burgundy text-white px-4 py-2 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-bold">Reserve Now</span>
      </motion.a>
    </div>
  );
}
