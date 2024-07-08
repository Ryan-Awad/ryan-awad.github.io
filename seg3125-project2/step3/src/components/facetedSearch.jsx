import React, { Component } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap'
import '../styles/facetedSearch.css'

class FacetedSearch extends Component {
  state = { 
    checks: {
      lightReqs: [],
      waterReqs: [],
      plantSizes: [],
      plantTypes: [],
      tempReqs: [],
    }
  } 

  appendToCheck = (key, value) => {
    this.setState(prevState => ({
      checks: {
        ...prevState.checks,
        [key]: [...prevState.checks[key], value]
      }
    }));
  }

  popFromCheck = (key, value) => {
    this.setState(prevState => ({
      checks: {
        ...prevState.checks,
        [key]: prevState.checks[key].filter(item => item !== value)
      }
    }));
  }

  handleCheckboxChange = (event) => {
    const { value, checked, id } = event.target;
    //alert(id);
    
    if (checked) {
      if (id === "lightReqs") 
        this.appendToCheck(id, value.toLowerCase());
      else if (id === "waterReqs") 
        this.appendToCheck(id, value.toLowerCase());
      else if (id === "plantSizes") 
        this.appendToCheck(id, value.toLowerCase());
      else if (id === "plantTypes") 
        this.appendToCheck(id, value.toLowerCase());
      else if (id === "tempReqs") 
        this.appendToCheck(id, value.toLowerCase());
    } else {
      if (id === "lightReqs") 
        this.popFromCheck(id, value.toLowerCase());
      else if (id === "waterReqs") 
        this.popFromCheck(id, value.toLowerCase());
      else if (id === "plantSizes") 
        this.popFromCheck(id, value.toLowerCase());
      else if (id === "plantTypes") 
        this.popFromCheck(id, value.toLowerCase());
      else if (id === "tempReqs") 
        this.popFromCheck(id, value.toLowerCase());
    }
  };

  render() { 
    const {searchHandler} = this.props;
    
    return (
      <div id="parent">
        <InputGroup>
          <Form.Control
            placeholder="Search"
          />
        </InputGroup><br></br>

        <div>
          Light Requirements
          <Form.Check
            type="checkbox"
            label="Low"
            value="Low"
            id="lightReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Medium"
            value="Medium"
            id="lightReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="High"
            value="High"
            id="lightReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
        </div>
        <br />
        <div>
          Water Requirements
          <Form.Check
            type="checkbox"
            label="Low"
            value="Low"
            id="waterReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Medium"
            value="Medium"
            id="waterReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="High"
            value="High"
            id="waterReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
        </div>
        <br />
        <div>
          Plant Size
          <Form.Check
            type="checkbox"
            label="Tiny"
            value="Tiny"
            id="plantSizes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Small"
            value="Small"
            id="plantSizes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Medium"
            value="Medium"
            id="plantSizes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Large"
            value="Large"
            id="plantSizes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Huge"
            value="Huge"
            id="plantSizes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
        </div>
        <br />
        <div>
          Plant Type
          <Form.Check
            type="checkbox"
            label="Indoor"
            value="Indoor"
            id="plantTypes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Outdoor"
            value="Outdoor"
            id="plantTypes"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
        </div>
        <br />
        <div>
          Temperature Requirements
          <Form.Check
            type="checkbox"
            label="Cold"
            value="Cold"
            id="tempReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Ambient Temperature"
            value="Ambient Temperature"
            id="tempReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
          <Form.Check
            type="checkbox"
            label="Hot"
            value="Hot"
            id="tempReqs"
            onChange={(e) => this.handleCheckboxChange(e)}
          />
        </div>

        <br></br><Button onClick={() => searchHandler(
          this.state.checks.lightReqs, 
          this.state.checks.waterReqs, 
          this.state.checks.plantSizes, 
          this.state.checks.plantTypes,
          this.state.checks.tempReqs)}>Search</Button>
      </div>
    );
  }
}
 
export default FacetedSearch;