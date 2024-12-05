// Vue Instance
const webstore = new Vue({
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
        products: []
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
        canAddToCart(product) {
            return product.availableslots > 0;
        }
    },
    computed: {
        cartItemCount() {
            return this.cart.reduce((total, product) => total + product.quantity, 0);
        },
        totalPrice() {
            return this.cart.reduce((total, product) => total + (product.price * product.quantity), 0);
        }
    },
    mounted() {
        this.getLessons();
    }
});
