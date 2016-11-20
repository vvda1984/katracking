using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace KLogistic
{
    public enum KEnvironment
    {
        [Display(ShortName = "DEV")]
        Development = 0,

        [Display(ShortName = "TEST")]
        Testing = 1,

        [Display(ShortName = "PROD")]
        Production = 2,
    }
}
