import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCart } from "../store/cart";

class Cart extends Component {
  componentDidMount() {
    this.props.loadCart();

    // this.props.isLoggedIn && this.props.loadCart();
    //if user is not logged in, show guest cart
  }

  render() {
    console.log("this.props", this.props);
    //console.log("this.props.cart", this.props.cart);
    return <div>CART</div>;
  }
}

const mapState = (state) => {
  console.log("Cart state in mapState: ", state);
  return {
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadCart: () => dispatch(fetchCart()),
  };
};

export default connect(mapState, mapDispatch)(Cart);