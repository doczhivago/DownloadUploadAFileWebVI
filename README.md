# DownloadUploadAFileWebVI
Library to upload or download a text file to and from a LabVIEW NXG WebVI. 

To add the Download and Upload Library.gcomp to a new project, follow these steps:
1. Open HTML Editor and add an input button and make invisible
 <input type="file" id="myFile" style="display: none;">
 
2. Add JSLI node in its own Library component. Add the below functions to call into the OpenFileWebVI.js

3. Add button to call OpenFileWebVI from JSLI, wait for file read to complete, and write text to String indicator.