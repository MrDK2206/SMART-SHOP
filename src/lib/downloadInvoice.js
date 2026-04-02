export function downloadInvoice(order) {
  const invoiceHtml = `
    <html>
      <head>
        <title>Invoice ${order._id}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #172126; }
          h1, h2, p { margin: 0 0 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border: 1px solid #dbe3e8; padding: 10px; text-align: left; }
          th { background: #f5f7f8; }
        </style>
      </head>
      <body>
        <h1>Cartify Invoice</h1>
        <p>Order ID: ${order._id}</p>
        <p>Created: ${new Date(order.createdAt).toLocaleString()}</p>
        <p>Status: ${order.status}</p>
        <p>Total: ${order.totalPrice}</p>
        <h2>Items</h2>
        <table>
          <thead>
            <tr><th>Product</th><th>Quantity</th><th>Price</th></tr>
          </thead>
          <tbody>
            ${order.orderItems
              .map(
                (item) =>
                  `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${item.price}</td></tr>`
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob([invoiceHtml], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `invoice-${order._id}.html`;
  link.click();
  URL.revokeObjectURL(url);
}
