package resource_tests;

import edu.oswego.csc480.rest.ApiCacheControlFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ApiCacheControlFilterTest {
    @ParameterizedTest
    @ValueSource(ints = {200, 204, 400, 401, 403, 500})
    public void setsPolicyBeforeSuccessOrErrorResponse(int status) throws Exception {
        ServletRequest request = mock(ServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        doAnswer(invocation -> {
            verify(response).setHeader("Cache-Control", "private, no-store");
            response.setStatus(status);
            response.flushBuffer();
            return null;
        }).when(chain).doFilter(request, response);

        new ApiCacheControlFilter().doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(response).setStatus(status);
        verify(response).flushBuffer();
        verifyNoMoreInteractions(response, chain);
    }

    @Test
    public void preservesDownstreamExceptionWithCachePolicySet() throws Exception {
        ServletRequest request = mock(ServletRequest.class);
        HttpServletResponse response = mock(HttpServletResponse.class);
        FilterChain chain = mock(FilterChain.class);
        ServletException failure = new ServletException("Request failed");
        doThrow(failure).when(chain).doFilter(request, response);

        assertSame(failure, assertThrows(ServletException.class,
                () -> new ApiCacheControlFilter().doFilter(request, response, chain)));

        verify(response).setHeader("Cache-Control", "private, no-store");
    }
}
