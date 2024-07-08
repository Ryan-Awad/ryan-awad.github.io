import React, { Component } from 'react';

class SideBySideContainer extends Component {
  state = {  } 
  render() { 
    const {childrenMargin, centerChildren} = this.props;
    const containerStyle = {
      display: 'flex',
      flexWrap: 'wrap',
    };

    if (centerChildren) {
      containerStyle["alignItems"] = "center";
      containerStyle["justifyContent"] = "center";
    }

    const sbsChildren = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        additionalStyles: {
          ...child.props.style,
          margin: childrenMargin ? childrenMargin : '40px',
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      });
    });

    return (
      <div>
        <div style={containerStyle}>
          {sbsChildren}
        </div>
      </div>
    );
  }
}
 
export default SideBySideContainer;