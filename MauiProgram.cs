using BooksTracker.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MyApp.Services;
using MyApp.ViewModels;
using MyApp.Views;

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
        var supabaseAdminKey = configuration["Supabase:AdminKey"];

        builder.Services.AddSingleton(provider =>
        {
            var client = new Supabase.Client(supabaseUrl!, supabaseAdminKey!);
            client.InitializeAsync().Wait();
            return client;
        });

        builder.Services.AddSingleton<IDataService, DataService>();
        builder.Services.AddSingleton<IStorageService, StorageService>();

        builder.Services.AddSingleton<BooksListingViewModel>();
        builder.Services.AddSingleton<AddBookViewModel>();
        builder.Services.AddSingleton<UpdateBookViewModel>();

        builder.Services.AddSingleton<BooksListingPage>();
        builder.Services.AddTransient<AddBookPage>();
        builder.Services.AddTransient<UpdateBookPage>();

#if DEBUG
        builder.Logging.AddDebug();
#endif
        return builder.Build();
    }
}
