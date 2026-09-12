/**
 * Utility for generating and printing professional A4 PDF invoices
 * for Kawaiisubete / Brickverse orders.
 */

export interface OrderItem {
  id?: number | string;
  product_name?: string;
  name?: string;
  price: number | string;
  quantity: number;
  sku?: string;
}

export interface OrderInvoiceData {
  id?: number | string;
  order_number: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address?: string;
  city?: string;
  total_amount: number | string;
  status?: string;
  tracking_number?: string;
  carrier?: string;
  created_at?: string;
  items?: OrderItem[];
  discount_code?: string;
  discount_amount?: number | string;
}

export function generateInvoiceHtml(order: OrderInvoiceData): string {
  const items: OrderItem[] =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            product_name: `Order #${order.order_number}`,
            price: order.total_amount,
            quantity: 1,
            sku: `KS-${order.order_number}`,
          },
        ];

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * (item.quantity || 1),
    0
  );
  const totalAmount = Number(order.total_amount || subtotal);
  const deliveryFee = 0; // Standard Free Shipping or included
  const discountAmount = Number(order.discount_amount || 0);

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

  const formattedTime = order.created_at
    ? new Date(order.created_at).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  const statusLabel = (order.status || "Pending").toUpperCase();
  const statusColor =
    order.status === "delivered"
      ? "#1E9E64"
      : order.status === "shipped"
      ? "#2563EB"
      : order.status === "cancelled"
      ? "#DC2626"
      : "#D97706";

  const rowsHtml = items
    .map((item, idx) => {
      const itemTitle = item.product_name || item.name || `Product Item #${idx + 1}`;
      const unitPrice = Number(item.price || 0);
      const qty = item.quantity || 1;
      const lineTotal = unitPrice * qty;
      const sku = item.sku || `KS-ITEM-${idx + 101}`;

      return `
        <tr style="border-bottom: 1px solid #E5E7EB;">
          <td style="padding: 10px 8px; text-align: center; color: #6B7280; font-size: 11px;">${idx + 1}</td>
          <td style="padding: 10px 12px;">
            <div style="font-weight: 700; color: #111827; font-size: 12px; line-height: 1.3;">${itemTitle}</div>
            <div style="font-size: 10px; color: #6B7280; margin-top: 2px;">SKU: ${sku}</div>
          </td>
          <td style="padding: 10px 12px; text-align: right; font-family: monospace; font-size: 12px; color: #374151;">
            ৳${unitPrice.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </td>
          <td style="padding: 10px 12px; text-align: center; font-weight: 700; font-size: 12px; color: #111827;">
            ${qty}
          </td>
          <td style="padding: 10px 12px; text-align: right; font-weight: 700; font-family: monospace; font-size: 12px; color: #111827;">
            ৳${lineTotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice #${order.order_number} - Kawaiisubete</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1F2937;
      background-color: #FFFFFF;
      font-size: 12px;
      line-height: 1.45;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      padding: 10px 0;
    }
    .top-accent-bar {
      height: 6px;
      background: linear-gradient(90deg, #FF4D6D 0%, #7B5CFF 100%);
      border-radius: 4px;
      margin-bottom: 24px;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .brand-logo {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #171136;
      display: inline-block;
    }
    .brand-logo span {
      color: #FF4D6D;
    }
    .brand-sub {
      font-size: 10.5px;
      color: #6B7280;
      margin-top: 3px;
      font-weight: 500;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: 900;
      color: #171136;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      text-align: right;
    }
    .invoice-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      color: white;
      background-color: ${statusColor};
      margin-top: 4px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      background-color: #FAF5FF;
      border: 1px solid #E9D5FF;
      border-radius: 10px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .meta-box {
      padding: 14px 16px;
      vertical-align: top;
    }
    .meta-label {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #7B5CFF;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .meta-value {
      font-size: 12px;
      font-weight: 700;
      color: #171136;
    }
    .meta-sub {
      font-size: 11px;
      color: #4B5563;
      margin-top: 2px;
      line-height: 1.35;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      overflow: hidden;
    }
    .items-table th {
      background-color: #F3F4F6;
      color: #374151;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 10px 12px;
      border-bottom: 1px solid #D1D5DB;
    }
    .summary-container {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .terms-box {
      background-color: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 12px 14px;
      font-size: 10px;
      color: #4B5563;
      line-height: 1.45;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
    }
    .totals-table td {
      padding: 5px 8px;
      font-size: 11.5px;
    }
    .total-row-grand {
      background-color: #FFF1F4;
      border-top: 2px solid #FF4D6D;
      border-bottom: 2px solid #FF4D6D;
    }
    .total-row-grand td {
      padding: 10px 8px;
      font-size: 14px;
      font-weight: 900;
      color: #FF4D6D;
    }
    .footer-section {
      border-top: 1px solid #E5E7EB;
      padding-top: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: #6B7280;
      font-size: 10px;
    }
    .signature-box {
      text-align: right;
      padding-top: 24px;
    }
    .signature-line {
      width: 160px;
      border-bottom: 1px dashed #9CA3AF;
      margin-bottom: 4px;
      display: inline-block;
    }
  </style>
</head>
<body>
  <div class="invoice-wrapper">
    <div class="top-accent-bar"></div>

    <!-- Top Header -->
    <table class="header-table">
      <tr>
        <td style="vertical-align: top; width: 55%;">
          <div class="brand-logo">Kawaii<span>subete</span></div>
          <div class="brand-sub">Premium Anime Collectibles & Figures</div>
          <div style="font-size: 10.5px; color: #4B5563; margin-top: 6px; line-height: 1.4;">
            <strong>Kawaiisubete Store</strong><br>
            Dhaka, Bangladesh<br>
            Email: support@kawaiisubete.com • Web: https://kawaiisubete.com
          </div>
        </td>
        <td style="vertical-align: top; text-align: right; width: 45%;">
          <div class="invoice-title">INVOICE</div>
          <div style="font-family: monospace; font-size: 14px; font-weight: 800; color: #171136; margin-top: 2px;">
            #${order.order_number}
          </div>
          <div><span class="invoice-badge">${statusLabel}</span></div>
          <div style="font-size: 11px; color: #4B5563; margin-top: 6px;">
            <strong>Issue Date:</strong> ${formattedDate} ${formattedTime}<br>
            <strong>Payment:</strong> Cash on Delivery (COD) / Online
          </div>
        </td>
      </tr>
    </table>

    <!-- Billing & Shipping Information -->
    <table class="meta-table">
      <tr>
        <td class="meta-box" style="width: 50%; border-right: 1px solid #E9D5FF;">
          <div class="meta-label">Customer & Delivery Details</div>
          <div class="meta-value">${order.customer_name || "Valued Customer"}</div>
          <div class="meta-sub">
            ${order.shipping_address ? `📍 ${order.shipping_address}<br>` : ""}
            ${order.customer_phone ? `📞 ${order.customer_phone}<br>` : ""}
            ${order.customer_email ? `✉️ ${order.customer_email}` : ""}
          </div>
        </td>
        <td class="meta-box" style="width: 50%;">
          <div class="meta-label">Shipping & Logistics</div>
          <div class="meta-value">${order.carrier || "Pathao Express / Standard"}</div>
          <div class="meta-sub">
            <strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: 700; color: #171136;">${order.tracking_number || "Auto-assigned on dispatch"}</span><br>
            <strong>Transit Time:</strong> 24-48 Hours Nationwide<br>
            <strong>Payment Method:</strong> Cash on Delivery (COD)
          </div>
        </td>
      </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 6%; text-align: center;">#</th>
          <th style="width: 52%; text-align: left;">Item Description</th>
          <th style="width: 15%; text-align: right;">Unit Price</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 17%; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- Summary & Terms -->
    <table class="summary-container">
      <tr>
        <td style="vertical-align: top; width: 52%; padding-right: 16px;">
          <div class="terms-box">
            <strong style="color: #1F2937; display: block; margin-bottom: 4px;">Important Note & Policies:</strong>
            1. Please verify all parcel items in front of the delivery person.<br>
            2. For damages or missing pieces, contact us within 24 hours of delivery with your Order ID.<br>
            3. 7-day hassle-free replacement on manufacturer defective products.<br>
            4. Thank you for shopping with <strong>Kawaiisubete</strong>!
          </div>
        </td>
        <td style="vertical-align: top; width: 48%;">
          <table class="totals-table">
            <tr>
              <td style="color: #6B7280; font-weight: 600;">Items Subtotal:</td>
              <td style="text-align: right; font-family: monospace; font-weight: 700; color: #374151;">
                ৳${subtotal.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </td>
            </tr>
            <tr>
              <td style="color: #6B7280; font-weight: 600;">Delivery Charge:</td>
              <td style="text-align: right; font-family: monospace; font-weight: 700; color: #059669;">
                ৳${deliveryFee.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} (Free)
              </td>
            </tr>
            ${
              discountAmount > 0
                ? `
            <tr>
              <td style="color: #6B7280; font-weight: 600;">Discount (${order.discount_code || "Promo"}):</td>
              <td style="text-align: right; font-family: monospace; font-weight: 700; color: #DC2626;">
                -৳${discountAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </td>
            </tr>
            `
                : ""
            }
            <tr class="total-row-grand">
              <td>Total Payable:</td>
              <td style="text-align: right; font-family: monospace;">
                ৳${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Footer -->
    <div class="footer-section">
      <div>
        <p>This is a computer-generated invoice and requires no physical signature.</p>
        <p style="margin-top: 2px;">Generated on ${new Date().toLocaleString("en-US")}</p>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <p style="font-weight: 700; color: #374151; font-size: 10.5px;">Authorized Signatory</p>
        <p style="color: #9CA3AF; font-size: 9.5px;">Kawaiisubete Operations</p>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.focus();
        window.print();
      }, 300);
    };
  </script>
</body>
</html>
  `;
}

/**
 * Trigger an isolated, clean A4 PDF print dialog for a specific order.
 */
export function printOrderInvoice(order: OrderInvoiceData): void {
  if (typeof window === "undefined") return;

  const htmlContent = generateInvoiceHtml(order);

  // Method 1: Using an invisible iframe for seamless print dialog without leaving the page
  try {
    const existingIframe = document.getElementById("invoice-print-frame");
    if (existingIframe) {
      existingIframe.remove();
    }

    const iframe = document.createElement("iframe");
    iframe.id = "invoice-print-frame";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document || iframe.contentDocument;
    if (doc) {
      doc.open();
      doc.write(htmlContent);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn("Iframe print failed, falling back to popup window:", e);
          fallbackPrintWindow(htmlContent);
        }
      }, 350);
      return;
    }
  } catch (err) {
    console.warn("Iframe creation failed:", err);
  }

  // Method 2: Fallback window popup
  fallbackPrintWindow(htmlContent);
}

function fallbackPrintWindow(htmlContent: string) {
  const printWindow = window.open("", "_blank", "width=850,height=900,menubar=no,toolbar=no,location=no,status=no");
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }
}
