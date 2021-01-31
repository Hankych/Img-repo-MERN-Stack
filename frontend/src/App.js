import logo from './logo.svg';
import './App.css';
import React from 'react';
import axios from 'axios';
// package that allows file uploading easily
import FormData from 'form-data';

class App extends React.Component {
  // props are
  constructor(props) {
    super(props)

    //  the state of the component
    this.state = {
      searched_images: []
    };

    this.fileInput = React.createRef();
  }

  render() {
    return (
      <div className = "App">
        <div>
          <h1>Upload</h1>
        <input type = "file" accept ="image/*" ref = {this.fileInput}/>
        <button onClick ={async() => {
          console.log(this.fileInput.current.files[0])
          let formData = new FormData();
          formData.append("image", this.fileInput.current.files[0])

          let res = await axios({
            method: "post",
            url: "http://localhost:3000/image",
            headers: {"Content-Type": "multipart/form-data"},
            data: formData
          });
          console.log(res.data)
        }}>Upload File</button>
        </div>
        <div>
          <h1>Search</h1>
          <input type = "test" placeholder="tags here"/>
          <button onClick = {async() => {
            let res =  await axios.get("http://localhost:3000/search")
            this.setState({searched_images: res.data})
          }} >Search</button>
        </div>
        <div>
          <h1>Search Results</h1>
          {
            this.state.searched_images.map(
              link => <img src= {link} atl="result" key={link} style = {{maxWidth: "500px"}}/>
            )
          }
        </div>
      </div>
    );
  }
}

export default App;
