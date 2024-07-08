import React, { Component } from 'react';
import SideBySideContainer from './sideBySideContainer';
import Card from './card';
import { InputGroup, Form } from 'react-bootstrap';
import Guide from './guide';

class Guides extends Component {
  state = {
    guides: [
      {
        id: 1,
        title: 'Title 1',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus diam in vestibulum mollis. Donec ligula augue, pretium ac nisi imperdiet, ornare fermentum tortor. Curabitur consectetur risus sed dolor commodo feugiat. Quisque sed massa consectetur, lacinia ligula ut, pretium sem. Donec in vehicula velit, vel finibus est. In gravida nec ex sit amet vehicula. Fusce sed efficitur lacus, sed volutpat purus. Nunc tortor lacus, placerat ac lectus pretium, cursus tempor augue. Cras id dictum augue, at interdum nunc.'
      },
      {
        id: 2,
        title: 'Title 2',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus diam in vestibulum mollis. Donec ligula augue, pretium ac nisi imperdiet, ornare fermentum tortor. Curabitur consectetur risus sed dolor commodo feugiat. Quisque sed massa consectetur, lacinia ligula ut, pretium sem. Donec in vehicula velit, vel finibus est. In gravida nec ex sit amet vehicula. Fusce sed efficitur lacus, sed volutpat purus. Nunc tortor lacus, placerat ac lectus pretium, cursus tempor augue. Cras id dictum augue, at interdum nunc.'
      },
      {
        id: 3,
        title: 'Title 3',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus diam in vestibulum mollis. Donec ligula augue, pretium ac nisi imperdiet, ornare fermentum tortor. Curabitur consectetur risus sed dolor commodo feugiat. Quisque sed massa consectetur, lacinia ligula ut, pretium sem. Donec in vehicula velit, vel finibus est. In gravida nec ex sit amet vehicula. Fusce sed efficitur lacus, sed volutpat purus. Nunc tortor lacus, placerat ac lectus pretium, cursus tempor augue. Cras id dictum augue, at interdum nunc.'
      },
      {
        id: 4,
        title: 'Title 4',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam finibus diam in vestibulum mollis. Donec ligula augue, pretium ac nisi imperdiet, ornare fermentum tortor. Curabitur consectetur risus sed dolor commodo feugiat. Quisque sed massa consectetur, lacinia ligula ut, pretium sem. Donec in vehicula velit, vel finibus est. In gravida nec ex sit amet vehicula. Fusce sed efficitur lacus, sed volutpat purus. Nunc tortor lacus, placerat ac lectus pretium, cursus tempor augue. Cras id dictum augue, at interdum nunc.'
      }
    ]
  } 

  getGuide = () => {
    const guideId = new URLSearchParams(window.location.search).get('guideId');
    if (!guideId)
      return null
    return this.state.guides.filter(g => g.id === Number(guideId))[0];
  }

  render() { 
    const guide = this.getGuide();
    console.log(guide);

    return (
      <>
        {!guide ?
          <div>
            <div style={{backgroundColor: '#B9BEA5', padding: '20px'}}>
              <InputGroup>
                <Form.Control
                  placeholder="Search specific plant"
                />
              </InputGroup>
            </div>

            <SideBySideContainer childrenMargin="50px" centerChildren>
              <Card 
                hasImg
                imgSrc="./assets/guide1.jpg"
                w="300px"
                title="title1"
                desc={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra laoreet leo, ac lobortis dui. <a href="?guideId=1">Read</a></>}
              />

              <Card 
                hasImg
                imgSrc="./assets/guide2.jpg"
                w="300px"
                title="title2"
                desc={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra laoreet leo, ac lobortis dui. <a href="?guideId=2">Read</a></>}
              />

              <Card 
                hasImg
                imgSrc="./assets/guide3.jpg"
                w="300px"
                title="title3"
                desc={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra laoreet leo, ac lobortis dui. <a href="?guideId=3">Read</a></>}
              />

              <Card 
                hasImg
                imgSrc="./assets/guide4.jpg"
                w="300px"
                title="title4"
                desc={<>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum viverra laoreet leo, ac lobortis dui. <a href="?guideId=4">Read</a></>}
              />
            </SideBySideContainer>
          </div>  
        :
          <Guide 
            guide={guide}
          />
        }
      </>
    );
  }
}
 
export default Guides;