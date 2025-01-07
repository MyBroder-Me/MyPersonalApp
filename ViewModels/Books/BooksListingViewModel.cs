﻿using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using MyApp.Models;
using MyApp.Services;
using System.Collections.ObjectModel;

namespace MyApp.ViewModels;

public partial class BooksListingViewModel : ObservableObject
{
    private readonly IDataService _dataService;
    private readonly IStorageService _storageService;
    private readonly string _bucket = "books_bucket";

    public ObservableCollection<Book> Books { get; set; } = [];

    public BooksListingViewModel(IDataService dataService, IStorageService storageService)
    {
        _dataService = dataService;
        _storageService = storageService;
    }

    [RelayCommand]
    public async Task GetBooks()
    {
        Books.Clear();

        try
        {
            var books = await _dataService.GetBooks();

            if (books.Any())
            {
                foreach (var book in books)
                {
                    Books.Add(book);
                }
            }
        }
        catch (Exception ex)
        {
            await Shell.Current.DisplayAlert("Error", ex.Message, "OK");
        }
    }

    [RelayCommand]
    private async Task AddBook() => await Shell.Current.GoToAsync("AddBookPage");

    [RelayCommand]
    private async Task DeleteBook(Book book)
    {
        var result = await Shell.Current.DisplayAlert("Delete", $"Are you sure you want to delete \"{book.Title}\"?", "Yes", "No");

        if (result is true)
        {
            try
            {
                await _storageService.DeleteFileAsync(_bucket, book.ImageUrl, book, "img", true);
                await _storageService.DeleteFileAsync(_bucket, book.EBookUrl, book, "pdf", true);
                await _dataService.DeleteBook(book.Id);
                await GetBooks();
            }
            catch (Exception ex)
            {
                await Shell.Current.DisplayAlert("Error", ex.Message, "OK");
            }
        }
    }

    [RelayCommand]
    private async Task UpdateBook(Book book)
    {
        await Shell.Current.GoToAsync("UpdateBookPage", new Dictionary<string, object>
        {
            {"BookObject", book }
        });
    }
    private string GetImagePath(string input)
    {
        string bucketIdentifier = "/books_bucket/";
        int startIndex = input.IndexOf(bucketIdentifier);

        if (startIndex != -1)
        {
            startIndex += bucketIdentifier.Length;
            return input.Substring(startIndex);
        }
        return input;
    }

    [RelayCommand]
    private async Task DownloadBook(Book book)
    {
        if (!string.IsNullOrEmpty(book.EBookUrl))
        {
            // Logic to download the book using the URL stored in book.EBookUrl
            await Launcher.OpenAsync(new Uri(book.EBookUrl));
        }
        else
        {
            // Handle case where the URL is not available
            await Shell.Current.DisplayAlert("Error", "EBook URL is not available.", "OK");
        }
    }
}