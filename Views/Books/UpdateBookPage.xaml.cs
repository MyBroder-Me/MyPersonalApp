using MyApp.ViewModels;
namespace MyApp.Views;

public partial class UpdateBookPage : ContentPage
{
	public UpdateBookPage(UpdateBookViewModel updateBookViewModel)
	{
		InitializeComponent();
		BindingContext = updateBookViewModel;
    }
}