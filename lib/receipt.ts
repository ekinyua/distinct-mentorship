import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatPrice } from "./services";

interface TransactionDetails {
    checkoutRequestId: string;
    resultCode: number;
    resultDesc: string;
    amount?: number;
    mpesaReceiptNumber?: string;
    phoneNumber?: string;
    transactionDate?: string;
    description?: string;
}

export async function generateReceipt(
    transaction: TransactionDetails,
    serviceName?: string,
    payerName?: string,
    action: "download" | "view" = "download"
) {
    const doc = new jsPDF();

    // Load Logo
    const logoUrl = "/distinct-consultancy-logo.png";
    try {
        const img = await loadImage(logoUrl);
        doc.addImage(img, "PNG", 14, 10, 25, 25); // Adjust position/size as needed
    } catch (error) {
        console.error("Failed to load logo", error);
    }

    // Header Text (shifted down to accommodate logo)
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Distinct Mentorship", 14, 45);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Payment Receipt", 14, 51);

    // Receipt Info
    let dateStr = "N/A";
    if (transaction.transactionDate) {
        // Check if it's M-Pesa format (YYYYMMDDHHmmss)
        const mpesaDatePattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
        const match = transaction.transactionDate.match(mpesaDatePattern);

        if (match) {
            const [, year, month, day, hour, minute, second] = match;
            const date = new Date(
                Number(year),
                Number(month) - 1,
                Number(day),
                Number(hour),
                Number(minute),
                Number(second)
            );
            dateStr = date.toLocaleString();
        } else {
            // Try standard parsing (ISO string, etc.)
            const date = new Date(transaction.transactionDate);
            if (!isNaN(date.getTime())) {
                dateStr = date.toLocaleString();
            }
        }
    } else {
        dateStr = new Date().toLocaleString();
    }

    doc.setFontSize(10);
    doc.text(`Date: ${dateStr}`, 14, 65);
    doc.text(
        `Receipt No: ${transaction.mpesaReceiptNumber || "PENDING"}`,
        14,
        70
    );

    // Table Data
    const tableData = [
        ["Service", serviceName || transaction.description || "N/A"],
        ["Payer Name", payerName || "N/A"],
        ["Phone Number", transaction.phoneNumber || "N/A"],
        ["M-Pesa Receipt", transaction.mpesaReceiptNumber || "-"],
        ["Amount Paid", formatPrice(transaction.amount || 0)],
        ["Status", transaction.resultCode === 0 ? "Success" : "Failed"],
    ];

    autoTable(doc, {
        startY: 80,
        head: [],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { fontStyle: "bold", cellWidth: 50 },
        },
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 85;
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
        "Thank you for choosing Distinct Mentorship.",
        14,
        finalY + 10
    );
    doc.text(
        "Support: +254 700 000 000 | info@distinctmentorship.com",
        14,
        finalY + 15
    );

    // Output
    if (action === "view") {
        window.open(doc.output("bloburl"), "_blank");
    } else {
        doc.save(`Receipt_${transaction.mpesaReceiptNumber || "Draft"}.pdf`);
    }
}

function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
    });
}
