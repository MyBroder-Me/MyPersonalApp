public interface IStorageService
{
    Task<string> UploadFileAsync(string bucketName, string filePath, Stream fileStream);
    Task DeleteFileAsync(string bucketName, string filePath);
    Task<Stream> DownloadFileAsync(string bucketName, string filePath);
}
