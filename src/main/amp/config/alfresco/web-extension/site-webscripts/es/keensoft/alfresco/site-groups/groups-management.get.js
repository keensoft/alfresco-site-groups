var siteName = page.url.templateArgs.site;

var options = [];
var result = remote.call("/alfresco/service/api/sites/" + siteName + "/memberships");
if (result.status.code == status.STATUS_OK)
{
   var rawData = JSON.parse(result);
   if (rawData && rawData.people)
   {
      var people = rawData.people;
      for (var i=0; i<people.length; i++)
      {
         options.push({
            value: people[i].userName,
            label: people[i].firstName + " " + people[i].lastName
         });
      }
   }
}

var sites = [];
var result = remote.call("/api/people/" + encodeURIComponent(user.name) + "/sites");
model.role = "Undefined";
if (result.status == 200)
{
	var managers, i, ii, j, jj;
	
	sites = eval('(' + result + ')');

	if (sites.length > 0)
	{
		for (var index = 0; index < sites.length; index++)
		{
			site = sites[index];

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

model.jsonModel = {
   services: [
		"alfresco/services/CrudService",
		"alfresco/services/DialogService",
		"site-groups/GroupsManagementService",
		"alfresco/services/OptionsService"
   ],
   widgets:[
	  addMainWidget()
   ]
};

function addMainWidget(){
	if (model.role == "SiteManager"){
		return {
	       name: "alfresco/layout/ClassicWindow",
	       config: {
	          title: "link.title",
	          refreshCurrentItem: true,
	          widgets: [
	            {
	              name: "alfresco/layout/VerticalWidgets",
	              config: {
	                widgets:[
	                     createGroupMenuBar(siteName),
	                     createGroupList(siteName),
	                     createGroupPageControls()
	                ]
	              }
	            }
	          ]
	       }
		};
	} else {
		return addWarningBanner();
	}
}

function createGroupMenuBar(siteName){
	var gropsSelectorWidget = {
	   name: "alfresco/documentlibrary/AlfSelectDocumentListItems"
	};
	
	var createGroupButtonWidget = {
       name: "alfresco/menus/AlfMenuBarItem",
	   config: createNewGroup(siteName)
	};
	
	var groupsSelectedActionsWidget = {
	      name: "alfresco/documentlibrary/AlfSelectedItemsMenuBarPopup",
		  config: {
		      passive: false,
		      itemKeyProperty: "shortName",
		      label: "link.groups.selected",
		      widgets: [
		         {
		            name: "alfresco/menus/AlfMenuGroup",
		            config: {
		               widgets: [
		                  {
		                     name: "alfresco/menus/AlfSelectedItemsMenuItem",
		                     config: {
		                    	 label: "link.action.delete",
		                         iconClass: "alf-delete-icon",
		                         clearSelectedItemsOnClick: true,
		                         publishTopic: "keensoft_DELETE_GROUPS",
		                         publishPayload: {
		                        	 noRefresh: false
	                	         },
  		                         publishGlobal: true
		                     }
		                  }
		               ]
		            }
		         }
		      ]
	     }
    };
		
	var groupsMenuBarWidget = {
	  name: "alfresco/menus/AlfMenuBar",
	  config: {
	    widgets: [
		  gropsSelectorWidget,
		  createGroupButtonWidget,
		  groupsSelectedActionsWidget
	    ]
	  }
	};
	
	return groupsMenuBarWidget;
}

function createNewGroupButton(){
	return {
	  name: "alfresco/buttons/AlfButton",
	  config: createNewGroup()
	}
}

function createGroupList(siteName){
	
	var selectorWidget = {
	    name: "alfresco/lists/views/layouts/Cell",
	    config: {
	      additionalCssClasses: "mediumpad",
	      widgets: [
	        {
	        	name: "alfresco/renderers/Selector"
	        }
	      ]
	    }
	};
	
	var shortNamePropertyWidget = {
        name: "alfresco/lists/views/layouts/Cell",
        config: {
      	additionalCssClasses: "mediumpad",
          widgets: [
			{
			  name: "alfresco/renderers/PropertyLink",
			  config: {
				  propertyToRender: "shortName",
				  useCurrentItemAsPayload: false,
				  publishTopic: "ALF_CREATE_DIALOG_REQUEST",
				  publishPayloadType: "PROCESS",
				  publishPayloadModifiers: ["processCurrentItemTokens"],
				  publishPayload: editUsersGroupPopUp()
			  }
			}
		  ]
        }
    };
	
	var displayNamePropertyWidget = {
        name: "alfresco/lists/views/layouts/Cell",
        config: {
      	  additionalCssClasses: "mediumpad",
      	  widgets: [
      	      {
      	    	name: "alfresco/renderers/InlineEditProperty",
		        config: {
	               propertyToRender: "displayName",
	               requirementConfig: {
	                  initialValue: true
	               },
	               publishTopic: "ALF_CRUD_UPDATE",
	               publishPayloadType: "PROCESS",
	               publishPayloadModifiers: ["processCurrentItemTokens"],
	               publishPayloadItemMixin: false,
	               publishPayload: {
	                  url: "api/groups/{shortName}",
	                  noRefresh: true
	               }
		        }
      	      }
		  ]
        }
    };
	
	var editGroupMembersActionWidget = {
  	  name: "alfresco/renderers/PublishAction",
	  config: {
		  iconClass: "edit-16",
		  useCurrentItemAsPayload: false,
          publishTopic: "ALF_CREATE_DIALOG_REQUEST",
          publishPayloadType: "PROCESS",
          publishPayloadModifiers: ["processCurrentItemTokens"],
          publishPayload: editUsersGroupPopUp()
	  }
    };
	
	var deleteGroupActionWidget = {
  	  name: "alfresco/renderers/PublishAction",
	  config: {
            iconClass: "delete-16",
            publishTopic: "ALF_CRUD_DELETE",
            publishPayloadType: "PROCESS",
            publishPayloadModifiers: ["processCurrentItemTokens"],
            publishPayload: {
          	   url: "api/groups/{shortName}",
          	   noRefresh: false
            },
            publishGlobal: true
        }
    };
	
	var groupActionsWidget = {
	    name: "alfresco/lists/views/layouts/Cell",
	    config: {
	  	  additionalCssClasses: "mediumpad",
	  	  widgets: [
             editGroupMembersActionWidget,
             deleteGroupActionWidget
          ]
	    }
	};
	
	var groupListHeaderWidget = [
     {
     	name: "alfresco/lists/views/layouts/HeaderCell",
     	config: {
     	     label: "",
     	     width: "5"
     	}
      },
      {
         name: "alfresco/lists/views/layouts/HeaderCell",
         config: {
            label: "link.groups.identifier",
            sortable: true,
            sortValue: "shortName"
         }
      },
      {
         name: "alfresco/lists/views/layouts/HeaderCell",
         config: {
            label: "link.groups.name",
            sortable: true,
            sortValue: "displayName"
         }
      },
      {
         name: "alfresco/lists/views/layouts/HeaderCell",
         config: {
            label: "link.groups.actions",
            width: "15"
         }
      }
	];
	
	var listViewWidget = {
	  name: "alfresco/lists/views/AlfListView",
	  config: {
		  additionalCssClasses: "bordered",
		  widgetsForHeader: groupListHeaderWidget,
	      widgets: [
		      {
		        name: "alfresco/lists/views/layouts/Row",
		        config: {
		          widgets: [
					selectorWidget,
		            shortNamePropertyWidget,
		            displayNamePropertyWidget,
		            groupActionsWidget
		          ]
		        }
		      }
	      ]
	  }
	};
	
	var groupListWidget = {
      name: "alfresco/lists/AlfSortablePaginatedList",
      config: {
         loadDataPublishTopic: "keensoft_GET_GROUPS",
         loadDataPublishPayload: {
        	shortNameFilter: siteName + "*"
         },
         itemsProperty: "data",
         sortField: "shortName",
         widgets: [
            listViewWidget
         ]
      }
    };
	
	return groupListWidget;
}

function editUsersGroupPopUp(){
	var displayNameWidget = {
        name: "alfresco/renderers/Property",
        config: {
          propertyToRender: "displayName"
        }
    };
	
	var removeUserFromGroupWidget =	{
		name: "alfresco/renderers/PublishAction",
		align: "right",
		config: {
		   iconClass: "delete-16",
		   publishTopic: "keensoft_REMOVE_USER_FROM_GROUP",
		   publishPayloadType: "PROCESS",
		   publishPayloadModifiers: ["processCurrentItemTokens"],
		   publishPayload: {
		      groupId: "{shortName}",
		      pubSubScope: "GROUP_USERS_"
		   },
		   publishGlobal: true,
		   publishPayloadItemMixin: true,
		   showCancelButton: false,
		}
	};
	
	var groupMembersListWidget = {
        name: "alfresco/documentlibrary/views/AlfDocumentListView",
        config: {
          widgets: [
            {
              name: "alfresco/lists/views/layouts/Row",
              config: {
                widgets: [
                  {
                    name: "alfresco/lists/views/layouts/Cell",
                    config: {
                      widgets: [
                         displayNameWidget
                      ]
                    }
                  },
                  {
                    name: "alfresco/lists/views/layouts/Cell",
                    config: {
                      widgets: [
                    	  removeUserFromGroupWidget
        	          ]
                    }
                  }
                ]
              }
            }
          ]
        }
    };
	
	var membersListWidget = {
		name: "alfresco/lists/AlfList",
		config: {
			pubSubScope: "GROUP_USERS_",
			waitForPageWidgets: false,
		    loadDataPublishTopic: "ALF_CRUD_GET_ALL",
		    loadDataPublishPayload: {
		      url: "api/groups/{shortName}/children?sortBy=displayName"
		    },
		    itemsProperty: "data",
		    widgets: [
		       groupMembersListWidget
		    ]
		}
	};
	
	var siteUsersDropDownWidget = {
	   name: "alfresco/forms/controls/Select",
	   config: {
	      label: "link.label.user",
	      description: "link.action.add",
	      name: "userName",
	      optionsConfig: {
	    	  pubSubScope: "GROUP_USERS",
	    	  fixed: options,
	    	  publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
	    	  publishPayload: {
	    	    url: url.context + "/proxy/alfresco/api/sites/" + siteName + "/memberships",
	    	    itemsAttribute: "",
	    	    labelAttribute: "authority.userName",
	    	    valueAttribute: "authority.userName"
	    	  }
	      }
	   }
	};
	
	var addGroupMemberFormWidget = {
	   name: "alfresco/forms/Form",
	   config: {
	      okButtonLabel: "Add User",
	      okButtonPublishTopic: "keensoft_ADD_USER_TO_GROUP",
	      okButtonPublishPayload: {
	         groupId: "{shortName}",
	         pubSubScope: "GROUP_USERS_"
	      },
	      okButtonPublishGlobal: true,
	      showCancelButton: false,
	      widgets: [
		     siteUsersDropDownWidget
	      ]
	   }
    }
	
	var editGroupMembersWidget = {
      dialogTitle: "{shortName}",
      fixedWidth: true,
      widgetsContent: [
	     membersListWidget,
	     addGroupMemberFormWidget
      ]
    }
	
	return editGroupMembersWidget;
}

function createGroupPageControls(){
	return {
	  name: "alfresco/documentlibrary/AlfDocumentListPaginator",
	  config: {
		  "compactMode": true
	  }
	}
}

function createNewGroup(siteName){
	var identifierWidget = {
	  name: "alfresco/forms/controls/TextBox",
	  config: {
	    fieldId: "ID",                        
	    label: "link.groups.identifier",
	    name: "groupId",
	    description: "link.action.add.repeated",
	    requirementConfig: {
	      initialValue: true
	    },
	    validationConfig: [
	      {
	        validation: "regex",
	        regex: "^[A-Za-z0-9]+$",
	        errorMessage: "link.action.add.validation"
	      }
	    ]
	  }
	};
	
	var displayNameWidget = {
	  name: "alfresco/forms/controls/TextBox",
	  config: {
	    fieldId: "DISPLAYNAME",
	    label: "link.groups.name",
	    name: "displayName"
	  }
	};
	
	var formDialog = {
	  label: "dialog.title",
	  publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
	  publishPayload: {
	     dialogTitle: "dialog.title",
	     dialogConfirmationButtonTitle: "dialog.title.confirm",
	     dialogCancellationButtonTitle: "dialog.title.cancel",
	     formSubmissionTopic: "keensoft_CREATE_GROUP",
	     formSubmissionPayloadMixin: {
	  	   site: siteName
	     },
	     fixedWidth: true,
	     widgets: [
	        identifierWidget,
	        displayNameWidget
	     ]
	  }
	};
	
	return formDialog;
}

function addWarningBanner(){
	return {
	   name: "alfresco/header/Warning",
	   config: {
	      warnings: [
	         {
	            message: "window.error.message",
	            level: 3
	         }
	      ]
	   }
	};
}