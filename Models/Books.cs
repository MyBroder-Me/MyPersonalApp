
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace MyApp.Models;

[Table("books")]
public class Book : BaseModel
{
    [PrimaryKey("id", false)]
    public string Id { get; set; }

    [Column("title")]
    public string Title { get; set; }

    [Column("author")]
    public string Author { get; set; }

    [Column("created_at", ignoreOnInsert: true)]
    public DateTime CreatedAt { get; set; }

    [Column("is_finished")]
    public bool IsFinished { get; set; }

    [Column("image_url")]
    public string ImageUrl { get; set; }

    [Column("ebook_url")]
    public string EBookUrl { get; set; }
}