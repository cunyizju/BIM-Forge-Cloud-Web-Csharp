# ForgeBIM
This repo is to present building information models(BIM) on websites, which is based on C#(bankend) and JavaScript(frontend). The models' formats may be various, including three-dimensional models such as rvt, nwc, nwd, 3dx, etc and two-dimensional drawings such as pdf and dwg. 

## Prerequisites
1.Visual Studio Community 2017  
2. .NET Framework basic knowledge with C#  
3.Autodesk Forge： Client ID and Secret https://forge.autodesk.com/  
****

## Running locally  
1.Download the repository, open forgesample.sln Solution with Visual Studio 2017.   
2.In the lanuchSetting.json file, enter your Client ID & Secret. Run the project.  
3.The build process should download the required packages (Autodesk.Forge and dependencies).   
4.Open http://localhost:3000/ in your brower, where Chrome is recommended.  
5.The app will obtain a 2-legged token and list buckets and objects.Well, if you have not used Forge service, then the buckets and objects will be null. Click "Create buckets" button, then add object via right clicking the bucket that you create.   
6.Wait for a while until your object appears on the website. The waiting time depend on the size of your objects and your internet speed.  
****
7.Right click the object and translate it.  
8.A few seconds later, the object would be viewable.   
****

![ForgeSample](https://github.com/cunyizju/ForgeBIMDeveloping/blob/master/sample.png)

