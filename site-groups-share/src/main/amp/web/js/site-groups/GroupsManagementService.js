define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "dojo/_base/array",
        "alfresco/dialogs/AlfDialog"],
        function(declare, Core, lang, CoreXhr, AlfConstants, array, AlfDialog) {

	return declare([Core, CoreXhr], {

    constructor: function keensoft_GroupsManagement__constructor(args) {
      lang.mixin(this, args);
      this.alfSubscribe("keensoft_CREATE_GROUP", lang.hitch(this, this.createGroup));
      this.alfSubscribe("keensoft_ADD_USER_TO_GROUP", lang.hitch(this, this.addUserToGroup));
      this.alfSubscribe("keensoft_REMOVE_USER_FROM_GROUP", lang.hitch(this, this.removeUserFromGroup));
      this.alfSubscribe("keensoft_GET_GROUPS", lang.hitch(this, this.getGroups));
      this.alfSubscribe("keensoft_GET_USERS", lang.hitch(this, this.getUsers));
      this.alfSubscribe("keensoft_DELETE_GROUPS", lang.hitch(this, this.deleteGroups));
    },

    createGroup: function keensoft_GroupsManagement__createGroup(payload) {
	  this.serviceXhr({
	    url: AlfConstants.PROXY_URI + "api/keensoft/rootgroups/" + payload.site + "_" + payload.groupId,
	    method: "POST",
	    data: {
	      displayName: payload.displayName,
	      pubSubScope: payload.pubSubScope
	    },
	    successCallback: this.onSuccess,
	    callbackScope: this
	  });
	},
	
	onSuccess: function keensoft_GroupsManagement__onSuccess(response, originalRequestConfig) {
	   var pubSubScope = lang.getObject("data.pubSubScope", false, originalRequestConfig);
	   if (pubSubScope == null){
	      pubSubScope = "";
	   }
	   this.alfPublish(pubSubScope + "ALF_DOCLIST_RELOAD_DATA");
	},
	
	addUserToGroup: function keensoft_GroupsManagement__addUserToGroup(payload) {
	   this.serviceXhr({
	      url: AlfConstants.PROXY_URI + "api/keensoft/groups/" + payload.groupId + "/children/" + payload.userName,
	      method: "POST",
	      data: {
	         pubSubScope: payload.pubSubScope
	      },
	      successCallback: this.onSuccess,
	      callbackScope: this
	   });
	},
	
	removeUserFromGroup: function keensoft_GroupsManagement__removeUserFromGroup(payload) {
	  this.serviceXhr({
	    url: AlfConstants.PROXY_URI + "api/keensoft/groups/" + payload.groupId + "/children/" + payload.shortName,
	    method: "DELETE",
	    data: {
	      pubSubScope: payload.pubSubScope
	    },
	    successCallback: this.onSuccess,
	    callbackScope: this
	  });
	},
	
	getGroups: function keensoft_GroupsManagement__getGroups(payload) {
	  var alfTopic = 
	    (payload.alfResponseTopic != null) ? payload.alfResponseTopic : "";
	  
	  var shortNameFilter =
		(payload.shortNameFilter != null) ? payload.shortNameFilter : "";

	  var sortDir = 
	    (payload.sortAscending != null && payload.sortAscending === true) ? "asc" : "desc";

	  var sortField = 
	    (payload.sortField != null) ? payload.sortField : "shortName";

	  this.serviceXhr({
	    url: AlfConstants.PROXY_URI + "api/groups?shortNameFilter=" + shortNameFilter + "&dir=" + sortDir + "&sortBy=" + sortField + "&zone=APP.DEFAULT",
	    method: "GET",
	    alfTopic: alfTopic
	  });
	},
	
	getUsers: function keensoft_GroupsManagement__getUsers(payload) {
	  this.serviceXhr({
	    url: AlfConstants.PROXY_URI + "api/people",
	    method: "GET",
	    alfTopic: alfTopic
	  });
	},
	deleteGroups: function keensoft_GroupsManagement__deleteGroups(payload) {
		var groupsToDelete = payload.selectedItems;
		if (groupsToDelete != null){
		    array.forEach(groupsToDelete, lang.hitch(this, this.deleteGroup));
		}
	},
	deleteGroup: function keensoft_GroupsManagement__deleteGroup(payload) {
	  this.serviceXhr({
	  url: AlfConstants.PROXY_URI + "api/keensoft/groups/" + payload.shortName,
	    method: "DELETE",
	    successCallback: this.onSuccess,
	    callbackScope: this
	  });
	},
  });
});