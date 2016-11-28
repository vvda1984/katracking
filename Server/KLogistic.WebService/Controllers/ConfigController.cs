using KLogistic.Core;
using KLogistic.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace KLogistic.WebService
{
    public partial class KAService
    {
        public GetSettingsResponse GetSettings(BaseRequest request)
        {
            return Run<BaseRequest, GetSettingsResponse>(request, (resp, db, session) =>
            {
                resp.Items = new List<SettingModel>();
                var items = db.DBModel.Settings.ToArray();
                foreach (var i in items)
                    resp.Items.Add(new SettingModel(i));
            });
        }

        public BaseResponse SubmitSettings(SubmitSettingsRequest request)
        {
            return Run<SubmitSettingsRequest, GetSettingsResponse>(request, (resp, db, session) =>
            {
                foreach (var item in request.items)
                {
                    var setting = db.DBModel.Settings.FirstOrDefault(x => x.Id == item.Id || string.Compare(x.Name, item.Name, StringComparison.OrdinalIgnoreCase) == 0);
                    if (setting == null)
                    {
                        db.DBModel.Settings.Add(new Setting()
                        {
                            CreatedTS = DateTime.Now,
                            LastUpdatedTS = DateTime.Now,
                            Description = item.Description,
                            Name = item.Name,
                            Value = item.Value,
                        });
                    }
                    else
                    {
                        setting.Name = item.Name;
                        setting.Value = item.Value;
                        setting.Description = item.Description;
                        setting.LastUpdatedTS = DateTime.Now;
                    }
                }
            });
        }
    }
}