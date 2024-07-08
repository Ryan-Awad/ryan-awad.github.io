import React, { Component } from 'react';

class Banner extends Component {
  state = {  } 
  render() { 
    const style = {
      backgroundColor: 'grey',
      height: this.props.h ? this.props.h : '400px',
    };

    return (
      <div style={style}>
        <img 
          src="./assets/banner.jpg"
          height="100%"
          width="100%"
          style={{objectFit: 'cover'}}
        />
      </div>
    );
  }
}
 
export default Banner;