alfresco-site-groups
====================

This extension adds a new ```Groups management``` option in Alfresco Share site configuration menu.

The plugin is licensed under the [GPL v3.0](http://www.gnu.org/licenses/gpl-3.0.html). The current version is compatible with Alfresco **5.0** CE.

This plugin is based on [Alfresco Aikau](https://github.com/Alfresco/Aikau/blob/master/tutorial/chapters/About.md) and is experimental by now.

Downloading the ready-to-deploy-plugin
--------------------------------------
The binary distribution is made of one AMP file for repo and another AMP file for share:

* [share AMP](https://github.com/keensoft/alfresco-site-groups/releases/download/1.0-SNAPSHOT/agreement-site-groups-1.0-SNAPSHOT.amp)

You can install it by using standard [Alfresco deployment tools](http://docs.alfresco.com/community/tasks/dev-extensions-tutorials-simple-module-install-amp.html)

Building the artifacts
----------------------
If you are new to Alfresco and the Alfresco Maven SDK, you should start by reading [Jeff Potts' tutorial on the subject](http://ecmarchitect.com/alfresco-developer-series-tutorials/maven-sdk/tutorial/tutorial.html).

You can build the artifacts from source code using maven
```sh
$ mvn clean package
```