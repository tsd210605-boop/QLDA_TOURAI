package tourism_app.auth_service.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    public String generateToken(String email, String role) {
        return generateToken(email, role, null, null, Collections.emptyList());
    }

    public String generateToken(String email, String role, Long userId, String name, List<String> permissions) {
        Date now = new Date();
        var builder = JWT.create()
                .withSubject(email)
                .withClaim("role", role != null ? role : "CUSTOMER")
                .withIssuedAt(now)
                .withExpiresAt(new Date(now.getTime() + expiration));

        if (userId != null) {
            builder.withClaim("userId", userId);
        }
        if (name != null) {
            builder.withClaim("name", name);
        }
        if (permissions != null && !permissions.isEmpty()) {
            builder.withClaim("permissions", permissions);
        }

        return builder.sign(Algorithm.HMAC256(secret));
    }

    public Optional<DecodedJWT> verifyAndDecode(String token) {
        try {
            DecodedJWT jwt = JWT.require(Algorithm.HMAC256(secret))
                    .build()
                    .verify(token);
            return Optional.of(jwt);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}
