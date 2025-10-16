import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DynamicComponent from '../DynamicComponent';
import { ErrorBoundary } from "react-error-boundary";
import NavbarComponent from './NavbarComponent';
import LoadingComponent from './LoadingComponent';

const EXPERIMENT = true

const EcommerceAI = ({user, setUser, appType, onAppTypeChange, isSwitchingApp}) => {
  const [generating, setGenerating] = useState(false)

  // Sample e-commerce data
  const products = [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      rating: 4.5,
      image: 'https://placehold.co/300x200',
      description: 'High-quality wireless headphones with active noise cancellation and 30-hour battery life',
      inStock: true,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      rating: 4.2,
      image: 'https://placehold.co/300x200',
      description: 'Advanced smartwatch with heart rate monitoring, GPS tracking, and water resistance',
      inStock: true,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Professional Running Shoes',
      price: 129.99,
      rating: 4.7,
      image: 'https://placehold.co/300x200',
      description: 'Lightweight running shoes with superior cushioning for all terrains',
      inStock: false,
      category: 'Sports'
    },
    {
      id: 4,
      name: 'Programmable Coffee Maker',
      price: 79.99,
      rating: 4.3,
      image: 'https://placehold.co/300x200',
      description: '12-cup programmable coffee maker with auto-shutoff and reusable filter',
      inStock: true,
      category: 'Home'
    },
    {
      id: 5,
      name: 'Wireless Gaming Mouse',
      price: 59.99,
      rating: 4.6,
      image: 'https://placehold.co/300x200',
      description: 'High-precision wireless gaming mouse with customizable RGB lighting',
      inStock: true,
      category: 'Electronics'
    },
    {
      id: 6,
      name: 'Yoga Mat Premium',
      price: 39.99,
      rating: 4.4,
      image: 'https://placehold.co/300x200',
      description: 'Non-slip yoga mat with carrying strap and alignment lines',
      inStock: true,
      category: 'Sports'
    },
    {
      id: 7,
      name: 'Air Purifier HEPA',
      price: 149.99,
      rating: 4.8,
      image: 'https://placehold.co/300x200',
      description: 'HEPA air purifier with smart sensors and smartphone app control',
      inStock: true,
      category: 'Home'
    },
    {
      id: 8,
      name: 'Bluetooth Speaker',
      price: 89.99,
      rating: 4.1,
      image: 'https://placehold.co/300x200',
      description: 'Portable Bluetooth speaker with 360-degree sound and waterproof design',
      inStock: true,
      category: 'Electronics'
    }
  ];

  // State management
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filter and sort products
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory)
  ).sort((a, b) => {
    switch(sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Star rating renderer
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" style={{ color: '#ffc107' }}>☆</span>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} style={{ color: '#e9ecef' }}>☆</span>);
    }
    return stars;
  };

  // Event handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const props = {
    products,
    selectedProduct,
    showProductModal,
    handleProductClick,
    handleCloseModal,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    filteredProducts,
    currentPage,
    setCurrentPage,
    productsPerPage,
    totalPages,
    renderStars
  };

  return (
    <>
      <ErrorBoundary fallback={<>
        <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>
        <div>Oh, Something went wrong!</div>
        </>}>
       <NavbarComponent user={user} generating={generating} setGenerating={setGenerating} setUser={setUser} experiment={EXPERIMENT} appType={appType} onAppTypeChange={onAppTypeChange} isSwitchingApp={isSwitchingApp}></NavbarComponent>{
       !generating  ? <DynamicComponent user={user} props={props} appType={appType} isSwitchingApp={isSwitchingApp}></DynamicComponent> :  <LoadingComponent></LoadingComponent>}
      </ErrorBoundary>
    </>
  );
};

export default EcommerceAI;
