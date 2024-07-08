import React, { Component } from 'react';
import ForumPost from './forumPost';

class Forum extends Component {
  state = {
    forumMessages: [
      {
        author: "John Doe",
        body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        time: "July 12, 2024, 3:45 PM"
      },
      {
        author: "Sam Woods",
        body: "Vestibulum et sollicitudin nunc. Cras suscipit, risus quis ultrices semper, quam metus varius erat, sed elementum nunc odio eu augue.",
        time: "September 8, 2023, 10:30 AM"
      },
      {
        author: "Lisa Smith",
        body: "Nullam volutpat sagittis justo, eget pellentesque orci scelerisque non. Nulla eu nulla at quam facilisis dictum.",
        time: "November 25, 2025, 7:00 PM"
      },
      {
        author: "Stacy White",
        body: "Ut accumsan porta turpis. Proin rhoncus cursus enim, vitae varius nulla mattis eget. Sed non eros ipsum. ",
        time: "March 1, 2022, 6:15 AM"
      },
      {
        author: "Emily Whitney",
        body: "Nunc ac tellus porttitor, sollicitudin lorem non, porta velit!!",
        time: "December 31, 2021, 11:59 PM"
      },
    ]
  } 
  render() { 
    return (
      <div style={{padding: '25px'}}>
        {
          this.state.forumMessages.map(m => <><ForumPost author={m.author} time={m.time}>{m.body}</ForumPost><br /></>)
        }
      </div>
    );
  }
}
 
export default Forum;