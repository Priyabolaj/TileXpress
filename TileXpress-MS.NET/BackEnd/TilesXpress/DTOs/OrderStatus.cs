namespace TilesXpress.DTOs
{
    public static class OrderStatus
    {
        public const string Pending = "Pending";
        public const string Processing = "Processing";
        public const string Shipped = "Shipped";
        public const string Delivered = "Delivered";
        public const string Cancelled = "Cancelled";

        public static readonly string[] ValidStatuses = new[]
        {
            Pending, Processing, Shipped, Delivered, Cancelled
        };
    }
}
