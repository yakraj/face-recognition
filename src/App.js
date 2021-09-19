import React, { Component } from "react";
import "./App.css";
import Navigation from "./Components/Navigation/Navigation";
import Logo from "./Components/Logo/Logo";
import "tachyons";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Rank from "./Components/Rank/Rank";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import Particles from "react-particles-js";
import Clarifai from "clarifai";

const app = new Clarifai.App({
  apiKey: "a15bf327f27c4b7fa50f9d4fbd8cc8b0",
});
const particlesOptions = {
  particles: {
    number: {
      value: 100,
    },
    size: {
      value: 3,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
};

const initialState = {
  input: "",
  ImageUrl: "",
  box: "",
  route: "Signin",
  isSignedIn: false,
  html: "",
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    html: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
        html: user.html,
      },
    });
  };

  loadhtml = (data) => {
    this.setState({ html: data.htmlvalue });
  };

  calculateFaceLocation = (data) => {
    return data.outputs[0].data.regions;
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        if (response) {
          fetch("https://smart-face-recogniz.herokuapp.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      });
  };

  //  onSubmit = () => {
  //     app.models
  //       .predict(
  //         // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
  //         // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
  //         // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
  //         // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
  //         // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
  //         // so you would change from:
  //         // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
  //         // to:
  //         // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
  //         Clarifai.FACE_DETECT_MODEL,
  //         this.state.input)
  //       .then(response => {
  //         if (response) {
  //           fetch('https://smart-face-recogniz.herokuapp.com/image', {
  //             method: 'put',
  //             headers: {'Content-Type': 'application/json'},
  //             body: JSON.stringify({
  //               id: this.state.user.id
  //             })
  //           })
  //             .then(response => response.json())
  //             .then(count => {
  //               this.setState(Object.assign(this.state.user, { entries: count}))
  //             })

  //         }
  //       })
  //     }

  onRouteChange = (route) => {
    if (route === "Signout") {
      this.setState(initialState);
      this.setState({ imageUrl: "" });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />

        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              html={this.state.user.html}
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              style={{ width: "70%" }}
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                padding: "5px",
              }}
            >
              <FaceRecognition
                box={this.state.box}
                ImageUrl={this.state.imageUrl}
              />
              {this.state.imageUrl && (
                <div
                  className="ImageCount"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    width: "30%",
                  }}
                >
                  <h2
                    style={{
                      transition: "all 0.3s",
                      margin: "2px",
                      fontSize: "2rem",
                    }}
                  >
                    Face Count
                  </h2>
                  <h1
                    style={{
                      fontSize: "8rem",
                      fontFamily: "sans-serif",
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {this.state.box.length}
                  </h1>
                </div>
              )}
            </div>
          </div>
        ) : this.state.route === "Signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
