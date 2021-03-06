import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  _addToCart,
  _clearCart,
  _removeFromCart,
  _subtractFromCart,
} from "../store/cartGuest";

class GuestCart extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const cartItems = this.props.cart || []

    return (
      <div className="cart">
        <h3>Shopping Cart</h3>
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th></th>
              <th>Qty</th>
              <th></th>
              <th>Price</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td
                  onClick={
                    item.count <= 1
                      ? () => this.props.deleteProduct(item)
                      : () => this.props.removeSingleProduct(item)
                  }
                >
                  {item.count > 0 ? <button> - </button> : ""}
                </td>
                <td>{item.count}</td>
                <td onClick={() => this.props.addProduct(item)}>
                  {item.quantity > 0 ? <button> + </button> : ""}
                </td>
                <td id="cart-price">${item.price}.00</td>
                <td id="cart-price">${item.subtotal}.00</td>
                <td onClick={() => this.props.deleteProduct(item)}>
                  {item.count > 0 ? <button> Delete </button> : ""}
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td id="cart-price">
                Total price:{" "}
                <strong id="totalPrice">
                  $
                  {cartItems.reduce((total, item) => {
                    return item.subtotal + total
                  }, 0)}
                  .00
                </strong>
              </td>
              <td></td>
            </tr>
          </tbody>
        </table>
        <div className="cart-buttons">
          <Link to="/">
            <button className="cart-button">Continue shopping</button>
          </Link>
          <button
            className="tiny secondary"
            id="clear"
            onClick={() => this.props.clearCart()}
          >
            Clear the cart
          </button>
          <Link to="/checkout">
            <button className="cart-button">Proceed to checkout</button>
          </Link>
        </div>
      </div>
    )
  }
}

const mapGuest = (state) => {
  return {
    cart: state.cartGuest,
  }
}

const mapGuestDispatch = (dispatch) => {
  return {
    removeSingleProduct: (product) => dispatch(_subtractFromCart(product)),
    deleteProduct: (product) => dispatch(_removeFromCart(product)),
    addProduct: (product) => dispatch(_addToCart(product)),
    clearCart: () => dispatch(_clearCart()),
  }
}

// export default connect(mapState, mapDispatch)(Cart);
export default connect(mapGuest, mapGuestDispatch)(GuestCart);
