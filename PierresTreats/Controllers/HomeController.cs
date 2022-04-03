using Microsoft.AspNetCore.Mvc;
using PierresTreats.Models;
using System.Linq;

namespace PierresTreats.Controllers
{
  public class HomeController : Controller
  {
    private readonly PierresTreatsContext _db;

    public HomeController(PierresTreatsContext db)
    {
      _db = db;
    }

    [HttpGet("/")]
    public ActionResult Index()
    {
      ViewBag.Treats = _db.Treats.OrderBy(t => t.Name).ToList();
      ViewBag.Flavors = _db.Flavors.OrderBy(f => f.Name).ToList();
      return View();
    }

  }
}