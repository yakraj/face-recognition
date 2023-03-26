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
    loading: false,
  },
};

const PAT = "52fbfb45cb504f70aa3e71a9b601e617";
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = "yakraj";
const APP_ID = "my-first-application";
// Change these to whatever model and image URL you want to use
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "aa7f35c01e0642fda5cf400f543e7c40";
const IMAGE_URL =
  "https://churchanswers.com/wp-content/uploads/2022/03/Blog-Article-Picture-6.png";

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
    this.setState({ imageUrl: this.state.input, loading: true });
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        this.setState({ loading: false });
        if (result.outputs[0].data) {
          this.displayFaceBox(this.calculateFaceLocation(result));

          fetch("https://smart-brain.cleverapps.io/image", {
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
        } else {
          window.alert("Not a valid Image URL.");
        }
      })
      .catch((error) => console.log("error", error));
  };

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
                  style={{
                    width: "30%",
                  }}
                >
                  {this.state.loading ? (
                    <div>
                      <img
                        alt="loading"
                        width="200px"
                        src={require("./loading.webp")}
                      />
                    </div>
                  ) : (
                    <div
                      className="ImageCount"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: "100%",
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
