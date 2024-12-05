// Additional JavaScript for the fetch API 
const webstore = new Vue({
    el: '#app',
    data() {
        return {
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
            products: []
        };
    },
    methods: {
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
        matchesSearch(product) {
            const query = this.searchQuery.toLowerCase();
            return (
                product.subject.toLowerCase().includes(query) ||
                product.Location.toLowerCase().includes(query)
            );
        },
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
    },
    computed: {
        cartItemCount() {
            return this.cart.reduce((total, product) => total + product.quantity, 0);
        },
        totalPrice() {
            return this.cart.reduce((total, product) => total + (product.price * product.quantity), 0);
        },
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
        isOrderFormComplete() {
            return this.order.firstName && this.order.lastName && this.order.Address && this.order.City && this.order.State && this.order.Zip;
        }
    },
    mounted() {
        this.getLessons();
    }
});
