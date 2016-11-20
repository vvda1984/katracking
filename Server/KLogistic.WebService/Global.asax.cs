using KLogistic.Core;
using KLogistic.WebService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Security;
using System.Web.SessionState;

namespace KLogistic
{
    public class Global : HttpApplication
    {
        protected void Application_Start(object sender, EventArgs e)
        {
            AppStartup.Setup();
        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {
            var log = LogManager.GetLogger<Global>();
            log.WriteVerbose("Add Access-Control-Allow-Origin");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Origin", "*");
            HttpContext.Current.Response.AddHeader("Access-Control-Allow-Credentials", "true");
            if (HttpContext.Current.Request.HttpMethod == "OPTIONS")
            {
                log.WriteVerbose("Add Access-Control-Allow-Methods");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,DEBUG,OPTIONS");

                StringBuilder headers = new StringBuilder("Content-Type");
                var values = EnumHelper.GetValues<RequestHeaders>();
                foreach(var value in values)
                    headers.Append(",").Append(EnumHelper.GetDisplayValue(value));

                log.WriteVerbose($"Add Access-Control-Allow-Headers: {headers.ToString()}");
                HttpContext.Current.Response.AddHeader("Access-Control-Allow-Headers", headers.ToString());                
                HttpContext.Current.Response.AddHeader("Access-Control-Max-Age", "1728000");
                HttpContext.Current.Response.End();
            }
        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}