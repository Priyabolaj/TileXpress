using System.ComponentModel.DataAnnotations;

namespace TilesXpress.DTOs
{
    public class OrderStatusUpdateDto
    {
        [Required]
        [StringLength(50)]
        public string Status { get; set; }
    }
}
