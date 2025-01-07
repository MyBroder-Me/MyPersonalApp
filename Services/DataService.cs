using MyApp.Models;
using MyApp.Services;
using Supabase;

namespace BooksTracker.Services;

public class DataService : IDataService
{
    private readonly Client _supabaseClient;

    public DataService(Supabase.Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    public async Task<IEnumerable<Book>> GetBooks(int pageNumber, int pageSize)
    {
        var response = await _supabaseClient
            .From<Book>()
            .Order(b => b.CreatedAt, Supabase.Postgrest.Constants.Ordering.Descending)
            .Range((pageNumber - 1) * pageSize, (pageNumber * pageSize) - 1)
            .Get();

        return response.Models;
    }

    public async Task CreateBook(Book book)
    {
        await _supabaseClient.From<Book>().Insert(book);
    }

    public async Task DeleteBook(string id)
    {
        await _supabaseClient.From<Book>()
            .Where(b => b.Id == id).Delete();
    }

    public async Task UpdateBook(Book book)
    {
        await _supabaseClient.From<Book>().Where(b => b.Id == book.Id)
            .Update(book);
    }
}
