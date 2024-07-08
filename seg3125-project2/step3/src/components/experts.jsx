import React, { Component } from 'react';
import Banner from './banner';
import SideBySideContainer from './sideBySideContainer';
import Card from './card';

class Experts extends Component {
  state = {  } 

  scheduleCall = (expertId) => {
    alert("Call scheduled!");
  }

  render() { 
    return (
      <div>
        <Banner h='300px'/>
        <h1>Meet with an expert!</h1>

        <SideBySideContainer centerChildren childrenMargin="100px">
          <Card
            hasImg
            imgSrc="./assets/expert1.jpg"
            w="300px"
            title="John Doe"
            desc="Expert at something . . ."
            buttonText="Schedule Call"
            buttonHandler={() => this.scheduleCall(1)}
          />
          <Card
            hasImg
            imgSrc="./assets/expert2.jpg"
            src="x"
            w="300px"
            title="John Doe"
            desc="Expert at something . . ."
            buttonText="Schedule Call"
            buttonHandler={() => this.scheduleCall(1)}
          />
          <Card
            hasImg
            imgSrc="./assets/expert3.jpg"
            src="x"
            w="300px"
            title="John Doe"
            desc="Expert at something . . ."
            buttonText="Schedule Call"
            buttonHandler={() => this.scheduleCall(1)}
          />
        </SideBySideContainer>
      </div>
    );
  }
}
 
export default Experts;