import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Modal, Form, InputGroup, Dropdown } from 'react-bootstrap';


function EcommerceApp({ 
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
}) {
  const styles = {
    appContainer: { backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '20px' },
    searchInput: { borderRadius: '4px 0 0 4px' },
    searchButton: { borderRadius: '0 4px 4px 0' },
    productCard: {
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    productImageWrapper: { position: 'relative', padding: '16px' },
    productImage: {
      width: '100%',
      height: '200px',
      objectFit: 'cover',
      borderRadius: '4px',
      marginBottom: '12px'
    },
    outOfStockBadge: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      fontSize: '0.8rem'
    },
    productTitle: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#212529',
      marginBottom: '8px',
      lineHeight: '1.3'
    },
    productPrice: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#B12704'
    },
    viewDetailsBtn: {
      backgroundColor: '#ffc107',
      borderColor: '#ffc107',
      color: '#000',
      fontWeight: '600',
      borderRadius: '6px'
    }
  };
  
  return (
    <div style={styles.appContainer}>
      <Container>
        {/* Search Section */}
        <div className="mb-4 mt-3">
          <Row className="justify-content-center">
            <Col md={8}>
              <Form className="d-flex">
                <InputGroup>
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={styles.searchInput}
                  />
                  <Button variant="warning" style={styles.searchButton}>
                    🔍
                  </Button>
                </InputGroup>
              </Form>
            </Col>
          </Row>
        </div>

        {/* Filters and Sort */}
        <Row className="mb-4">
          <Col md={3}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">Categories</h6>
              </Card.Header>
              <Card.Body>
                {['All', 'Electronics', 'Sports', 'Home'].map(category => (
                  <div key={category} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="category"
                      id={category}
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                    />
                    <label className="form-check-label" htmlFor={category}>
                      {category}
                    </label>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={9}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="text-muted">
                  Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} results
                </span>
              </div>
              <div className="d-flex align-items-center">
                <span className="me-2">Sort by:</span>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    {sortBy === 'featured' ? 'Featured' : 
                     sortBy === 'price-low' ? 'Price: Low to High' :
                     sortBy === 'price-high' ? 'Price: High to Low' : 'Customer Rating'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setSortBy('featured')}>Featured</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('price-low')}>Price: Low to High</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('price-high')}>Price: High to Low</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSortBy('rating')}>Customer Rating</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Product Grid */}
            <Row>
              {filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map(product => (
                <Col key={product.id} lg={3} md={4} sm={6} className="mb-4">
                  <Card 
                    className="h-100 product-card" 
                    style={styles.productCard}
                    onClick={() => handleProductClick(product)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={styles.productImageWrapper}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={styles.productImage}
                      />
                      {!product.inStock && (
                        <Badge bg="danger" style={styles.outOfStockBadge}>
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    
                    <Card.Body className="d-flex flex-column">
                      <Card.Title style={styles.productTitle}>
                        {product.name}
                      </Card.Title>
                      
                      <div className="mb-2">
                        <div className="d-flex align-items-center mb-1">
                          <div className="me-2">
                            {renderStars(product.rating)}
                          </div>
                          <small className="text-muted">
                            ({product.rating})
                          </small>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span style={styles.productPrice}>
                          ${product.price}
                        </span>
                        <small className="text-muted ms-2">
                          {product.category}
                        </small>
                      </div>
                      
                      <div className="mt-auto">
                        <Button 
                          variant="warning" 
                          className="w-100"
                          disabled={!product.inStock}
                          style={styles.viewDetailsBtn}
                        >
                          {product.inStock ? 'View Details' : 'Out of Stock'}
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

//export default EcommerceApp;
