using System.ComponentModel.DataAnnotations;

namespace kinetic_api.Enums;

public enum EProjectStatus
{
    Planning,
    Active,
    [Display(Name = "On hold")] OnHold,
    Archived
}