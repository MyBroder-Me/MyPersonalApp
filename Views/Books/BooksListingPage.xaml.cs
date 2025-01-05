using CommunityToolkit.Mvvm.Messaging;
using MyApp.ViewModels;

namespace MyApp.Views;

public partial class BooksListingPage : ContentPage
{
    private readonly BooksListingViewModel _booksListingViewModel;

    public BooksListingPage(BooksListingViewModel booksListingViewModel)
    {
        InitializeComponent();
        BindingContext = booksListingViewModel;
        _booksListingViewModel = booksListingViewModel;

        // Subscribe to the message
        WeakReferenceMessenger.Default.Register<RefreshBooksMessage>(this, async (r, m) =>
        {
            await _booksListingViewModel.GetBooks();
        });
    }

    protected override async void OnAppearing()
    {
        base.OnAppearing();
        await _booksListingViewModel.GetBooks();
    }

    protected override void OnDisappearing()
    {
        base.OnDisappearing();
        // Unregister from the message to avoid memory leaks
        WeakReferenceMessenger.Default.Unregister<RefreshBooksMessage>(this);
    }
}