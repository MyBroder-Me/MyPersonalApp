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
        var path = await bucket.Upload(fileBytes, filePath);

        if (string.IsNullOrEmpty(path)) 
        { 
            throw new Exception("Error uploading file"); 
        }
        var ImageUrl = bucket.GetPublicUrl(filePath);
        return ImageUrl;
    }

    public async Task DeleteFileAsync(string bucketName, string filePath)
    {
        var bucket = _supabaseClient.Storage.From(bucketName);
        await bucket.Remove(filePath);
    }
}
