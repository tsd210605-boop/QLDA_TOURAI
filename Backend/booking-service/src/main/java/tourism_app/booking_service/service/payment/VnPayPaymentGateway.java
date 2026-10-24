package tourism_app.booking_service.service.payment;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import tourism_app.booking_service.model.Booking;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Component("VNPAY")
public class VnPayPaymentGateway implements PaymentGateway {

    @Value("${vnpay.tmnCode:CGXZLS0Z}")
    private String vnpTmnCode;

    @Value("${vnpay.hashSecret:XNBCJFAKAZQSGZSSTUSAHNTKCBGQTHVQ}")
    private String vnpHashSecret;

    @Value("${vnpay.payUrl:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpPayUrl;

    @Override
    public String getGatewayName() {
        return "VNPAY";
    }

    @Override
    public PaymentInitResponse createPaymentUrl(Booking booking, BigDecimal amount, String ipAddress, String returnUrl) {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String txnRef = "TXN" + booking.getBookingId() + "_" + System.currentTimeMillis();

        long amountVnd = amount.multiply(BigDecimal.valueOf(100)).longValue();
        if (amountVnd <= 0) {
            amountVnd = 10000000L; // Fallback 100,000 VND
        }

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpTmnCode);
        vnpParams.put("vnp_Amount", String.valueOf(amountVnd));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txnRef);
        vnpParams.put("vnp_OrderInfo", "Thanh toan tour " + booking.getPackageTitle() + " - Ma booking: " + booking.getBookingCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", returnUrl != null ? returnUrl : "http://localhost:3000/bookings");
        vnpParams.put("vnp_IpAddr", (ipAddress != null && !ipAddress.isBlank()) ? ipAddress : "127.0.0.1");

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnpCreateDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_CreateDate", vnpCreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnpExpireDate = formatter.format(cld.getTime());
        vnpParams.put("vnp_ExpireDate", vnpExpireDate);

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = vnpParams.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString())).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        query.append('&');
                        hashData.append('&');
                    }
                }
            }
            String vnpSecureHash = hmacSHA512(vnpHashSecret, hashData.toString());
            query.append("&vnp_SecureHash=").append(vnpSecureHash);
            String paymentUrl = vnpPayUrl + "?" + query;

            return new PaymentInitResponse(paymentUrl, txnRef, getGatewayName(), booking.getBookingId());
        } catch (Exception e) {
            throw new RuntimeException("Error generating VNPay URL: " + e.getMessage(), e);
        }
    }

    @Override
    public PaymentCallbackResult processCallback(Map<String, String> fields) {
        String vnpSecureHash = fields.get("vnp_SecureHash");
        Map<String, String> params = new HashMap<>(fields);
        params.remove("vnp_SecureHashType");
        params.remove("vnp_SecureHash");

        List<String> fieldNames = new ArrayList<>(params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();

        try {
            Iterator<String> itr = fieldNames.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = params.get(fieldName);
                if (fieldValue != null && !fieldValue.isEmpty()) {
                    hashData.append(fieldName).append('=').append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    if (itr.hasNext()) {
                        hashData.append('&');
                    }
                }
            }

            String signValue = hmacSHA512(vnpHashSecret, hashData.toString());
            boolean validSignature = signValue.equalsIgnoreCase(vnpSecureHash);
            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");
            String bankCode = params.get("vnp_BankCode");
            String amountStr = params.get("vnp_Amount");
            BigDecimal amount = amountStr != null ? new BigDecimal(amountStr).divide(BigDecimal.valueOf(100)) : BigDecimal.ZERO;

            boolean isSuccess = validSignature && "00".equals(responseCode);
            String message = isSuccess ? "Giao dịch thành công" : ("Giao dịch thất bại mã " + responseCode);

            return new PaymentCallbackResult(isSuccess, txnRef, responseCode, message, bankCode, amount);
        } catch (Exception e) {
            return new PaymentCallbackResult(false, params.get("vnp_TxnRef"), "99", "Lỗi xử lý chữ ký: " + e.getMessage(), null, BigDecimal.ZERO);
        }
    }

    public static String hmacSHA512(String key, String data) {
        try {
            Mac hmac512 = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            hmac512.init(secretKey);
            byte[] bytes = hmac512.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder(2 * bytes.length);
            for (byte b : bytes) {
                sb.append(String.format("%02x", b & 0xff));
            }
            return sb.toString();
        } catch (Exception ex) {
            return "";
        }
    }
}
