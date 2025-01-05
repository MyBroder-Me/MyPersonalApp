using MyApp.ViewModels;
namespace MyApp.Views;

public partial class AddBookPage : ContentPage
{
    public AddBookPage(AddBookViewModel addBookViewModel)
    {
        InitializeComponent();
        BindingContext = addBookViewModel;
    }

    protected override void OnAppearing()
    {
        base.OnAppearing();
        if (BindingContext is AddBookViewModel viewModel)
        {
            viewModel.OnNavigatedTo();
        }
    }

}