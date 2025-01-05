using MyApp.ViewModels;
namespace MyApp.Views;

public partial class AddBookPage : ContentPage
{
    public AddBookPage(AddBookViewModel addBookViewModel)
    {
        InitializeComponent();
        BindingContext = addBookViewModel;
    }
}