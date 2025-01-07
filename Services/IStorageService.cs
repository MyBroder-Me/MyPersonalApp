using MyApp.Models;

namespace MyApp.Services;
public interface IStorageService
{
    Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream);
    Task DeleteFileAsync(string bucketName, string filePath, Book book, string type, bool fullDelete = false);
}
