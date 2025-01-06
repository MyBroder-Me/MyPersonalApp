using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyApp.Models;
using MyApp.Services;

namespace MyApp.ViewModels;

public partial class AddBookViewModel : ObservableObject
{
    private readonly IDataService _dataService;
    private readonly IStorageService _storageService;
    private readonly string _bucket = "books_bucket";

    [ObservableProperty]
    private string _bookTitle;
    [ObservableProperty]
    private string _bookAuthor;
    [ObservableProperty]
    private bool _bookIsFinished;
    [ObservableProperty]
    private string _imageUrl;
    [ObservableProperty]
    private string _eBookUrl;

    public AddBookViewModel(IDataService dataService, IStorageService storageService)
    {
        _dataService = dataService;
        _storageService = storageService;
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
                    ImageUrl = result.FullPath;
                }
                else if (extension == ".pdf")
                {
                    EBookUrl = result.FullPath;
                }
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", ex.Message, "OK");
        }
    }

    [RelayCommand]
    private async Task AddBook()
    {
        try
        {
            if (!(string.IsNullOrEmpty(BookTitle) && string.IsNullOrEmpty(BookAuthor)))
            {
                string uploadedImgPath = null;
                string uploadedEbookPath = null;
                if (!string.IsNullOrEmpty(ImageUrl))
                {
                    // Upload the file to Supabase bucket
                    using var fileStream = File.OpenRead(ImageUrl);
                    var extension = Path.GetExtension(ImageUrl);
                    uploadedImgPath = await _storageService.UploadFileAsync(_bucket, $"images/book-{BookTitle}{extension}", fileStream);
                }
                if (!string.IsNullOrEmpty(EBookUrl))
                {
                    // Upload the file to Supabase bucket
                    using var fileStream = File.OpenRead(EBookUrl);
                    var extension = Path.GetExtension(EBookUrl);
                    uploadedEbookPath = await _storageService.UploadFileAsync(_bucket, $"ebook/book-{BookTitle}{extension}", fileStream);
                }

                Book book = new()
                {
                    Title = BookTitle,
                    Author = BookAuthor,
                    IsFinished = BookIsFinished,
                    ImageUrl = uploadedImgPath,
                    EBookUrl = uploadedEbookPath
                };
                await _dataService.CreateBook(book);

                await Shell.Current.GoToAsync("..");
            }
            else
            {
                await Shell.Current.DisplayAlert("Error", "No title!", "OK");
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", ex.Message, "OK");
        }

    }

    [RelayCommand]
    private async Task Cancel()
    {
        await Shell.Current.GoToAsync("..");
    }

    public void OnNavigatedTo()
    {
        ResetFields();
    }
    private void ResetFields()
    {
        BookTitle = string.Empty;
        BookAuthor = string.Empty;
        BookIsFinished = false;
        ImageUrl = string.Empty;
        EBookUrl = string.Empty;
    }
}