import React from "react";
import { connect } from "react-redux";
import { Col, Container, Jumbotron } from "reactstrap";

import { Button, Row } from "../../components/styles";
import Login from "../../components/vendor/auth/Login";
import Register from "../../components/vendor/auth/Register";

class AuthContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authType: "",
      title: "",
      cta: "",
    };
  }

  componentDidMount() {
    this.setState({
      authType: "register",
      title: "Sign up.",
      cta: "Click here if you already have an account.",
    });
  }

  toggleAuthType() {
    let { authType, title, cta } = this.state;
    if (authType === "register") {
      authType = "login";
      title = "Sign In.";
      cta = "Click here if you need an account.";
    } else {
      authType = "register";
      title = "Sign Up.";
      cta = "Click here if you already have an account.";
    }
    this.setState({
      authType,
      title,
      cta,
    });
  }

  render() {
    return (
      <Container>
        <Jumbotron style={{ backgroundColor: "#F7F9FB" }}>
          <h1>Deliver, Denton.</h1>
        </Jumbotron>
        <Row>
          <Col>
            <Row>
              <ModalSelector authType={this.state.authType} />
            </Row>
            <Row>
              <Button
                color="link"
                onClick={this.toggleAuthType.bind(this)}
                buttonText={this.state.cta}
              />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

const ModalSelector = (props) => {
  return props.authType === "login" ? <Login /> : <Register />;
};

export default connect()(AuthContainer);
