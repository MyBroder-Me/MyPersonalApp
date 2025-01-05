﻿using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyApp.Models;
using MyApp.Services;

namespace MyApp.ViewModels;

public partial class AddBookViewModel : ObservableObject
{
    private readonly IDataService _dataService;
    private readonly IStorageService _storageService;


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
                // Upload the file to Supabase bucket
                using var fileStream = await result.OpenReadAsync();
                var uploadedFilePath = await _storageService.UploadFileAsync("your-bucket-name", result.FileName, fileStream);

                // Set the ImageUrl property to the uploaded file path
                ImageUrl = uploadedFilePath;
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
            if (!string.IsNullOrEmpty(BookTitle))
            {
                Book book = new()
                {
                    Title = BookTitle,
                    Author = BookAuthor,
                    IsFinished = BookIsFinished,
                    ImageUrl = ImageUrl
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
}