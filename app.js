// Additional JavaScript for the fetch API 
import Vue from 'vue';
new Vue({
  el: '#app',
  data: {
    sitename: 'After School Club',
    showProduct: true,
    States: {
      AJ: 'Ajman',
      DU: 'Dubai',
      FU: 'Fujairah',
      SH: 'Sharjah',
      UAQ: 'Umm Al-Quwain',
      RA: 'Ras Al Khaimah',
      AB: 'Abu Dhabi',
    },
    order: {
      firstName: '',
      lastName: '',
      Address: '',
      City: '',
      State: '',
      Zip: '',
      method: 'Home', // Delivery method
      sendGift: 'Send as a gift',
      dontSendGift: 'Do not send as a gift',
      gift: false // Gift checkbox state
    },
    cart: [],
    selectedSort: 'price',
    sortOrder: 'asc',
    searchQuery: '',
    products: [], // For storing products (lessons)
  },
  methods: {
    // Fetch products (lessons) from the backend API
    async getLessons() {
      try {
        const response = await fetch('https://m00909333-cst3144-backend-577777.onrender.com/collection/Lesson');
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const lessons = await response.json();
        console.log('Lessons:', lessons);
        this.products = lessons; // Store lessons in your Vue data
      } catch (error) {
        console.error('Error fetching lessons:', error);
      }
    },

    // Add a product to the cart
    addToCart(product) {
      let cartProduct = this.cart.find(item => item.id === product.id);
      if (cartProduct) {
        if (this.canAddToCart(product)) {
          cartProduct.quantity++;
          product.availableslots--;
        }
      } else {
        this.cart.push({ ...product, quantity: 1 });
        product.availableslots--;
      }
    },

    // Update the quantity of a product in the cart
    updateQuantity(item, amount) {
      let product = this.products.find(p => p.id === item.id);
      if (product) product.availableslots -= amount;
      item.quantity += amount;
      if (item.quantity <= 0) {
        const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
        if (index !== -1) this.cart.splice(index, 1);
      }
    },

    // Check if the product can be added to the cart
    canAddToCart(product) {
      return product.availableslots > 0;
    },

    // Toggle between product list and checkout page
    showCheckout() {
      this.showProduct = !this.showProduct;
    },

    // Submit the order to the backend
    async submitOrder() {
      const orderDetails = {
        customer: {
          firstName: this.order.firstName,
          lastName: this.order.lastName,
          address: this.order.Address,
          city: this.order.City,
          state: this.order.State,
          zip: this.order.Zip,
          method: this.order.method,
          gift: this.order.gift
        },
        items: this.cart.map(item => ({
          subject: item.subject,
          price: item.price,
          quantity: item.quantity
        })),
        totalPrice: this.totalPrice
      };

      console.log('Order details:', orderDetails);

      try {
        const response = await fetch('https://m00909333-cst3144-backend-577777.onrender.com/collection/Orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderDetails)
        });

        if (!response.ok) {
          throw new Error('Failed to place order');
        }

        const data = await response.json();
        alert('Order placed successfully!');
      } catch (error) {
        alert('Failed to place the order. Please try again.');
        console.error('Order Error:', error);
      }
    },
  },
  computed: {
    // Cart item count
    cartItemCount() {
      return this.cart.reduce((total, product) => total + product.quantity, 0);
    },

    // Total price of items in the cart
    totalPrice() {
      return this.cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    },

    // Sorted products based on selected sort criteria
    sortedProducts() {
      let sortedArray = [...this.products];
      sortedArray.sort((a, b) => {
        if (this.sortOrder === 'asc') {
          return a[this.selectedSort] > b[this.selectedSort] ? 1 : -1;
        } else {
          return a[this.selectedSort] < b[this.selectedSort] ? 1 : -1;
        }
      });
      return sortedArray;
    },

    // Check if the order form is complete
    isOrderFormComplete() {
      return this.order.firstName && this.order.lastName && this.order.Address && this.order.City && this.order.State && this.order.Zip;
    },
  },
  created() {
    this.getLessons(); // Fetch lessons when the Vue instance is created
  },
});
