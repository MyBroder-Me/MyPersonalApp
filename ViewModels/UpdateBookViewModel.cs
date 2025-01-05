using MyApp.Models;
using MyApp.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

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
    private async Task UpdateBook(Book b)
    {
        if (!string.IsNullOrEmpty(b.Title))
        {
            await _dataService.UpdateBook(b);

            await Shell.Current.GoToAsync("..");
        }
        else
        {
            await Shell.Current.DisplayAlert("Error", "No title!", "OK");
        }
    }
}