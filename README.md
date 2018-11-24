alfresco-site-groups
====================

This addon provides a new ```Groups management``` option in Alfresco Share site configuration menu in order to manage groups locally to a site. Available only for Site Administrators.

The plugin is licensed under the [GPL v3.0](http://www.gnu.org/licenses/gpl-3.0.html). The current version is compatible with Alfresco **5.2** and Alfresco **6.0** and it can be deployed on Alfresco **5.0.c** with some conditions detailed at [releases section](https://github.com/keensoft/alfresco-site-groups/releases/tag/5.0.c).

This plugin is based on [Alfresco Aikau](https://github.com/Alfresco/Aikau/blob/master/tutorial/chapters/About.md) and will be experimental forever.

Downloading the ready-to-deploy-plugin
--------------------------------------
The binary distribution is made of one JAR file for repo and another JAR file for share:

* [repo AMP](https://github.com/keensoft/alfresco-site-groups/releases/download/2.0.0/site-groups-repo-2.0.0.jar)
* [share AMP](https://github.com/keensoft/alfresco-site-groups/releases/download/2.0.0/site-groups-share-1.1.0.jar)

You can install it by using standard *Alfresco deployment tools*.

Building the artifacts
----------------------
If you are new to Alfresco and the Alfresco Maven SDK, you should start by reading [Jeff Potts' tutorial on the subject](http://ecmarchitect.com/alfresco-developer-series-tutorials/maven-sdk/tutorial/tutorial.html).

You can build the artifacts from source code using maven
```sh
$ mvn clean package
```
