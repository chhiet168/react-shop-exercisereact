import { useState, useEffect } from "react";
import "./App.css";

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 650, icon: "💻", tag: "🎄 Christmas Sale" },
  { id: 2, name: "Mouse", price: 15, icon: "🖱️", tag: "🎁 Gift Idea" },
  { id: 3, name: "Keyboard", price: 25, icon: "⌨️", tag: "✨ Mechanical" },
  { id: 4, name: "Monitor", price: 120, icon: "🖥️", tag: "❄️ Holiday Deal" },
];

// រៀបចំគ្រាប់ព្រិលធ្លាក់រត់កាត់អេក្រង់ (Snowfall Effect)
function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState([]);

  useEffect(() => {
    const flakes = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 6 + 4,
      delay: Math.random() * 10,
      duration: Math.random() * 8 + 6,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="snow-container">
      {snowflakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            opacity: f.opacity,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("shop"); // "shop" | "cart" | "checkout" | "confirm"
  const [cart, setCart] = useState([]);

  const [customer, setCustomer] = useState({
    firstName: "Yoeum",
    lastName: "Sochhiet",
    email: "sochhiet2026@gmail.com",
    phone: "",
    address: "",
    shippingMethod: "free",
  });

  const [errors, setErrors] = useState({});
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const addToCart = (product) => {
    const exist = cart.find((item) => item.id === product.id);
    if (exist) {
      setCart(cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item)));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, amount) => {
    setCart(
      cart
        .map((item) => (item.id === id ? { ...item, qty: item.qty + amount } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shippingCost =
    customer.shippingMethod === "express" ? 9 : customer.shippingMethod === "standard" ? 5 : 0;
  const grandTotal = subtotal + shippingCost;

  const handleChange = (field, value) => {
    setCustomer({ ...customer, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!customer.firstName.trim()) newErrors.firstName = "សូមបញ្ចូល First Name";
    if (!customer.lastName.trim()) newErrors.lastName = "សូមបញ្ចូល Last Name";
    if (!customer.email.trim()) {
      newErrors.email = "សូមបញ្ចូល Email";
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "ទម្រង់ Email មិនត្រឹមត្រូវទេ";
    }
    if (!customer.phone.trim()) {
      newErrors.phone = "សូមបញ្ចូល Phone Number";
    }
    if (!customer.address.trim()) newErrors.address = "សូមបញ្ចូល Address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setConfirmedOrder({
      orderId: "ORD-0001",
      customerName: `${customer.firstName} ${customer.lastName}`,
      orderDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      orderedProducts: [...cart],
      shippingCost,
      totalAmount: grandTotal,
      status: "Pending",
    });

    setCart([]);
    setPage("confirm");
  };

  const totalItems = cart.reduce((s, item) => s + item.qty, 0);

  return (
    <div className="container christmas-theme">
      {/* ព្រិលធ្លាក់រត់កាត់ (Snowfall) */}
      <SnowEffect />

      {/* Header Navigation */}
      <header className="navbar christmas-navbar">
        <div className="brand-box" onClick={() => setPage("shop")}>
          <div className="brand-logo">🎅 Chhiet Store 🎄</div>
          <span className="owner-tag merry-tag">Merry Christmas</span>
        </div>

        <div className="nav-right">
          <div className="nav-btns">
            <button className={page === "shop" ? "active" : ""} onClick={() => setPage("shop")}>
              🔔 Products
            </button>
            <button className={page === "cart" ? "active" : ""} onClick={() => setPage("cart")}>
              🛒 Cart {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
            <button
              className={page === "checkout" ? "active" : ""}
              onClick={() => setPage("checkout")}
              disabled={cart.length === 0}
            >
              🎁 Checkout
            </button>
          </div>

          <div className="user-profile">
            <div className="avatar santa-avatar">🎅</div>
            <span className="user-name">Chhiet</span>
          </div>
        </div>
      </header>

      {/* ១. ទំព័រ Products */}
      {page === "shop" && (
        <div>
          <div className="hero-banner christmas-banner">
            <div className="banner-content">
              <h2>Merry Christmas, Chhiet! ❄️✨</h2>
              <p>រីករាយបុណ្យណូអែល! រីករាយការបញ្ចុះតម្លៃពិសេសលើឧបករណ៍បច្ចេកវិទ្យា</p>
            </div>
            <div className="banner-decor">🎄🎁☃️</div>
          </div>

          <h3 className="section-title">🎄 Featured Holiday Products</h3>
          <div className="grid">
            {PRODUCTS.map((p) => (
              <div key={p.id} className="card product-card christmas-card">
                <span className="product-tag xmas-tag">{p.tag}</span>
                <div className="icon xmas-icon-box">{p.icon}</div>
                <h4>{p.name}</h4>
                <p className="price">${p.price}</p>
                <button className="btn-primary xmas-btn full" onClick={() => addToCart(p)}>
                  🎁 Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ២. ទំព័រ Shopping Cart */}
      {page === "cart" && (
        <div>
          <h3 className="section-title">🛒 Shopping Cart</h3>
          {cart.length === 0 ? (
            <div className="card empty christmas-card">
              <div className="decor-icon">☃️</div>
              <p>មិនទាន់មានទំនិញក្នុងកន្ត្រកទេ!</p>
              <button className="btn-primary xmas-btn" onClick={() => setPage("shop")}>
                Go Shopping 🎄
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="card christmas-card">
                {cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    <div className="item-info">
                      <span className="small-icon">{item.icon}</span>
                      <div>
                        <strong>{item.name}</strong>
                        <p className="muted">${item.price} / item</p>
                      </div>
                    </div>

                    <div className="qty-controls">
                      <button onClick={() => updateQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>

                    <div className="item-right">
                      <strong>${item.price * item.qty}</strong>
                      <button className="btn-remove" onClick={() => removeItem(item.id)}>
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card summary christmas-card">
                <h4>🎁 Order Summary</h4>
                <div className="sum-row">
                  <span>Subtotal:</span>
                  <span>${subtotal}</span>
                </div>
                <hr />
                <div className="sum-row total">
                  <span>Grand Total:</span>
                  <span>${subtotal}</span>
                </div>
                <button className="btn-primary xmas-btn full" onClick={() => setPage("checkout")}>
                  Proceed to Checkout →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ៣. ទំព័រ Checkout Form */}
      {page === "checkout" && (
        <div>
          <h3 className="section-title">🎁 Checkout Form</h3>
          <div className="cart-layout">
            <form className="card christmas-card" onSubmit={handlePlaceOrder} noValidate>
              <h4>❄️ Shipping Address & Customer Info</h4>

              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={customer.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                  {errors.firstName && <span className="error">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={customer.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                  {errors.lastName && <span className="error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    placeholder="012 345 678"
                    value={customer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Address *</label>
                <textarea
                  rows="3"
                  placeholder="House No, Street, City..."
                  value={customer.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                />
                {errors.address && <span className="error">{errors.address}</span>}
              </div>

              <h4>🚚 Shipping Method</h4>
              <div className="ship-grid">
                <label className={`ship-box ${customer.shippingMethod === "free" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={customer.shippingMethod === "free"}
                    onChange={() => handleChange("shippingMethod", "free")}
                  />
                  <div>
                    <strong>Free Shipping</strong>
                    <p className="muted">7-20 Days</p>
                  </div>
                  <strong>$0</strong>
                </label>

                <label className={`ship-box ${customer.shippingMethod === "standard" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={customer.shippingMethod === "standard"}
                    onChange={() => handleChange("shippingMethod", "standard")}
                  />
                  <div>
                    <strong>Standard</strong>
                    <p className="muted">3-5 Days</p>
                  </div>
                  <strong>$5</strong>
                </label>

                <label className={`ship-box ${customer.shippingMethod === "express" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="shipping"
                    checked={customer.shippingMethod === "express"}
                    onChange={() => handleChange("shippingMethod", "express")}
                  />
                  <div>
                    <strong>Express (Sleigh)</strong>
                    <p className="muted">1-3 Days</p>
                  </div>
                  <strong>$9</strong>
                </label>
              </div>

              <div className="btn-group">
                <button type="button" className="btn-secondary" onClick={() => setPage("cart")}>
                  ← Back to Cart
                </button>
                <button type="submit" className="btn-primary xmas-btn">
                  Place Order 🎄
                </button>
              </div>
            </form>

            <div className="card summary christmas-card">
              <h4>📋 Order Summary</h4>
              {cart.map((item) => (
                <div key={item.id} className="sum-row">
                  <span>{item.name} (x{item.qty})</span>
                  <span>${item.price * item.qty}</span>
                </div>
              ))}
              <hr />
              <div className="sum-row">
                <span>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              <div className="sum-row">
                <span>Shipping:</span>
                <span>${shippingCost}</span>
              </div>
              <hr />
              <div className="sum-row total">
                <span>Grand Total:</span>
                <span>${grandTotal}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ៤. ទំព័រ Order Confirmation */}
      {page === "confirm" && confirmedOrder && (
        <div className="card confirm-card christmas-card receipt-card">
          <div className="success-banner christmas-success">
            🎉 Order Placed Successfully! Merry Christmas! 🎄
          </div>

          <div className="confirm-details">
            <div className="detail-row">
              <span>Order ID:</span>
              <strong>{confirmedOrder.orderId}</strong>
            </div>
            <div className="detail-row">
              <span>Customer Name:</span>
              <strong>{confirmedOrder.customerName}</strong>
            </div>
            <div className="detail-row">
              <span>Order Date:</span>
              <strong>{confirmedOrder.orderDate}</strong>
            </div>
            <div className="detail-row">
              <span>Order Status:</span>
              <span className="status-badge xmas-status">{confirmedOrder.status}</span>
            </div>
          </div>

          <hr />

          <h4>📦 Ordered Products</h4>
          <table className="confirm-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>QTY</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {confirmedOrder.orderedProducts.map((item) => (
                <tr key={item.id}>
                  <td>{item.icon} {item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.qty}</td>
                  <td><strong>${item.price * item.qty}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="confirm-totals xmas-totals">
            <div className="sum-row">
              <span>Shipping Cost:</span>
              <span>${confirmedOrder.shippingCost}</span>
            </div>
            <div className="sum-row total">
              <span>Total Amount:</span>
              <span>${confirmedOrder.totalAmount}</span>
            </div>
          </div>

          <button className="btn-primary xmas-btn full" onClick={() => setPage("shop")}>
            Continue Shopping 🎄
          </button>
        </div>
      )}
    </div>
  );
}