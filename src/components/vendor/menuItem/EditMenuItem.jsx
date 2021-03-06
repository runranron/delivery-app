import React, { Component } from "react";
import { connect } from "react-redux";
import { CardBody, FormGroup, CardImg } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { editMenuItem } from "../../../actions/menu";
import {
  Form,
  Button,
  Col,
  Row,
  Label,
  Input,
  InputErrorMessage,
  TouchableHighlight,
  ModificationSelect,
  ModificationOption,
} from "../../styles";
import { formatImgurUrl } from "../../../services/formatting";
import EditModification from "./EditModification";
import { addMenuItem } from "../../../actions/menu";
import { colors } from "../../../constants/theme";

export class EditMenuItem extends Component {
  state = {
    name: "",
    imageUrl: "",
    description: "",
    price: "",
    modifications: [{}],
    editableMod: null,
    formErrors: {},
  };

  componentDidMount() {
    const { modifications, menuItem } = this.props;
    if (menuItem) {
      menuItem.modifications.forEach((menuItemMod) => {
        modifications.find((a) => (a._id === menuItemMod._id)).selected = true;
      });
    }
    this.setState({
      ...menuItem,
      modifications,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.modifications.length > prevProps.modifications.length) {
      this.setState({
        modifications: [
          ...this.state.modifications,
          this.props.modifications[this.props.modifications.length - 1],
        ],
      });
    }
  }

  handleChange({ target }) {
    this.setState({
      [target.name]: target.value,
    });
  }

  uploadImage() {
    const self = this;
    const req = new XMLHttpRequest();
    const formData = new FormData();
    const element = document.getElementsByClassName("input-image")[0].files[0];
    let imageUrl;

    formData.append("image", element);

    req.open("POST", "https://api.imgur.com/3/image/");
    req.setRequestHeader(
      "Authorization",
      `Client-ID ${process.env.REACT_APP_IMGUR_CLIENT}`
    );
    req.onreadystatechange = function () {
      if (req.status === 200 && req.readyState === 4) {
        let res = JSON.parse(req.responseText);
        imageUrl = `${res.data.id}`;
        self.setState({
          imageUrl,
        });
      }
    };
    req.send(formData);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { imageUrl, name, description, price, modifications } = this.state;
    const selectedMods = modifications.filter((m) => m.selected);
    if (!this.props.menuItem) {
      this.props.addMenuItem({
        imageUrl,
        name,
        description,
        price,
        modifications: selectedMods,
      });
    } else {
      this.props.editMenuItem(this.props.menuItem._id, {
        imageUrl,
        name,
        description,
        price,
        modifications: selectedMods,
      });
    }
  }

  handleModificationChange(modIndex, name, value, e) {
    if (e) e.preventDefault();
    const modifications = [...this.state.modifications];
    const mod = { ...modifications[modIndex] };
    mod[name] = value;
    modifications.splice(modIndex, 1, mod);
    this.setState({ modifications });
  }

  toggleModification(modificationIndex) {
    let { modifications, editableMod } = this.state;
    if (modificationIndex !== null) {
      const mod = modifications[modificationIndex];
      if (!mod.selected) {
        editableMod = mod;
      }
      modifications[modificationIndex].selected = !modifications[
        modificationIndex
      ].selected;
    }
    if (modificationIndex === null) {
      editableMod = null;
    }
    this.setState({ modifications, editableMod });
  }

  render() {
    return (
      <CardBody>
        <Form>
          <Row>
            <FormGroup>
              <Label to="image">Image</Label>
              <CardImg src={formatImgurUrl(this.state.imageUrl)} />
              <Input
                type="file"
                className="input-image"
                onChange={this.uploadImage.bind(this)}
              />
              <InputErrorMessage>
                {this.state.formErrors.imageUrl}
              </InputErrorMessage>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Label to="name">Name</Label>
              <Input
                name="name"
                value={this.state.name}
                onChange={this.handleChange.bind(this)}
              />
              <InputErrorMessage>
                {this.state.formErrors.name}
              </InputErrorMessage>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Label to="description">Description</Label>
              <Input
                name="description"
                value={this.state.description}
                onChange={this.handleChange.bind(this)}
              />
              <InputErrorMessage>
                {this.state.formErrors.description}
              </InputErrorMessage>
            </FormGroup>
          </Row>
          <Row>
            <FormGroup>
              <Label to="price">Price</Label>
              <Input
                name="price"
                value={this.state.price}
                onChange={this.handleChange.bind(this)}
              />
              <InputErrorMessage>
                {this.state.formErrors.price}
              </InputErrorMessage>
            </FormGroup>
          </Row>
          <Row>Modifications</Row>
          <Row>(click to select)</Row>
          <Row>
            <ModificationSelect>
              {this.state.modifications.map((existingMod, index) => {
                return (
                  <ModificationOption
                    key={existingMod._id}
                    value={index}
                    selected={existingMod.selected}
                    onClick={() => this.toggleModification(index)}
                  >
                    {existingMod.name}
                  </ModificationOption>
                );
              })}
            </ModificationSelect>
          </Row>
          <Row>
            <Col>
              <TouchableHighlight onClick={() => this.toggleModification(null)}>
                <FontAwesomeIcon icon={faPlusCircle} color={colors.primary100} />
                New Modification
              </TouchableHighlight>
            </Col>
          </Row>
          <Row>
            <EditModification modification={this.state.editableMod} />
          </Row>
          <Row>
            <Button
              onClick={(e) => this.handleSubmit(e)}
              title="Save Menu Item"
            />
          </Row>
        </Form>
      </CardBody>
    );
  }
}

const mapStateToProps = (state) => ({
  modifications: state.menu.modifications,
});

const mapDispatchToProps = {
  editMenuItem,
  addMenuItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditMenuItem);
