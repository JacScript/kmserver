// Generates a short, human-readable invoice number like "KM-20260627-J3F9K".
// Not strictly sequential — fine for a low-volume storefront like this one,
// since the schema also enforces uniqueness as a backstop.
function generateInvoiceNumber() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `KM-${datePart}-${randomPart}`;
}

// Turns an Order document into the plain-text message that gets pre-filled
// into the WhatsApp share link. Kept as plain text (with WhatsApp's own
// *bold* markup) rather than HTML, since that's all wa.me supports.
function formatInvoiceMessage(order) {
    const lines = [];

    lines.push("*New Nespresso Order*");
    lines.push(`Invoice: ${order.invoiceNumber}`);
    lines.push("");
    lines.push(`Customer: ${order.customer.name}`);
    lines.push(`Phone: ${order.customer.phone}`);
    if (order.customer.notes) {
        lines.push(`Notes: ${order.customer.notes}`);
    }
    lines.push("");
    lines.push("Items:");

    order.items.forEach((item) => {
        const variant = item.variant ? ` (${item.variant})` : "";
        const lineTotal = (item.unitPrice * item.quantity).toLocaleString("en-US");
        lines.push(`• ${item.quantity}x ${item.name}${variant} — TZS ${lineTotal}`);
    });

    lines.push("");
    lines.push(`Total: TZS ${order.totalPrice.toLocaleString("en-US")}`);

    return lines.join("\n");
}

module.exports = { generateInvoiceNumber, formatInvoiceMessage };