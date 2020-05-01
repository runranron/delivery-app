import React from "react";
import { connect } from "react-redux";
import { Switch, Route, useHistory } from "react-router";
import { Container, Col, Spinner } from "reactstrap";

import "./App.css";
import { setBaseURL } from "./services/http";
import { loginWithToken } from "./actions/session";
import { getVendors } from "./actions/vendor";
import Navbar from "./components/Navbar";
import VendorLanding from "./screens/vendor/Landing";
import RootLanding from "./screens/RootLanding";
import OrderHistory from "./screens/vendor/OrderHistory";
import Menu from "./screens/customer/Menu";
import Cart from "./screens/customer/Cart";
import EditMenu from "./screens/vendor/EditMenu";

setBaseURL(process.env.REACT_APP_API_URL);

function App(props) {
  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");
  if (authToken && !props.isLoggedIn && !props.isLoading) {
    props.loginWithToken(authToken, userType);
  }
  return (
    <Container className="App">
      <Navbar />
      {props.isLoading ? (
        <Spinner />
      ) : (
        <Switch>
          <Route path="/vendor" component={VendorLanding} />
          <Route path="/orderHistory" component={OrderHistory} />
          <Route path="/cart" component={Cart} />
          <Route path="/menu" component={Menu} />
          <Route path="/editMenu" component={EditMenu} />
          <Route path="/" component={RootLanding} />
        </Switch>
      )}
    </Container>
  );
}

const mapStateToProps = state => ({
  isLoggedIn: state.session.isLoggedIn,
  isLoading: state.session.isLoading
});

const mapDispatchToProps = {
  loginWithToken,
  getVendors
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
