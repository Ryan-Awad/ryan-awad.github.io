import React, { Component } from 'react';

class Guide extends Component {
  state = {  } 
  render() { 
    const {id, title, body} = this.props.guide;
    console.log(this.props.guide);

    return (
      <div>
        <div style={{paddingLeft: '100px', paddingRight: '100px', paddingTop: '25px'}}>
          <h1>{title}</h1>
          <hr></hr>
        </div>

        <div style={{margin: '0 200px 0 200px'}}>{body}</div>
      </div>
    );
  }
}
 
export default Guide;