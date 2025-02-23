using System.Linq.Expressions;

namespace TilesXpress.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<T> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(T entity);
        Task<IReadOnlyList<T>> GetAllWithIncludesAsync(Expression<Func<T, bool>> predicate, params string[] includes);
        Task<T> GetByIdWithIncludesAsync(int id, params string[] includes);
    }
}