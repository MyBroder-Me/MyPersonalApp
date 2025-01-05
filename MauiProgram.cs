using BooksTracker.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MyApp.Services;
using MyApp.ViewModels;
using MyApp.Views;
using Supabase;

namespace MyApp;

public static class MauiProgram
{
    public static MauiApp CreateMauiApp()
    {
        var builder = MauiApp.CreateBuilder();
        builder
            .UseMauiApp<App>()
            .ConfigureFonts(fonts =>
            {
                fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                fonts.AddFont("OpenSans-SemiBold.ttf", "OpenSansSemiBold");
            });

        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        builder.Configuration.AddConfiguration(configuration);

        var supabaseUrl = configuration["Supabase:Url"];
        var supabaseAnonKey = configuration["Supabase:AnonKey"];
        builder.Services.AddSingleton(provider =>
            new Supabase.Client(supabaseUrl, supabaseAnonKey));

        builder.Services.AddSingleton<BooksListingViewModel>();
        builder.Services.AddSingleton<AddBookViewModel>();
        builder.Services.AddSingleton<UpdateBookViewModel>();

        builder.Services.AddSingleton<BooksListingPage>();
        builder.Services.AddTransient<AddBookPage>();
        builder.Services.AddTransient<UpdateBookPage>();

        builder.Services.AddSingleton<IDataService, DataService>();

#if DEBUG
        builder.Logging.AddDebug();
#endif
        return builder.Build();
    }
}
