const router = require("express").Router();
const {
  models: { Order, Product },
} = require("../db");
const { requireToken, hasToken } = require("./gatekeepingMiddleware");
module.exports = router;

// GET /api/orders - all orders & all the products in each order
router.get("/", requireToken, async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      include: [{ model: Product }],
    });
    res.send(orders);
  } catch (err) {
    next(err);
  }
});

//GET /api/orders/user/:userId - user's order history
router.get("/user/:userId", requireToken, async (req, res, next) => {
  try {
    if (req.user.id === Number(req.params.userId)) {
      const orders = await Order.findUserOrder(req.params.userId);
      res.send(orders);
    }
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id - a specific order w/ all the products in the order
router.get("/:id", requireToken, async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    res.send(order);
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders - create a "purchased" order or update a "cart" to "purchased"
// Also, decrement product qty in Product inventory
router.put("/", hasToken, async (req, res, next) => {
  try {
    const { userId, products } = req.body;
    products.forEach(async (item) => {
      const product = await Product.findByPk(item.id);
      await product.decrement({ quantity: item.count });
    });
    if (userId !== null) {
      const cart = await Order.findCartOrder(req.user.id);
      await cart.update(req.body);
      res.send(cart);
    } else {
      const newOrder = await Order.create(req.body);
      await newOrder.addProductsToOrder(products);
      res.send(newOrder);
    }
  } catch (err) {
    next(err);
  }
});
