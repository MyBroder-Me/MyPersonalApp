using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Mvvm.Messaging;
using MyApp.Models;
using MyApp.Services;

namespace MyApp.ViewModels;

[QueryProperty(nameof(Book), "BookObject")]
public partial class UpdateBookViewModel : ObservableObject
{
    private readonly IDataService _dataService;
    private readonly IStorageService _storageService;
    private readonly string _bucket = "books_bucket";

    [ObservableProperty]
    private Book _book;

    public UpdateBookViewModel(IDataService dataService, IStorageService storageService)
    {
        _dataService = dataService;
        _storageService = storageService;
    }

    [RelayCommand]
    private async Task UpdateBook()
    {
        if (!string.IsNullOrEmpty(Book.Title))
        {
            await _dataService.UpdateBook(Book);

            // Send a message to notify that the book list should be refreshed
            WeakReferenceMessenger.Default.Send(this, "RefreshBooks");

            await Shell.Current.GoToAsync("..");


        }
        else
        {
            await Shell.Current.DisplayAlert("Error", "No title!", "OK");
        }

    }
    [RelayCommand]
    private async Task SelectFile()
    {
        try
        {
            var customFileType = new FilePickerFileType(new Dictionary<DevicePlatform, IEnumerable<string>>
        {
            { DevicePlatform.iOS, new[] { "public.image", "com.adobe.pdf", "org.idpf.epub-container" } }, // UTType values
            { DevicePlatform.Android, new[] { "image/*", "application/pdf", "application/epub+zip" } }, // MIME types
            { DevicePlatform.WinUI, new[] { ".jpg", ".jpeg", ".png", ".pdf", ".epub" } }, // file extensions
        });

            var result = await FilePicker.Default.PickAsync(new PickOptions
            {
                PickerTitle = "Please select an image or PDF file",
                FileTypes = customFileType
            });

            if (result != null)
            {
                var extension = Path.GetExtension(result.FullPath).ToLower();
                if (extension == ".jpg" || extension == ".jpeg" || extension == ".png")
                {
                    Book.ImageUrl = result.FullPath;
                }
                else if (extension == ".pdf" || extension == ".epub")
                {
                    Book.EBookUrl = result.FullPath;
                }
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", ex.Message, "OK");
        }
    }
    [RelayCommand]
    private async void RemoveImage()
    {
        await _storageService.DeleteFileAsync(_bucket, Book.ImageUrl, Book, "img");
        Book.ImageUrl = null;
    }

    [RelayCommand]
    private async void RemoveEBook()
    {
        await _storageService.DeleteFileAsync(_bucket, Book.EBookUrl, Book, "pdf");
        Book.EBookUrl = null;
    }
}