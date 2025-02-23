using TilesXpress.Models;

namespace TilesXpress.Services
{
    public interface IJwtService
    {
        string GenerateToken(User user);
    }
}
