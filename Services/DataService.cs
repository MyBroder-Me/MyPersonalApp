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
    public async Task<IEnumerable<Book>> GetBooks()
    {
        var response = await _supabaseClient.From<Book>().Get();
        Console.WriteLine(response);
        return response.Models.OrderByDescending(b => b.CreatedAt);
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
            .Set(b => b.Title, book.Title)
            .Set(b => b.Author, book.Author)
            .Set(b => b.IsFinished, book.IsFinished)
            .Update();
    }
}