const nodemailer = require('nodemailer')
const tranporter = nodemailer.createTransport({
  service: 'email',
  auth: {
    user: 'myemail',
    pass: "mypassword"
  }
})

const sendOrderStatusEmail = async (toEmail, status, order) => {
  const mailOptions = {
    from: '"BookStore"<myemail>',
    to: toEmail,
    subject: `Order ${order._id} is now ${status}`,
    html: `  <h2>Hello ${order.user_id?.name || 'Customer'},</h2>
      <p>Your order status has been updated to <strong>${status}</strong>.</p>
      <ul>
        <li><strong>Order ID:</strong> ${order._id}</li>
        <li><strong>Book:</strong> ${order.book?.title}</li>
        <li><strong>Quantity:</strong> ${order.quantity}</li>
        <li><strong>Price:</strong> ₹${order.price}</li>
      </ul>
      <p>Thank you for ordering from BookStore!</p>`
  }
  await tranporter.sendMail(mailOptions)
}
module.exports=sendOrderStatusEmail;
