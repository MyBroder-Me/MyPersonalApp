using MyApp.Models;
using MyApp.Services;
using Supabase;

public class StorageService : IStorageService
{
    private readonly Client _supabaseClient;

    public StorageService(Client supabaseClient)
    {
        _supabaseClient = supabaseClient;
    }

    public async Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream)
    {
        byte[] fileBytes; 
        using (var memoryStream = new MemoryStream())
        {
            await fileStream.CopyToAsync(memoryStream);
            fileBytes = memoryStream.ToArray();
        }
        var bucket = _supabaseClient.Storage.From(bucketName);
        var path = await bucket.Upload(fileBytes, filePath, new Supabase.Storage.FileOptions { CacheControl = "3600", Upsert = false });

        if (string.IsNullOrEmpty(path)) 
        { 
            throw new Exception("Error uploading file"); 
        }
        var ImageUrl = bucket.GetPublicUrl(filePath);
        return ImageUrl;
    }

    public async Task DeleteFileAsync(string bucketName, string fileUrl, Book book, string type, bool fullDelete = false)
    {
        var filePath = GetFilePathFromUrl(fileUrl);
        await _supabaseClient.Storage.From(bucketName).Remove(filePath);
        if (type == "img")
        {
            book.ImageUrl = null;
        } else
        {
            book.EBookUrl = null;
        }
        if (!fullDelete) {
            await _supabaseClient.From<Book>().Where(b => b.Id == book.Id)
                .Update(book);
        }
    }
    private string GetFilePathFromUrl(string fileUrl)
    {
        string marker = $"/books_bucket/";
        int index = fileUrl.IndexOf(marker);

        if (index != -1)
        {
            return fileUrl.Substring(index + marker.Length);
        }

        throw new ArgumentException("La URL no contiene el nombre del bucket especificado.");
    }

}
