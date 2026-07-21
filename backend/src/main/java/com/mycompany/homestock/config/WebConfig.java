package com.mycompany.homestock.config;

import com.mycompany.homestock.security.HouseAccessInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final HouseAccessInterceptor houseAccessInterceptor;

    public WebConfig(HouseAccessInterceptor houseAccessInterceptor) {
        this.houseAccessInterceptor = houseAccessInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(houseAccessInterceptor)
                .addPathPatterns("/api/houses/**");
    }
}