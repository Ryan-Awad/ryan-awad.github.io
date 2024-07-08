import React, { Component } from 'react';
import { Card as BootstrapCard, Button } from 'react-bootstrap';
import '../styles/card.css';

class Card extends Component {
  state = {  } 

  render() { 
    const {hasImg, imgSrc, w, h, title, desc, buttonText, buttonHandler, additionalStyles} = this.props;
    
    return (
      <BootstrapCard id="card" style={{ width: w, height: h, backgroundColor: '#A7AAA4', ...additionalStyles }}>
        {hasImg ? <BootstrapCard.Img variant="top" src={imgSrc ? imgSrc : "./logo512.png"} style={{objectFit: 'cover'}} width={w} height={h} /> : null}
        {title || desc ? <BootstrapCard.Body>
          {title ? <BootstrapCard.Title style={{textAlign: 'center'}}>{title}</BootstrapCard.Title> : null}

          {desc ? <BootstrapCard.Text>
            {desc}
          </BootstrapCard.Text> : null}
          
          {buttonText ? <Button type="secondary" onClick={buttonHandler}>{buttonText}</Button> : null}
        </BootstrapCard.Body> : null}
      </BootstrapCard>
    );
  }
}
 
export default Card;