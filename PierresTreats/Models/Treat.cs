using System.Collections.Generic;

namespace PierresTreats.Models
{
  public class Treat
  {
    public Treat()
    {
      this.JoinEntities = new HashSet<FlavorTreat>();
    }

    public string Name {get; set;}
    public int Calories {get; set;}
    public int Cost {get; set;}
    public int TreatId {get; set;}
    public virtual ApplicationUser User {get; set;}
    public virtual ICollection<FlavorTreat> JoinEntities {get; set;}
  }
}