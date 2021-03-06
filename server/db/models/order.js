const Sequelize = require("sequelize")
const db = require("../db")
const Product = require("./product")

const Order = db.define("order", {
  totalPrice: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  totalQty: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  recipient: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  shippingAddress: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM(
      "cart",
      "cancelled",
      "purchased",
      "shipped",
      "delivered"
    ),
    allowNull: false,
    defaultValue: "cart",
  },
})

// Create a new "cart"
Order.createNewCart = function (productPrice, userId) {
  return Order.create({
    totalPrice: productPrice,
    totalQty: 1,
    recipient: "",
    shippingAddress: "",
    status: "cart",
    userId,
  })
}

// Find order of a user w/ "cart" status
Order.findCartOrder = function (id) {
  return Order.findOne({
    where: {
      userId: id,
      status: "cart",
    },
    include: [{ model: Product }],
  })
}

//Find order history of a user
Order.findUserOrder = function (id) {
  return Order.findAll({
    where: {
      userId: id,
      status: {
        [Sequelize.Op.not]: "cart",
      },
    },
  });
};

// Add single product to an order
Order.prototype.addProductToOrder = function (productId, price) {
  return this.addProduct(productId, {
    through: {
      itemQty: 1,
      itemPrice: price,
    },
  });
};

// Add an array of products to an order
Order.prototype.addProductsToOrder = function (products) {
  products.forEach(async (item) => {
    await this.addProduct(item.id, {
      through: {
        itemQty: item.count,
        itemPrice: item.subtotal,
      },
    })
  })
}

module.exports = Order
