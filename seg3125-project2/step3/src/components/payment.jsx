import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';

class Payment extends Component {
  state = {
    cartItems: [
      { id: 1, name: 'Product 1', price: '$10' },
      { id: 2, name: 'Product 2', price: '$20' },
      { id: 3, name: 'Product 3', price: '$30' }
    ]
  };

  handleSubmit = (event) => {
    event.preventDefault();
    alert('Order placed!');
  };

  render() {
    return (
      <Container style={{padding: '50px'}}>
        <Row>
          <Col md={6}>
            <h2 className="mb-4">Your Cart</h2>
            <ListGroup>
              {this.state.cartItems.map(item => (
                <ListGroup.Item key={item.id}>
                  {item.name} - {item.price}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
          <Col md={6}>
            <h2 className="mb-4">Payment Information</h2>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="formName">
                <Form.Label>Cardholder name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formCardNumber">
                <Form.Label>Card Number</Form.Label>
                <Form.Control
                  type="text"
                  name="cardNumber"
                  onChange={this.handleChange}
                  placeholder="1111 2222 3333 4444"
                  required
                />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="formExpiryDate">
                    <Form.Label>Expiry Date</Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.expiryDate}
                      placeholder="MM/YY"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group controlId="formCVV">
                    <Form.Label>CVV</Form.Label>
                    <Form.Control
                      type="text"
                      name="cvv"
                      placeholder="Enter your CVV"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row><br></br>

              <Button variant="primary" type="submit">
                Place order
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Payment;
