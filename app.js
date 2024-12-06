// Additional JavaScript for the fetch API 
import Vue from 'vue';

let webstore = new Vue({
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
            AB: 'Abu Dhabi'
        },
        order: {
            firstName: '',
            lastName: '',
            Address: '',
            City: '',
            State: '',
            Zip: '',
            method: 'Home',
            sendGift: 'Send as a gift',
            dontSendGift: 'Do not send as a gift',
            gift: false
        },
        cart: [],
        selectedSort: 'price',
        sortOrder: 'asc',
        searchQuery: '',
        Lesson: [],
        products: []
    },
    methods: {
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
        updateQuantity(item, amount) {
            let product = this.products.find(p => p.id === item.id);
            if (product) product.availableslots -= amount;
            item.quantity += amount;
            if (item.quantity <= 0) {
                const index = this.cart.findIndex(cartItem => cartItem.id === item.id);
                if (index !== -1) this.cart.splice(index, 1);
            }
        },
        canAddToCart(product) {
            return product.availableslots > 0;
        },
        showCheckout() {
            this.showProduct = !this.showProduct;
        },
        async getLessons() {
            try {
                const response = await fetch('https://m00909333-cst3144-backend-577777.onrender.com/collection/Lesson');
                if (!response.ok) {
                    throw new Error('Failed to fetch lessons');
                }
                const lessons = await response.json();
                console.log('Lessons:', lessons);
                this.products = lessons;
            } catch (error) {
                console.error('Error fetching lessons:', error);
            }
        },
        async matchesSearch() {
            const response = await fetch(`/collection/lesson/${search}`);
        },
        async submitOrder() {
            try {
                // Prepare the order object
                const orderDetails = {
                    order: {
                        firstName: this.order.firstName,
                        lastName: this.order.lastName,
                        Address: this.order.Address,
                        City: this.order.City,
                        State: this.order.State,
                        Zip: this.order.Zip,
                        method: this.order.method,
                        gift: this.order.gift,
                        cart: this.cart.map(item => ({
                            id: item.id,
                            subject: item.subject,
                            quantity: item.quantity,
                            price: item.price,
                        }))
                    }
                };
        
                // Send the order to the backend
                const response = await fetch('https://m00909333-cst3144-backend-577777.onrender.com/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderDetails),
                });
        
                if (!response.ok) {
                    throw new Error(`Failed to submit order: ${response.statusText}`);
                }
        
                const result = await response.json();
        
                // Handle successful order submission
                alert('Order submitted successfully!');
                console.log('Order response:', result);
        
                // Clear the form and cart after successful submission
                this.order = {
                    firstName: '',
                    lastName: '',
                    Address: '',
                    City: '',
                    State: '',
                    Zip: '',
                    method: 'Home',
                    sendGift: 'Send as a gift',
                    dontSendGift: 'Do not send as a gift',
                    gift: false
                };
                this.cart = [];
                this.showProduct = true; // Redirect back to the product page
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('There was an issue submitting your order. Please try again.');
            }
        },
    },
    computed: {
        cartItemCount() {
            return this.cart.reduce((sum, item) => sum + item.quantity, 0);
        },
        totalPrice() {
            return this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        sortedProducts() {
            return [...this.products].sort((a, b) => {
                if (this.sortOrder === 'asc') return a[this.selectedSort] - b[this.selectedSort];
                else return b[this.selectedSort] - a[this.selectedSort];
            });
        },
        isOrderFormComplete() {
            return (
                this.order.firstName &&
                this.order.lastName &&
                this.order.Address &&
                this.order.City &&
                this.order.State &&
                this.order.Zip
            );
        },
    },
    mounted() {
        this.getLessons();
    },
});

