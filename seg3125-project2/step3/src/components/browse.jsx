import React, { Component } from 'react';
import SideBySideContainer from './sideBySideContainer';
import Card from './card';
import FacetedSearch from './facetedSearch';

class Browse extends Component {
  state = {
    items: [
      {
        id: 1,
        title: "Plant 1",
        desc: "Sample description",
        lightReq: "low",
        waterReq: "medium",
        plantSize: "large",
        plantType: "outdoor",
        tempReq: "hot",
        selected: true,
      },
      {
        id: 2,
        title: "Plant 2",
        desc: "Sample description",
        lightReq: "medium",
        waterReq: "low",
        plantSize: "tiny",
        plantType: "indoor",
        tempReq: "cold",
        selected: true,
      },
      {
        id: 3,
        title: "Plant 3",
        desc: "Sample description",
        lightReq: "high",
        waterReq: "high",
        plantSize: "huge",
        plantType: "outdoor",
        tempReq: "cold",
        selected: true,
      },
      {
        id: 4,
        title: "Plant 4",
        desc: "Sample description",
        lightReq: "low",
        waterReq: "high",
        plantSize: "small",
        plantType: "indoor",
        tempReq: "ambient temperature",
        selected: true,
      },
      {
        id: 5,
        title: "Plant 5",
        desc: "Sample description",
        lightReq: "high",
        waterReq: "low",
        plantSize: "small",
        plantType: "indoor",
        tempReq: "hot",
        selected: true,
      },
      {
        id: 6,
        title: "Plant 6",
        desc: "Sample description",
        lightReq: "medium",
        waterReq: "medium",
        plantSize: "medium",
        plantType: "outdoor",
        tempReq: "ambient temperature",
        selected: true,
      }
    ],
  } 

  addToCart = (productId) => {
    alert("Added to cart");
  }

  search = (lightReqs, waterReqs, plantSizes, plantTypes, tempReqs) => {
    let items = [...this.state.items];
    items.map(i => {
      if (
        (lightReqs.includes(i.lightReq)  || lightReqs.length === 0) && 
        (waterReqs.includes(i.waterReq) || waterReqs.length === 0) && 
        (plantSizes.includes(i.plantSize) || plantSizes.length === 0) && 
        (plantTypes.includes(i.plantType) || plantTypes.length === 0) &&
        (tempReqs.includes(i.tempReq) || tempReqs.length === 0)
      ) {
        i.selected = true;
      } else {
        i.selected = false;
      }
    });
    this.setState({items: items});
  }

  render() { 
    return (
      <div>
        <FacetedSearch 
          searchHandler={this.search}
        />
        <SideBySideContainer>
          {
            this.state.items
              .filter(x => x.selected)
              .map(x => (
                <Card 
                  hasImg
                  imgSrc={"./assets/plant" + x.id + ".jpg"}
                  w="300px"
                  title={x.title}
                  desc={x.desc}
                  buttonText="Add to cart"
                  buttonHandler={() => this.addToCart(x.id)}
                />
              ))
          }
        </SideBySideContainer>
      </div>
    );
  }
}
 
export default Browse;