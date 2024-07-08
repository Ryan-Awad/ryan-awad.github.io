import React, { Component } from 'react';
import '../styles/home.css'
import Card from './card';
import SideBySideContainer from './sideBySideContainer';
import Banner from './banner';

class Home extends Component {
  state = {  } 
  render() { 
    return (
      <div>
        <Banner />

        <h1>The Plant Corner</h1>

        <SideBySideContainer centerChildren>
          <Card
            hasImg
            imgSrc="./assets/home1.jpg"
            w="300px"
            h="300px"
          />
          <Card
            hasImg
            imgSrc="./assets/home2.jpg"
            src="x"
            w="300px"
            h="300px"
          />
          <Card
            hasImg
            imgSrc="./assets/home3.png"
            src="x"
            w="300px"
            h="300px"
          />
        </SideBySideContainer>
      </div>
    );
  }
}
 
export default Home;