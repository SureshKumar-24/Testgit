require("dotenv").config();

const stripe = require("stripe")("sk_test_51MyZxPJC7o9g4pD4fSCb9OPABMrn9gRVimCDd47PLZu4gMORPd6mW9kkHNRiGNdCQQbe3paZ4GmqQiuqPBmW9TRz00QKoNk9zW");

class StripeMain {
  /**
   * @param {object} customer - The customer object with payment_method property
   */
  static async createCustomer(customer) {
    try {
      const paymentMethod = await stripe.paymentMethods.create(
        customer.payment_method
      );
      customer["payment_method"] = paymentMethod.id;
      customer["invoice_settings"] = {};
      customer["invoice_settings"]["default_payment_method"] = paymentMethod.id;
      const customer_obj = await stripe.customers.create(customer);
      return { customer: customer_obj, error: false };
    } catch (err) {
      return { customer: false, error: err };
    }
  }

  /**
   * @param {int} amount - amount in usd
   * @param {string} customer - customer id
   * @param {string} payment_method - payment method id
   */
  static async Pay(amount, customer, payment_method) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      confirm: true,
      customer: customer,
      payment_method: payment_method,
      payment_method_types: ["card"],
    });

    return paymentIntent;
  }

  /**
   * @param {string} customer - customer id
   * @param {object} payment_method - payment method object
   */

  static async NewPaymentMethod(customer, payment_method) {
    try{
      const paymentMethod = await stripe.paymentMethods.create(payment_method);
      const attach = await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer,
      });
  
      return { attach: attach, error: false };
    }
    catch (err) {
      return { attach: false, error: err };
    }
  }

  static async ListAllPaymentMethods(customer) {
    const paymentMethods = await stripe.customers.listPaymentMethods(customer, {
      type: "card",
    });

    return paymentMethods;
  }

  static async getPaymentMethod(id) {
    const paymentMethod = await stripe.paymentMethods.retrieve(
      id
    );

    return paymentMethod
  }
}

module.exports = StripeMain;