using Common.Helper_Classes;
using System.Text.Json;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (CustomException ex)
            {
                await HandleExceptionAsync(context, ex, ex.StatusCode);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex, 500);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex, int statusCode)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            string json = JsonSerializer.Serialize(ex.Message);
            await context.Response.WriteAsync(json);
        }
    }
}
