using GoogleMapsApi;
using GoogleMapsApi.Entities.Directions.Response;
using GoogleMapsApi.Entities.DistanceMatrix.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace KLogistic.ServiceHost
{
    public class GoogleServiceBase
    {
        protected string apiKey = null;
    }


    class GDirectionService : GoogleServiceBase
    {
        public GDirectionService(string key = null)
        {
            if (key != null)
                apiKey = key;
        }

        public DirectionResult GetTimeAndDistance(double lat1, double lng1, double lat2, double lng2)
        {
            DirectionResult result = new DirectionResult();
            try
            {
                var request = new DistanceMatrixRequest
                {
                    Origins = new string[] { $"{lat1},{lng1}" },
                    Destinations = new string[] { $"{lat2},{lng2}" },
                    Mode = DistanceMatrixTravelModes.driving,
                };
                if (!string.IsNullOrWhiteSpace(apiKey)) request.ApiKey = apiKey;
                var response = GoogleMaps.DistanceMatrix.Query(request);

                if (response.Status != DirectionsStatusCodes.OK)
                {
                    result.ErrorMessage = $"Google Service return code: {response.Status.ToString()}";
                }
                else
                {
                    var row = response.Rows.FirstOrDefault();
                    if (row == null)
                        result.ErrorMessage = $"Response.Rows has no item";
                    else
                    {
                        var element = row.Elements.FirstOrDefault();
                        if (element == null)
                            result.ErrorMessage = $"Response.Rows.Elements has no item";
                        else
                        {
                            result.DurationText = element.Duration.Text;
                            result.DurationValue = element.Duration.Value;
                            result.DistanceText = element.Distance.Text;
                            result.DistanceValue = element.Distance.Value;
                        }
                    }
                    result.DestinationAddress = response.DestinationAddresses.FirstOrDefault();
                    result.OriginalAddress = response.OriginAddresses.FirstOrDefault();
                }
            }
            catch (Exception ex)
            {
                result.ErrorMessage = ex.ToString();
            }
            return result;
        }

        private static GDirectionService _instance;
        public static GDirectionService Current
        {
            get
            {
                if (_instance == null)
                {
                    string apiKey = AppSettings.Current.GetString("apiKey");
                    _instance = new GDirectionService(apiKey);
                }
                return _instance;
            }
        }
    }

    public class DirectionResult
    {
        public bool IsError { get { return string.IsNullOrEmpty(ErrorMessage); } }
        public string ErrorMessage { get; set; }
        public string DestinationAddress { get; set; }
        public string OriginalAddress { get; set; }
        public string DistanceText { get; set; }
        public int DistanceValue { get; set; }
        public string DurationText { get; set; }
        public TimeSpan DurationValue { get; set; }
    }
}
