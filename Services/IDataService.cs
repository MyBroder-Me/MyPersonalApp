using MyApp.Models;

namespace MyApp.Services;

public interface IDataService
{
    Task<IEnumerable<Book>> GetBooks(int pageNumber, int pageSize);
    Task CreateBook(Book book);
    Task DeleteBook(string id);
    Task UpdateBook(Book book);
}