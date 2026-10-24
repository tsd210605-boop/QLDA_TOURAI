import React, { useState, useEffect } from "react";
import { createBooking } from "../../api/bookingsApi";
import { getPackageById, getPackageOffer } from "../../api/packagesApi";
import { createPaymentUrl, getInvoiceByBookingId, handlePaymentCallback } from "../../api/paymentsApi";
import { getUserId } from "../../utils/auth";
import { useParams, Link } from "react-router-dom";
import "./packageBookingForm.css";

const PackageBookingForm = () => {
  const { id } = useParams();

  const [pkg, setPackage] = useState(null);
  const [offer, setOffer] = useState(null);
  const [travelDate, setTravelDate] = useState("2026-11-15");
  const [people, setPeople] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Booking & Payment states
  const [createdBooking, setCreatedBooking] = useState(null);
  const [paymentGateway, setPaymentGateway] = useState("VIETQR");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [copyNotice, setCopyNotice] = useState("");

  const handleCopy = (text, label) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyNotice(`Đã sao chép ${label}!`);
      setTimeout(() => setCopyNotice(""), 3000);
    }
  };

  useEffect(() => {
    getPackageById(id).then((data) => {
      setPackage(data);
      setPeople(data?.peopleCount || 1);

      getPackageOffer(id).then((offerData) => {
        setOffer(offerData);
      });
    });
  }, [id]);

  if (!pkg) {
    return <p className="loading-text">Đang tải thông tin tour du lịch...</p>;
  }

  const discount = offer ? offer.discountPercentage : 0;
  const pricePerPerson = pkg.price - (pkg.price * discount) / 100;
  const totalPrice = pricePerPerson * people;
  const totalPriceVND = Math.round(totalPrice * 25400);

  const handleBooking = async () => {
    if (!travelDate || !name || !phone || people <= 0) {
      alert("Vui lòng nhập đầy đủ các trường bắt buộc (Họ tên, Số điện thoại, Ngày khởi hành)");
      return;
    }

    setLoading(true);
    const bookingData = {
      bookingType: "PACKAGE",
      packageTitle: pkg.title,
      destination: pkg.mainDestinations,
      travelDate: travelDate,
      people: people,
      days: pkg.duration ? parseInt(pkg.duration) : 1,
      totalPrice: totalPrice,
      name: name,
      phone: phone,
      email: email,
      specialRequests: specialRequests,
      userId: getUserId() || null,
    };

    try {
      const res = await createBooking(bookingData);
      setCreatedBooking(res);
      setLoading(false);
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Đặt tour thất bại. Vui lòng thử lại!");
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!createdBooking) return;
    setLoading(true);

    try {
      if (paymentGateway === "VIETQR" || paymentGateway === "MOCK") {
        // Process instant validation & invoice generation
        const initRes = await createPaymentUrl({
          bookingId: createdBooking.bookingId,
          gateway: "MOCK",
          returnUrl: window.location.href,
        });

        // Instant simulate callback with Vietcombank
        await handlePaymentCallback("MOCK", {
          vnp_TxnRef: initRes.transactionCode,
          vnp_ResponseCode: "00",
          vnp_Amount: String(Math.round(totalPrice * 100)),
          vnp_BankCode: "VIETCOMBANK",
        });

        // Load generated invoice
        const inv = await getInvoiceByBookingId(createdBooking.bookingId);
        setInvoice(inv);
        setPaymentSuccess(true);
      } else {
        // VNPay Sandbox redirect
        const initRes = await createPaymentUrl({
          bookingId: createdBooking.bookingId,
          gateway: paymentGateway,
          returnUrl: `${window.location.origin}/bookings`,
        });

        if (initRes.paymentUrl) {
          window.location.href = initRes.paymentUrl;
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Lỗi khi kết nối cổng thanh toán: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-booking-form">
      {!createdBooking ? (
        <>
          <div className="package-header">
            <h2>ĐẶT TOUR DU LỊCH</h2>
            {pkg.imageUrl && (
              <img
                src={pkg.imageUrl}
                alt={pkg.title}
                className="package-booking-img"
              />
            )}
            <h3>{pkg.title}</h3>
          </div>

          <p><b>Điểm đến:</b> {pkg.mainDestinations}</p>
          <p><b>Thời gian:</b> {pkg.duration}</p>
          <p><b>Giá mỗi khách:</b> ${pkg.price}</p>

          {offer && (
            <p className="offer">
              Ưu đãi: Giảm {offer.discountPercentage}% → $
              {(pkg.price - (pkg.price * offer.discountPercentage) / 100).toFixed(2)} / người
            </p>
          )}

          <label>
            Họ và tên khách hàng (*):
            <input
              type="text"
              placeholder="Nhập họ và tên đầy đủ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Số điện thoại liên hệ (*):
            <input
              type="text"
              placeholder="Nhập số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </label>

          <label>
            Email nhận vé điện tử & Hóa đơn VAT:
            <input
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label>
            Ngày khởi hành (*):
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              required
            />
          </label>

          <label>
            Số lượng khách:
            <input
              type="number"
              min={1}
              max={pkg.peopleCount || 50}
              value={people}
              onChange={(e) => setPeople(Number(e.target.value))}
            />
          </label>

          <label>
            Yêu cầu đặc biệt (ăn uống, phòng đơn, điểm đón):
            <input
              type="text"
              placeholder="Ghi chú yêu cầu thêm..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
            />
          </label>

          <label>
            Tổng tiền thanh toán dự kiến:
            <input
              type="text"
              readOnly
              value={`$${totalPrice.toFixed(2)} (${totalPriceVND.toLocaleString("vi-VN")} đ)`}
            />
          </label>

          <button onClick={handleBooking} disabled={loading} className="btn-submit-booking">
            {loading ? "Đang xử lý..." : "Tiến hành Đặt chỗ & Thanh toán"}
          </button>
        </>
      ) : !paymentSuccess ? (
        <div className="payment-checkout-step">
          <div className="checkout-success-header">
            <span className="success-icon-badge">✓</span>
            <h2>ĐẶT CHỖ THÀNH CÔNG!</h2>
            <p className="booking-code-line">
              Mã đơn đặt tour: <strong>{createdBooking.bookingCode || "BK-" + createdBooking.bookingId}</strong>
            </p>
          </div>

          <div className="checkout-summary-card">
            <div className="summary-row">
              <span className="summary-label">Tour du lịch:</span>
              <strong className="summary-val">{createdBooking.packageTitle}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Ngày khởi hành:</span>
              <span className="summary-val">{createdBooking.travelDate}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Số khách:</span>
              <span className="summary-val">{createdBooking.people} người</span>
            </div>
            <div className="summary-row total-highlight">
              <span className="summary-label">Tổng thanh toán:</span>
              <strong className="summary-val-price">
                ${totalPrice.toFixed(2)}
                <small> ({totalPriceVND.toLocaleString("vi-VN")} VNĐ)</small>
              </strong>
            </div>
          </div>

          <h3 className="payment-methods-title">Chọn phương thức thanh toán:</h3>

          <div className="payment-methods-list">
            {/* VietQR Option */}
            <label className={`payment-method-item ${paymentGateway === "VIETQR" ? "active" : ""}`}>
              <input
                type="radio"
                name="gateway"
                value="VIETQR"
                checked={paymentGateway === "VIETQR"}
                onChange={(e) => setPaymentGateway(e.target.value)}
              />
              <div className="method-info">
                <div className="method-title-row">
                  <i className="fa-solid fa-qrcode method-icon qr-icon"></i>
                  <strong>Chuyển khoản VietQR / Vietcombank</strong>
                  <span className="recommend-badge">Khuyên dùng</span>
                </div>
                <div className="method-desc">
                  Quét mã QR qua app ngân hàng hoặc MoMo, ZaloPay nhận diện thanh toán tức thì
                </div>
              </div>
            </label>

            {/* VNPay Option */}
            <label className={`payment-method-item ${paymentGateway === "VNPAY" ? "active" : ""}`}>
              <input
                type="radio"
                name="gateway"
                value="VNPAY"
                checked={paymentGateway === "VNPAY"}
                onChange={(e) => setPaymentGateway(e.target.value)}
              />
              <div className="method-info">
                <div className="method-title-row">
                  <i className="fa-solid fa-credit-card method-icon"></i>
                  <strong>Cổng VNPay (Thẻ ATM, Visa, QR-Pay)</strong>
                </div>
                <div className="method-desc">
                  Kết nối cổng thanh toán VNPay Sandbox an toàn với chữ ký SHA-512
                </div>
              </div>
            </label>

            {/* Mock Option */}
            <label className={`payment-method-item ${paymentGateway === "MOCK" ? "active" : ""}`}>
              <input
                type="radio"
                name="gateway"
                value="MOCK"
                checked={paymentGateway === "MOCK"}
                onChange={(e) => setPaymentGateway(e.target.value)}
              />
              <div className="method-info">
                <div className="method-title-row">
                  <i className="fa-solid fa-bolt method-icon"></i>
                  <strong>Thanh toán Thử nghiệm Nhanh (Instant Approval)</strong>
                </div>
                <div className="method-desc">
                  Duyệt tức thì theo yêu cầu thiết kế R05 & sinh Hóa đơn/Vé điện tử
                </div>
              </div>
            </label>
          </div>

          {/* Toast Copy Notice */}
          {copyNotice && <div className="copy-toast">{copyNotice}</div>}

          {/* VietQR Detailed Scanning Box */}
          {paymentGateway === "VIETQR" ? (
            <div className="vietqr-scan-box">
              <div className="vietqr-box-header">
                <div className="vcb-brand">
                  <i className="fa-solid fa-building-columns"></i> VIETCOMBANK • VIETQR
                </div>
                <span className="napas-badge">Napas 247</span>
              </div>

              {/* User QR Code Image */}
              <div className="vietqr-card-container">
                <img
                  src="/images/vietqr-payment.png"
                  alt="VietQR Vietcombank TRAN SON DUY"
                  className="vietqr-full-image"
                />
              </div>

              {/* Bank Details Table with Fast Copy */}
              <div className="bank-details-card">
                <div className="bank-info-row">
                  <span className="bank-info-label">Ngân hàng:</span>
                  <strong className="bank-info-val">Vietcombank (Ngoại thương Việt Nam)</strong>
                </div>
                <div className="bank-info-row">
                  <span className="bank-info-label">Chủ tài khoản:</span>
                  <strong className="bank-info-val highlight-name">TRAN SON DUY</strong>
                </div>
                <div className="bank-info-row">
                  <span className="bank-info-label">Số tài khoản:</span>
                  <div className="bank-info-val-copy">
                    <strong className="copyable-text">000103901903201</strong>
                    <button
                      type="button"
                      className="btn-copy-chip"
                      onClick={() => handleCopy("000103901903201", "Số tài khoản")}
                    >
                      <i className="fa-regular fa-copy"></i> Sao chép
                    </button>
                  </div>
                </div>
                <div className="bank-info-row">
                  <span className="bank-info-label">Chi nhánh:</span>
                  <span className="bank-info-val">Trụ sở CN Nam Định</span>
                </div>
                <div className="bank-info-row">
                  <span className="bank-info-label">Số tiền:</span>
                  <div className="bank-info-val-copy">
                    <strong className="copyable-amount">
                      {totalPriceVND.toLocaleString("vi-VN")} đ (${totalPrice.toFixed(2)})
                    </strong>
                    <button
                      type="button"
                      className="btn-copy-chip"
                      onClick={() => handleCopy(String(totalPriceVND), "Số tiền")}
                    >
                      <i className="fa-regular fa-copy"></i> Sao chép
                    </button>
                  </div>
                </div>
                <div className="bank-info-row">
                  <span className="bank-info-label">Nội dung CK:</span>
                  <div className="bank-info-val-copy">
                    <strong className="copyable-text transfer-note">THANHTOAN {createdBooking.bookingCode || "BK-" + createdBooking.bookingId}</strong>
                    <button
                      type="button"
                      className="btn-copy-chip"
                      onClick={() => handleCopy(`THANHTOAN ${createdBooking.bookingCode || "BK-" + createdBooking.bookingId}`, "Nội dung chuyển khoản")}
                    >
                      <i className="fa-regular fa-copy"></i> Sao chép
                    </button>
                  </div>
                </div>
              </div>

              <div className="qr-step-instructions">
                <ol>
                  <li>Mở ứng dụng Ngân hàng bất kỳ (Vietcombank, MB, Techcombank, VPBank...) hoặc MoMo, ZaloPay.</li>
                  <li>Chọn tính năng <strong>Quét QR</strong> và quét mã ở trên.</li>
                  <li>Kiểm tra đúng tên người nhận <strong>TRAN SON DUY</strong> và xác nhận thanh toán.</li>
                  <li>Sau khi hoàn tất, bấm nút xác nhận dưới đây để nhận ngay <strong>Vé điện tử & Hóa đơn VAT</strong>.</li>
                </ol>
              </div>

              <button
                onClick={handlePay}
                disabled={loading}
                className="btn-confirm-vietqr"
              >
                {loading ? (
                  <span><i className="fa-solid fa-spinner fa-spin"></i> Đang xác nhận thanh toán...</span>
                ) : (
                  <span><i className="fa-solid fa-circle-check"></i> Tôi đã quét mã và chuyển khoản thành công</span>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handlePay}
              disabled={loading}
              className="btn-standard-pay"
            >
              {loading
                ? "Đang kết nối cổng..."
                : `Thanh toán ngay $${totalPrice.toFixed(2)} (${totalPriceVND.toLocaleString("vi-VN")} đ)`}
            </button>
          )}
        </div>
      ) : (
        <div className="payment-success-step">
          <div className="success-badge-large">✓</div>
          <h2>THANH TOÁN THÀNH CÔNG!</h2>
          <p className="success-sub">Cảm ơn quý khách đã tin tưởng đặt tour cùng chúng tôi.</p>

          {invoice && (
            <div className="invoice-ticket-card">
              <div className="ticket-header">
                <h4><i className="fa-solid fa-receipt"></i> VÉ ĐIỆN TỬ & HÓA ĐƠN VAT</h4>
                <span className="ticket-status-tag">ĐÃ THANH TOÁN</span>
              </div>
              <div className="ticket-body">
                <p><strong>Mã vé / Booking:</strong> <span className="highlight">{createdBooking.bookingCode || "BK-" + createdBooking.bookingId}</span></p>
                <p><strong>Số Hóa đơn VAT:</strong> {invoice.invoiceCode}</p>
                <p><strong>Khách hàng:</strong> {invoice.customerName} ({invoice.customerPhone})</p>
                <p><strong>Tổng thanh toán:</strong> ${invoice.totalAmount} (~ {totalPriceVND.toLocaleString("vi-VN")} đ)</p>
                <p><strong>Thuế VAT (10%):</strong> ${invoice.vatAmount}</p>
                <p><strong>Cổng thanh toán:</strong> {paymentGateway === "VIETQR" ? "Vietcombank VietQR" : paymentGateway}</p>
              </div>

              <div className="ticket-qr-section">
                <div className="ticket-qr-title">MÃ QR VÉ ĐIỆN TỬ ĐIỂM DANH (E-TICKET QR):</div>
                <div className="ticket-qr-box">
                  <i className="fa-solid fa-qrcode ticket-qr-icon"></i>
                  <span className="qr-code-text">[ {invoice.qrCodeData} ]</span>
                </div>
                <small className="qr-guide">Xuất trình mã này cho hướng dẫn viên khi lên xe khởi hành</small>
              </div>
            </div>
          )}

          <Link to="/bookings">
            <button className="btn-view-bookings">
              <i className="fa-solid fa-list-check"></i> Xem danh sách Đơn đặt tour của tôi
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PackageBookingForm;
