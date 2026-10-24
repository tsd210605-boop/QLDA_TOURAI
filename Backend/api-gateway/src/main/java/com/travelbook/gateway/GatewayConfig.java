package com.travelbook.gateway;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    // CORS headers are managed by downstream microservices and deduplicated by Spring Cloud Gateway
}
