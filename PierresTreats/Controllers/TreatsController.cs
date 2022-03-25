using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using PierresTreats.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Security.Claims;
using System;

namespace PierresTreats.Controllers
{
  // [Authorize]
  public class TreatsController : Controller
  {
    private readonly PierresTreatsContext _db;
    private readonly UserManager<ApplicationUser> _userManager;

    public TreatsController(UserManager<ApplicationUser> userManager, PierresTreatsContext db)
    {
      _userManager = userManager;
      _db = db;
    }
    [AllowAnonymous]
    public ActionResult Index()
    {
      List<Treat> model = _db.Treats.OrderBy(b => b.Name).ToList();
      return View(model);
    }

    public ActionResult Create()
    {
      return View();
    }

    [HttpPost]
    public async Task<ActionResult> Create(Treat Treat)
    {
      var userId = this.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
      var currentUser = await _userManager.FindByIdAsync(userId);
      Treat.User = currentUser;
      _db.Treats.Add(Treat);
      _db.SaveChanges();
      return RedirectToAction("Index");
    }

    [AllowAnonymous]
    public ActionResult Details(int id)
    {
      IEnumerable<Treat> thisTreat = new List<Treat>();
      thisTreat = _db.Treats.Where(t => t.TreatId == id).Select(x =>
                  new Treat()
                  {
                    Name = x.Name,
                    TreatId = x.TreatId,
                    Calories = x.Calories,
                    Cost = x.Cost
                  });
      var listOfJoins = _db.FlavorTreat.ToList().Where(t => t.TreatId == id);
      var listOfFlavors = new List<Flavor>{};
      foreach (var join in listOfJoins) {
        listOfFlavors.Add(
              new Flavor() 
              {
                Name = join.Flavor.Name,
                FlavorId = join.Flavor.FlavorId
              }
          );
      }
      return Json(new {thisTreat = thisTreat, listOfFlavors = listOfFlavors});
    }

    [HttpPost]
    public ActionResult Delete(int TreatId)
    {
      var thisTreat = _db.Treats.FirstOrDefault(b => b.TreatId == TreatId);
      _db.Treats.Remove(thisTreat);
      _db.SaveChanges();
      string message = "SUCCESS";
      return Json(new { Message = message });
    }

    public ActionResult Edit(int id)
    {
      var thisTreat = _db.Treats.FirstOrDefault(Treat => Treat.TreatId == id);
      return View(thisTreat);
    }
    [HttpPost]
    public ActionResult Edit(Treat Treat)
    {
      _db.Entry(Treat).State = EntityState.Modified;
      _db.SaveChanges();
      string message = "SUCCESS";
      return Json(new { Message = message });
    }

    public ActionResult GetFlavors()
    {
      Console.WriteLine("it made it");
      IEnumerable<Flavor> jsonFlavors = new List<Flavor>();
      jsonFlavors = _db.Flavors.ToList().Select(x =>
                  new Flavor()
                  {
                    Name = x.Name,
                    FlavorId = x.FlavorId
                  });
      return Json(jsonFlavors);
    }

    [HttpPost]
    public ActionResult AddFlavor(int FlavorId, int TreatId)
    {
      Flavor thisFlavor = _db.Flavors.FirstOrDefault(Treat => Treat.FlavorId == FlavorId);
      if (thisFlavor.FlavorId != 0)
      {
        _db.FlavorTreat.Add(new FlavorTreat() {TreatId = TreatId, FlavorId = thisFlavor.FlavorId});
      }
      _db.SaveChanges();
      string message = "SUCCESS";
      return Json(new { Message = message, thisFlavor = thisFlavor });
    }

    [HttpPost]
    public ActionResult DeleteFlavor (int joinId)
    {
      ViewBag.PageTitle = "Remove flavor";
      var joinEntry = _db.FlavorTreat.FirstOrDefault(entry => entry.FlavorTreatId == joinId);
      _db.FlavorTreat.Remove(joinEntry);
      _db.SaveChanges();
      return RedirectToAction("Index");
    }

  }
}
