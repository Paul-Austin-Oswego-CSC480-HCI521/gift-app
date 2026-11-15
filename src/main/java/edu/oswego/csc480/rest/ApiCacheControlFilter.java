package edu.oswego.csc480.rest;

import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebFilter(urlPatterns = "/api/*", dispatcherTypes = {
        DispatcherType.REQUEST, DispatcherType.ASYNC, DispatcherType.ERROR, DispatcherType.FORWARD
})
public class ApiCacheControlFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        ((HttpServletResponse) response).setHeader("Cache-Control", "private, no-store");
        chain.doFilter(request, response);
    }
}
