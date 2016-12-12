using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.ServiceModel.Web;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        ILogger Log;

        public KAService()
        {
            Log = LogManager.GetLogger<KAService>();
        }

        public BaseResponse SendRequest()
        {
            try
            {
                Stream data = null;
                using (StreamReader sr = new StreamReader(data))
                {
                    string value = sr.ReadToEnd();
                    using (StringReader r = new StringReader(value))
                    {
                        var dict = Newtonsoft.Json.JsonSerializer.Create().Deserialize(new StringReader(value), typeof(Dictionary<string, string>));
                    }
                }
            }
            catch { }
            return new BaseResponse { ErrorMessage = null, Status = 0 };
        }

        //private TResponse SafeProcess<TResponse>(TResponse response, Action<TResponse> action) where TResponse : Response
        //{
        //    try
        //    {
        //        action.Invoke(response);
        //    }
        //    catch (Exception ex)
        //    {
        //        response.ErrorMessage = ex.Message;
        //        response.Status = ReturnCode.Error;
        //    }
        //    return response;
        //}

        //private TResponse SafeProcess<TResponse>(TResponse response, Action<TResponse, DataContext> action) where TResponse : Response
        //{
        //    return SafeProcess(response, (res) =>
        //    {
        //        using (var db = new DataContext())
        //        {
        //            action.Invoke(res, db);
        //            if (!db.IsReadonly) db.SaveChanges();
        //        }
        //    });
        //}

        //private TResponse SafeProcess<TResponse>(string token, TResponse response, Action<TResponse, DataContext, AppSession> action, bool ignoreSaveChanged = false)
        //    where TResponse : Response
        //{
        //    return SafeProcess(response, (res) =>
        //    {
        //        using (var db = new DataContext())
        //        {
        //            var session = db.ValidateToken(token);
        //            action.Invoke(res, db, session);
        //            if (!ignoreSaveChanged && !db.IsReadonly) db.SaveChanges();
        //        }
        //    });
        //}

        //private string GetHeaderParam(RequestHeaders header)
        //{
        //    return GetHeaderParam<string>(header, null);
        //}

        //private T GetHeaderParam<T>(RequestHeaders header, T defaultValue)
        //{
        //    try
        //    {
        //        string name = EnumHelper.GetAttribute<DescriptionAttribute>(header).Description;
        //        var ctx = WebOperationContext.Current;
        //        string value = ctx.IncomingRequest.Headers[name].ToString();
        //        var t = typeof(T);

        //        if (t == typeof(string))
        //            return (T)(object)value;

        //        if (t == typeof(int))
        //        {
        //            if (string.IsNullOrEmpty(value))
        //                return defaultValue;

        //            return (T)(object)int.Parse(value);
        //        }

        //        if (t == typeof(long))
        //        {
        //            if (string.IsNullOrEmpty(value))
        //                return defaultValue;

        //            return (T)(object)long.Parse(value);
        //        }

        //        return (T)Convert.ChangeType(value, t);
        //    }
        //    catch
        //    {
        //        return defaultValue;
        //    }
        //}

        private void ValidateParam(long? userId)
        {
            if (userId == null)
                throw new KException("Missing parameter");
        }

        private long GetParam(long? id, string name = "") 
        {
            if (id == null)
                throw new KException($"Missing parameter {name}");
            return id.Value;
        }

        private double ValidateParamDouble(double? id, string name = "")
        {
            if (id == null)
                throw new KException($"Missing parameter {name}");
            return id.Value;
        }

        private TResponse Run<TRequest, TResponse>(TRequest request, Action<TResponse, DataContext> action, bool ignoreSaveChanged = false) where TResponse : BaseResponse where TRequest : BaseRequest
        {
            var response = DependencyResolver.Resolve<TResponse>();
            try
            {
                using (var db = new DataContext())
                {
                    action.Invoke(response, db);
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message;
                response.Status = ReturnCode.Error;
            }
            return response;
        }

        private TResponse Run<TRequest, TResponse>(TRequest request, Action<TResponse, DataContext, AppSession> action, bool ignoreSaveChanged = false)
            where TResponse : BaseResponse where TRequest : BaseRequest
        {
            var response = DependencyResolver.Resolve<TResponse>();
            try
            {                
                using (var db = new DataContext())
                {
                    var session = db.ValidateToken(request.Token);
                    action.Invoke(response, db, session);
                    if (!ignoreSaveChanged && !db.IsReadonly) db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                response.ErrorMessage = ex.Message;
                response.Status = ReturnCode.Error;
            }
            return response;
        }
    }
}