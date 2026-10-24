package tourism_app.booking_service.security;

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

    public record TokenUser(String email, String role) {}
}
