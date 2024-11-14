if (window.Cashfree) {
    let paymentSession;
    let cashfree;
    let cardComponent, cvvComponent, cardHolder, cardExpiry, save;
    let cashfreeOrder; // Will hold the Cashfree order details

    document.addEventListener("DOMContentLoaded", async () => {
        await fetchPaymentSession();  // Fetch session data from your backend
        renderItems();  // Render the order items
        await createCashfreeOrder();  // Create the Cashfree order on the backend
        initializeCashfreePayment();  // Initialize Cashfree SDK
    });

    // Get the payment session data including all details from Snipcart
    const fetchPaymentSession = async () => {
        const publicToken = new URLSearchParams(window.location.search).get('publicToken');
        console.log('Fetching payment session for publicToken:', publicToken); // Log for debugging

        try {
            const response = await axios.get(`https://vairaoosi.com/api/get-snipcart-session?publicToken=${publicToken}`);
            console.log('Response data:', response.data); // Log the complete response
        
            // Validate the session data structure more carefully
            if (response.data && response.data.invoice && Array.isArray(response.data.invoice.items)) {
                paymentSession = response.data;
                console.log('Payment session successfully fetched:', paymentSession);
        
                // Show the content after loading the payment session data
                document.querySelector('#cartcontent').classList.remove('hidden'); // Show content
                renderItems(); // Proceed to render items
            } else {
                console.error('Invalid session data or missing invoice/items:', response.data);
                throw new Error('Invalid payment session data');
            }
        
        } catch (e) {
            console.error('Error fetching payment session:', e.message || e);  // Log the error message
        }
        

    // Render the order items and totals based on the fetched session data
    const renderItems = () => {
        const productsContainer = document.querySelector('.text-price ul');
        let totalAmount = 0;  // Initialize total amount

        // Clear existing products (if any)
        productsContainer.innerHTML = '';

        // Log the items to check if it's an array
        console.log('Rendering items:', paymentSession.invoice.items);
        
        // Render the items from the payment session
        if (Array.isArray(paymentSession.invoice.items)) {
            paymentSession.invoice.items.forEach(item => {
                const productLi = document.createElement('li');
                productLi.innerHTML = `
                    <span class="text bold text-cap">${item.name}<br>QTy : ${item.quantity}</span>
                    <span class="number">${formatCurrency(item.amount)}</span>
                `;
                productsContainer.appendChild(productLi);
                totalAmount += item.amount; // Sum the total price of all items
            });
        } else {
            console.error('Items data is not an array or is missing');
        }

        // Update subtotal and total
        document.querySelector('#subtotal').textContent = formatCurrency(totalAmount);  // Update subtotal with the sum of items
        document.querySelector('#orderTotal').textContent = formatCurrency(totalAmount);  // Update total as well
    };

    // Format the amount based on the session's currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: paymentSession.invoice.currency }).format(amount);
    };

    // Create the Cashfree order on your backend (Cloudflare Workers)
    const createCashfreeOrder = async () => {
        const orderAmount = paymentSession.invoice.amount;
        const currency = paymentSession.invoice.currency;

        try {
            const response = await axios.post('https://vairaoosi.com/api/create-cashfree-order', {
                snipcartData: paymentSession,
                orderAmount: orderAmount,
                currency: currency,
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            cashfreeOrder = response.data.cashfreeData; // Store the order details including cf_order_id
            console.log('Cashfree order created:', cashfreeOrder);

        } catch (e) {
            console.error('Error creating Cashfree order:', e);
            alert("Failed to create Cashfree order. Please try again later.");
        }
    };

    // Initialize Cashfree payment SDK
    const initializeCashfreePayment = () => {
        if (!cashfreeOrder) {
            alert("Cashfree order not created yet.");
            return;
        }

        cashfree = Cashfree({
            mode: "sandbox",  // Switch to "production" for live environments
        });

        const styleObject = {
            fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Poppins" }],
            base: {
                fontSize: "14px",
                fontFamily: "Poppins",
                backgroundColor: "#FFFFFF",
                border: "1px solid #e6e6e6",
                padding: "27px",
                color: "#000000",
            },
            invalid: {
                color: "#df1b41",
            },
        };

        // Set up Cashfree card components
        cardComponent = cashfree.create("cardNumber", { style: styleObject });
        cardComponent.mount("#cardNumber");

        cvvComponent = cashfree.create("cardCvv", { style: styleObject });
        cvvComponent.mount("#cardCvv");

        cardHolder = cashfree.create("cardHolder", { style: styleObject });
        cardHolder.mount("#cardHolder");

        cardExpiry = cashfree.create("cardExpiry", { style: styleObject });
        cardExpiry.mount("#cardExpiry");

        save = cashfree.create("savePaymentInstrument", { style: styleObject });
        save.mount("#save");

        // Enable/Disable payment button based on form completion
        const paymentBtn = document.getElementById("payNow");

        function toggleBtn() {
            if (
                cardExpiry.isComplete() &&
                cardHolder.isComplete() &&
                cardComponent.isComplete() &&
                cvvComponent.isComplete()
            ) {
                paymentBtn.disabled = false;
            } else {
                paymentBtn.disabled = true;
            }
        }

        // Monitor field changes and toggle the button
        cardExpiry.on("change", toggleBtn);
        cardHolder.on("change", toggleBtn);
        cardComponent.on("change", function (data) {
            cvvComponent.update({ cvvLength: data.value.cvvLength });
            toggleBtn();
        });
        cvvComponent.on("change", toggleBtn);

        // Handle the payment button click
        paymentBtn.addEventListener("click", async () => {
            document.querySelector('#paymentMessage').textContent = '';  // Clear previous messages
            document.querySelector('#button_loader').classList.remove('hidden');

            // Validate form completion before attempting payment
            if (cardExpiry.isComplete() && cardHolder.isComplete() && cardComponent.isComplete() && cvvComponent.isComplete()) {
                try {
                    const paymentData = await cashfree.pay({
                        paymentMethod: cardComponent,
                        paymentSessionId: cashfreeOrder.cf_order_id,  // Use the Cashfree order ID here
                        savePaymentInstrument: save,  // Optional: for saving card details
                    });

                    if (paymentData.error) {
                        document.querySelector('#paymentMessage').innerText = paymentData.error.message;
                    } else {
                        document.querySelector('#paymentMessage').innerText = "Payment successful!";
                        // Optionally, handle payment success (e.g., redirect or show a confirmation message)
                    }
                } catch (error) {
                    console.error(error);
                    document.querySelector('#paymentMessage').innerText = "An error occurred during payment.";
                } finally {
                    document.querySelector('#button_loader').classList.add('hidden');
                }
            } else {
                alert("Please complete all payment details.");
                document.querySelector('#button_loader').classList.add('hidden');
            }
        });
    };

} else {
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector('#compatibility').classList.remove('hidden');
    });
}
