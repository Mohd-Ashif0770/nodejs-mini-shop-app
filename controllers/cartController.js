const Cart = require("../models/cart");

// Add to cart function
module.exports.addToCart = async (req, res) => {
  try {
    // 🧩 Check if the logged-in user is a normal user, not an admin
    if (req.user.role === "admin") {
      req.flash("error", "Admins cannot add items to the cart.");
      return res.redirect("/admin"); // or wherever your admin home is
    }

    const { id } = req.params;
    const userId = req.user.userId; // Only valid for normal users

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId: id, quantity: 1 }] });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({ productId: id, quantity: 1 });
      }
    }

    await cart.save();
    req.flash("success", "Item added to cart.");
    res.redirect("/shop");
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    req.flash("error", "Could not add item to cart.");
    res.status(500).send("Error adding to cart");
  }
};

// View cart function
module.exports.viewCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    const cartItems = cart ? cart.items : [];
    res.render("user/cart", { cart: cartItems });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error viewing cart");
  }
};

// Remove from cart function
module.exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params; // Product ID
    const userId = req.user.userId;

    await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId: id } } }
    );

    req.flash("error", "Item removed from cart.");
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    req.flash("error", "Could not remove item.");
    res.status(500).send("Error removing from cart");
  }
};

// Update cart item quantity function
module.exports.updateCartItemQty = async (req, res) => {
  try {
    // console.log("Request Body:", req.body); // Debugging line

    const { id } = req.params; // Product ID
    const { action } = req.body; // 'increase' or 'decrease'
    const userId = req.user.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      req.flash("error", "Cart not found.");
      return res.status(404).send("Cart not found");
    }

    const item = cart.items.find((it) => it.productId.toString() === id);
    if (!item) {
      req.flash("error", "Item not found in cart.");
      return res.status(404).send("Item not found in cart");
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity = Math.max(1, item.quantity - 1); // prevent going below 1
    } else {
      req.flash("error", "Invalid action.");
      return res.status(400).redirect("/cart");
    }

    await cart.save();
    req.flash("success", "Cart updated.");
    res.redirect("/cart");
  } catch (error) {
    console.error(error);
    req.flash("error", "Could not update cart.");
    res.status(500).send("Error updating cart item quantity");
  }
};
