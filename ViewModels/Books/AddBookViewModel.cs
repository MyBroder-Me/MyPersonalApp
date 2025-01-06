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
            var result = await FilePicker.Default.PickAsync(new PickOptions
            {
                PickerTitle = "Please select an image or video file",
                FileTypes = FilePickerFileType.Images // You can customize this to allow videos as well
            });

            if (result != null)
            {
                ImageUrl = result.FullPath;
            }
        }
        catch (Exception ex)
        {
            // Handle any exceptions that occur during file picking
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
                string uploadedFilePath = null;
                if (!string.IsNullOrEmpty(ImageUrl))
                {
                    // Upload the file to Supabase bucket
                    using var fileStream = File.OpenRead(ImageUrl);
                    var extension = Path.GetExtension(ImageUrl);
                    uploadedFilePath = await _storageService.UploadFileAsync(_bucket, $"book-{BookTitle}{extension}", fileStream);

                }

                Book book = new()
                {
                    Title = BookTitle,
                    Author = BookAuthor,
                    IsFinished = BookIsFinished,
                    ImageUrl = uploadedFilePath
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
    }
}