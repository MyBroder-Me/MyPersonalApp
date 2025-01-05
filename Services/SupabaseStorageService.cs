
using Supabase;


public class SupabaseStorageService : IStorageService
{
    private readonly Client _supabaseClient;
    private readonly Storage _storageClient;

    public SupabaseStorageService(Supabase.Client supabaseClient)
    {
        _storageClient = supabaseClient.Storage;
    }

    public async Task InitializeAsync()
    {
        await _supabaseClient.InitializeAsync();
    }

    public async Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream)
    {
        var bucket = _storageClient.From(bucketName);
        var response = await bucket.Upload(fileStream, filePath);

        if (response.Error != null)
        {
            throw new Exception(response.Error.Message);
        }

        return response.Path;
    }

    public async Task DeleteFileAsync(string bucketName, string filePath)
    {
        var bucket = _storageClient.From(bucketName);
        var response = await bucket.Remove(new[] { filePath });

        if (response.Error != null)
        {
            throw new Exception(response.Error.Message);
        }
    }

    public async Task<Stream> DownloadFileAsync(string bucketName, string filePath)
    {
        var bucket = _storageClient.From(bucketName);
        var response = await bucket.Download(filePath);

        if (response.Error != null)
        {
            throw new Exception(response.Error.Message);
        }

        return response.Stream;
    }
}
