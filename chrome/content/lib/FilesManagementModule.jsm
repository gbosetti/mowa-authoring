var EXPORTED_SYMBOLS = ["JsonFileManager", "JsonFile", "File", "FilesManager"];


function File(leafName, fullPath, content){

	this.leafName = leafName;
	this.fullPath = fullPath;
	this.content = content;

	this.getName = function(){

		return (this.leafName.lastIndexOf('.') != "-1")?
			this.leafName.substr(0, this.leafName.lastIndexOf('.')): this.leafName;
	};
	this.getFilename = function(){
		return this.leafName;
	};
	this.getExtension = function(){

		return (this.leafName.lastIndexOf('.') != "-1")?
			this.leafName.substr(this.leafName.lastIndexOf('.') + 1)
			: "";
	};
	this.getContent = function(){
		return this.content;
	};
	this.getFullPath = function(){
		return this.fullPath;
	};
	this.asManipulableObject = function(){};
}

function JsonFile(leafName, fullPath, content){

	File.call(this, leafName, fullPath, content);
	this.asManipulableObject = function(){

		try{
			var content = this.content;
			if(content && content.trim && content.trim().length > 0) {
				content = JSON.parse(content);
			}
			return content;
		}catch(err){this.window.console.log(err)}
		return {};
	}
}

function ApplicationJsonFile(file){

	//DO NOT USE file.getName() to call the constructor. For any reason, it does not work when clonned
	JsonFile.call(this,file.leafName,file.fullPath, file.content); //if we apply inheritance, then File should not be prototyped (it can't be clonned)

	this.getDisplayName = function(){
		var name = this.asManipulableObject()["name"];
		return name || this.getName();
	}
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////


function FilesManager(window){

	this.window = window;

	this.fstream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
	this.cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"].createInstance(Components.interfaces.nsIConverterInputStream);

	this.getNsiFile = function(filename, dirs){

		var file = Components.classes["@mozilla.org/file/directory_service;1"].
				getService(Components.interfaces.nsIProperties).
				get("ProfD", Components.interfaces.nsIFile);

			for (var i = 0; i < dirs.length; i++) {
				file.append(dirs[i]);
			}

			file.append(filename);

		return file;
	};
	this.readFileContent = function(file){

		var data = "";
		this.fstream.init(file, -1, 0, 0);
		this.cstream.init(this.fstream, "ISO-8859-1", 0, 0);

		var str = {}, read = 0;
		do {
			read = this.cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
			data += str.value;
		} while (read != 0);

		this.cstream.close();
		return data;
	};
	this.removeFile = function(filename, dirs){
		try{
			var file = this.getNsiFile(filename, dirs);
			if(file.exists())
				file.remove(0);

		}catch(err){this.window.console.log(err)}
	};
	this.writeFile = function(dirs, filename, sourceCode, charset){

		try{
			var nsiFile = this.getNsiFile(filename, dirs);

			if(!nsiFile.exists())
		   		nsiFile.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);

			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
			foStream.init(nsiFile, 0x02 | 0x08 | 0x20, 0777, 0);

			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
				converter.init(foStream, charset, 0, 0);
				converter.writeString(sourceCode);
				converter.close();

			return true;
		}
		catch(err){ this.window.console.log(err); }
		return false;
	};
	this.getNsiFiles = function(dirs){

		var files = new Array();
			var dir = Components.classes["@mozilla.org/file/directory_service;1"].
				getService(Components.interfaces.nsIProperties).
				get("ProfD", Components.interfaces.nsIFile);

			for (var i = 0; i < dirs.length; i++) {
				dir.append(dirs[i]);
			}

			if(!dir.exists()){
				dir.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0777);
			}
			else if (dir.isDirectory()){
				var entries = dir.directoryEntries;
				while(entries.hasMoreElements())
				{
					var file = entries.getNext();
						file.QueryInterface(Components.interfaces.nsIFile);
					files.push(file);
				}
			}
		return files;
	};
	this.saveCurrentArtifactData = function(sourceCode, filename, dirs){
		try{
			var file = this.getNsiFile(filename, dirs);
			if(!file.exists()) {
				file.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0777);
			}

			var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				foStream.init(file, 0x02 | 0x08 | 0x20, 0777, 0);
			var converter = Components.classes["@mozilla.org/intl/converter-output-stream;1"].createInstance(Components.interfaces.nsIConverterOutputStream);
				converter.init(foStream, "ISO-8859-1", 0, 0);
				converter.writeString(sourceCode);

			return true;

		}catch(err){}
		return false;
	};
}

function JsonFileManager(window, appsDir){
	FilesManager.call(this, window);
	this.appsDir = appsDir;
	
	var me = this;
	this.getAuthoredAppsFiles = function(dirs){
		var files = this.getFiles(dirs), wrappedFiles = [];
		for (var i = 0; i < files.length; i++) {
			wrappedFiles.push(new ApplicationJsonFile(files[i]));
		}


		return wrappedFiles;
	};
	this.getFiles = function(dirs){

		var files = [], nsiFiles = this.getNsiFiles(dirs);

		for (var i = 0; i < nsiFiles.length; i++) {

			try{
				var cnt = me.readFileContent(nsiFiles[i]).replace(/(\r\n|\n|\r)/gm,"");

				/*if (nsiFiles[i].leafName == "Lalolakkkkkkk")
					nsiFiles[i].remove(0);
				else*/
				files.push(new JsonFile(
					nsiFiles[i].leafName,
					nsiFiles[i].path,
					cnt.toString()
				));
			}catch(err){}
		}
		return files;
	};
}
