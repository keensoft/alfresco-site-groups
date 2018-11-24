var siteConfig = widgetUtils.findObject(model.jsonModel, "id",
		"HEADER_SITE_CONFIGURATION_DROPDOWN");

var sites = [];
var result = remote.call("/api/people/" + encodeURIComponent(user.name) + "/sites");
model.role = "Undefined";
if (result.status == 200)
{
	var managers, i, ii, j, jj;
	
	// Create javascript objects from the server response
	sites = eval('(' + result + ')');

	if (sites.length > 0)
	{
		for (var index = 0; index < sites.length; index++)
		{
			site = sites[index];

			// Is current user a Site Manager for this site?
			site.isSiteManager = false;
			if (page.url.templateArgs.site == site.shortName && site.siteManagers)
			{
				managers = site.siteManagers;
				for (j = 0, jj = managers.length; j < jj; j++)
				{
					if (managers[j] == user.name)
					{
						model.role = "SiteManager";
						break;
					}
				}
			}
		}
	}
}

if (siteConfig != null && model.role == "SiteManager") {

	// Add Customize Dashboard
	siteConfig.config.widgets.push({
		id : "HEADER_GROUPS_MANAGEMENT",
		name : "alfresco/menus/AlfMenuItem",
		config : {
			id : "HEADER_GROUPS_MANAGEMENT",
			label : "link.groupsManagement",
			title: "link.groupsManagement",
            iconAltText: "link.groupsManagement",
			iconClass : "alf-profile-icon",
			targetUrl : "site/" + page.url.templateArgs.site + "/hdp/ws/groups-management",
		}
	});
}
