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

    [ObservableProperty]
    private Book _book;

    public UpdateBookViewModel(IDataService dataService)
    {
        _dataService = dataService;
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
}