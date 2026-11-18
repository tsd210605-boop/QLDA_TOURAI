// Xác minh JWT bằng cấu hình của dịch vụ và đọc thông tin dùng để phân quyền.

package tourism_app.packages_service.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class JwtTokenService {

    @Value("${jwt.secret}")
    private String secret;

    /** Kiểm tra token, lấy email từ subject và role từ claim. Dùng USER khi thiếu role và trả Optional rỗng khi xác minh thất bại. */
    public Optional<TokenUser> parseToken(String token) {
        try {
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token);
            String role = jwt.getClaim("role").asString();
            return Optional.of(new TokenUser(jwt.getSubject(), role != null ? role : "USER"));
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    /** Chứa email và role đã đọc từ token hợp lệ để bộ lọc tạo thông tin xác thực. */
    public record TokenUser(String email, String role) {}
}
