import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";

axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

class ApiConfig extends Component {
  componentDidMount() {
    this.setupAxiosInterceptors();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.token !== this.props.token) {
      this.setupAxiosInterceptors(); // Reconfigure interceptors if token changes
    }
  }

  setupAxiosInterceptors = () => {
    const { token } = this.props; // Fetch the token from props
    // Remove existing interceptors to prevent duplication
    axios.interceptors.request.eject(this.interceptor);

    this.interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  };

  render() {
    return null; // This component only sets up interceptors, no UI needed
  }
}

const mapStateToProps = (state) => ({
  token: state.token.token, // Adjust according to your Redux state structure
});

export default connect(mapStateToProps)(ApiConfig);
