using MyApp.ViewModels;
namespace MyApp.Views;

public partial class BooksListingPage : ContentPage
{
	public BooksListingPage(BooksListingViewModel booksListingViewModel)
	{
		InitializeComponent();
        BindingContext = booksListingViewModel;
    }
}