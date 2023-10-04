// ROADMAP v0.2:
// (100%) - UI Improvments 
// (100%) - Create, Edit and Delete Profiles
// (100%) - Scan for empty auth details, enter creds through UI
// (100%) - change auth detail through UI 

// ROADMAP v0.3:
// (100%) - Further UI Improvments -> Animations etc
// (100%) - On first start INIT -> Set Auth data and check for empty string when not empty then create Profile when created then load Main Menu and nav
// (100%) - Send Errors/Status to renderer.js

// ROADMAP v0.4:
// (0%) - Replace MegaSDK with Rclone.js
// (0%) - More Cloud Services (multiple auth profiles)

const { app, BrowserWindow, ipcMain, webContents } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')

const { File, Storage } = require('megajs')
const fs = require("fs")
const admzip = require("adm-zip")

////////  For Testing via "npm start" ////////

WriteToLog(`Started App`)
var Auth = null
var Profiles = null




/////////////////////// ADM-ZIP ///////////////////////////
function createZipArchive(SourcePath, KeyID){
    const zip = new admzip()
    try {
      zip.addLocalFolder(SourcePath) // Path To local FOLDER 
    } catch (error) {
      WriteToLog(`Zip Pathing: ${KeyID + ".zip"} -> ERROR: ${error}`)
      return `Zip Pathing: ${KeyID + ".zip"} -> ERROR: ${error}`
    }
    try {
      zip.writeZip(KeyID + ".zip") // KeyID should be the identifier used in the profile.ini
    } catch (error) {
      WriteToLog(`Zip Writing: ${KeyID + ".zip"} -> ERROR: ${error}`)
      return `Zip Writing: ${KeyID + ".zip"} -> ERROR: ${error}`
    }
    console.log(`Created ${KeyID + ".zip"} successfully`)
    WriteToLog(`Created ${KeyID + ".zip"} successfully`)
    return "Zip Creation: Successful"
}

function extractZipArchive(DestiPath, KeyID){
    const zip = new admzip(KeyID + ".zip");
    try {
      zip.extractAllTo(DestiPath,true)
    } catch (error) {
      WriteToLog(`Zip Extraction: ${KeyID + ".zip"} -> ERROR: ${error}`)
      return `Zip Extraction: ${KeyID + ".zip"} -> ERROR: ${error}`
    }
    console.log(`Extracted to "${DestiPath}" successfully`)
    WriteToLog(`Extracted to "${DestiPath}" successfully`)
    return "Zip Extraction: Successful"
}
///////////////////////////////////////////////////////////


function IsProfileCoverIMGExisting(KeyID){

  if(!fs.existsSync("IMG\\")){
    try {
      fs.mkdirSync("IMG")
      WriteToLog(`Created IMG Folder`)
    } catch (error) {
      WriteToLog(`Couldn't Create IMG Folder: ERROR -> ${error}`)
    }
  }


  if(fs.existsSync(`IMG\\${KeyID}.jpg`)){
    WriteToLog(`Found Cover -> .\\IMG\\${KeyID}.jpg`)
    return `IMG/${KeyID}.jpg`
  }
  else if(fs.existsSync(`IMG\\${KeyID}.jpeg`)){
    WriteToLog(`Found Cover -> .\\IMG\\${KeyID}.jpeg`)
    return `IMG/${KeyID}.jpeg`
  }
  else if(fs.existsSync(`IMG\\${KeyID}.png`)){
    WriteToLog(`Found Cover -> .\\IMG\\${KeyID}.png`)
    return `IMG/${KeyID}.png`
  }
  else if(fs.existsSync(`IMG\\${KeyID}.webp`)){
    WriteToLog(`Found Cover -> .\\IMG\\${KeyID}.webp`)
    return `IMG/${KeyID}.webp`
  }
  else {console.log(`Cover not found -> .\\IMG\\${KeyID}`); WriteToLog(`Cover not found -> .\\IMG\\${KeyID}`); return "Error-404"}
}

function WriteToLog(Data){
    // For todays date;
    var currentdate = new Date(); 
    var datetime = currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

  try {
    fs.appendFileSync("Logs.log",datetime + ": " + Data + "\n");
  } catch (error) {
    console.log("Error Writing to Logs.log")
  }
}


///////////////// MEGAJS SDK UNOFFICIAL ////////////////////////
async function UploadFile (win, SourcePath, KeyID){
  const storage = await new Storage({
    email: Auth.email,
    password: Auth.password
  }).ready

const ReturnResults = []

function return_func(){
  return new Promise((resolve) => {

  // Delete old version of Save
    storage.root.children.forEach((element, index) => {

      if(!element.directory && element.name == KeyID + ".zip"){
          element.delete(true); console.log("Old Save found and deleted");
          WriteToLog("Old Save found and deleted")
        }

      })

      createZipArchive(SourcePath, KeyID)

      try {
        //  await storage.upload(KeyID + '.zip', fs.readFileSync(KeyID + '.zip'), (error, file) => {
        storage.upload(KeyID + '.zip', fs.readFileSync(KeyID + '.zip'), (error, file) => {

          if(error == null){
            try {
              fs.unlinkSync(KeyID + ".zip")
              console.log(`Deleting Zip: ${KeyID + ".zip"} -> Successful`)
              WriteToLog(`Deleting Zip: ${KeyID + ".zip"} -> Successful`)
            } catch (error) {
              console.log(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
              WriteToLog(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
              ReturnResults.push(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
            }
            
            console.log(`Upload Status: ${KeyID + ".zip"} -> Successful!`)
            WriteToLog(`Upload Status: ${KeyID + ".zip"} -> Successful!`)
            ReturnResults.push(`Upload Status: ${KeyID + ".zip"} -> Successful!`)
            resolve(ReturnResults)
          } 
          
          else { 
            try {
              fs.unlinkSync(KeyID + ".zip")
              console.log(`Deleting Zip: ${KeyID + ".zip"} -> Successful`) 
              WriteToLog(`Deleting Zip: ${KeyID + ".zip"} -> Successful`) 
            } catch (error) {
              console.log(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
              WriteToLog(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
              ReturnResults.push(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
            }
  
            console.log(`Upload Status: ${KeyID} -> ERROR: ${error}`) 
            WriteToLog(`Upload Status: ${KeyID} -> ERROR: ${error}`) 
            ReturnResults.push(`Upload Status: ${KeyID} -> ERROR: ${error}`) 
            resolve(ReturnResults)
          }
        })

      } catch (error) {
        console.log(`Upload: ${KeyID} -> ERROR: ${error}`)
        WriteToLog(`Upload: ${KeyID} -> ERROR: ${error}`)
        ReturnResults.push(`Upload: ${KeyID} -> ERROR: ${error}`)
        resolve(ReturnResults)
      }

    })

  }
  return await return_func()
 } 




 async function DownloadFile (win, DestiPath, KeyID){
  const storage = await new Storage({
    email: Auth.email,
    password: Auth.password
  }).ready

  const ReturnResults = []
  let IsFileFound = false

  function func_return(){
    return new Promise((resolve) => {

      storage.root.children.forEach((element, index) => { 

        if(!element.directory && element.name == KeyID + ".zip"){
            IsFileFound = true
            element.download((err, data) => {

                if(err != null){WriteToLog(`Download Status: ${KeyID + '.zip'} -> ERROR: ${err}`); console.error(`Download Status: ${KeyID + '.zip'} -> ERROR: ${err}`); ReturnResults.push(`Download Status: ${KeyID + '.zip'} -> ERROR: ${err}`);}
                else {
                  WriteToLog(`Download Status: ${KeyID + '.zip'} -> Successful`)
                  ReturnResults.push(`Download Status: ${KeyID + '.zip'} -> Successful`)
                  console.log(`Download Status: ${KeyID + '.zip'} -> Successful`)
    
                  try {
                    fs.writeFileSync(KeyID + '.zip', data)
                  } catch (error) {
                    WriteToLog(`Creating File: ${KeyID + '.zip'} -> ERROR: ${error}`) 
                    console.log(`Creating File: ${KeyID + '.zip'} -> ERROR: ${error}`) 
                    ReturnResults.push(`Creating File: ${KeyID + '.zip'} -> ERROR: ${error}`) 
                  }

        
                  ReturnResults.push(extractZipArchive(DestiPath, KeyID))
        
                  try {
                    fs.unlinkSync(KeyID + ".zip")
                  } catch (error) {
                    WriteToLog(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
                    console.log(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
                    ReturnResults.push(`Deleting Zip: ${KeyID + ".zip"} -> ERROR: ${error}`) 
                  }
      
                  resolve(ReturnResults)
                }

              })

          }
        }) 
        if(IsFileFound == false) {
          WriteToLog(`Download Status: ${KeyID + '.zip'} -> ERROR: File Not Found`)
          console.error(`Download Status: ${KeyID + '.zip'} -> ERROR: File Not Found`)
          ReturnResults.push(`Download Status: ${KeyID + '.zip'} -> ERROR: File Not Found`)
          resolve(ReturnResults);
        }
    })
  }
  return await func_return()
 }


/////////////////////////////////////////////////////////////////////////




/////////////////// ELECTRON JS //////////////////////////
// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 380,
    height: 240,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    frame: false,
    autoHideMenuBar: true, // true to hide debug settings
    resizable: false // true to make window sizable
  })



////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////  IPC MAIN -> IPC BRIDGE /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


ipcMain.on('close', () => {
  WriteToLog(`Closed App -> Method: Close-Button`)
  app.quit()
})


ipcMain.on('minimize', () => {
  win.minimize()
})


  //////////  Send to renderer - Functions  //////////
  //////////  JSON Maniplutation Functions  //////////
  ipcMain.handle('AuthUpdate', (event, AuthUpdate) => {
    try {
      fs.writeFileSync('auth.json', JSON.stringify(AuthUpdate))
      Auth = AuthUpdate
      WriteToLog("Auth Update: Successful")
      return `Auth Update: Successful`
    } catch (error) {
      WriteToLog(`Auth Write File: EXCEPTION-ERROR -> ${error}`)
      console.error(`Auth Write File: EXCEPTION-ERROR -> ${error}`)
      return `Auth Write File: EXCEPTION-ERROR -> ${error}`
    }

  })

  ipcMain.handle('ProfilesUpdate', (event, ProfilesUpdate, Name) => {
    try {
          fs.writeFileSync('profiles.json', JSON.stringify(ProfilesUpdate))
          Profiles = ProfilesUpdate
          WriteToLog(`Profiles Update: ${Name} -> Successful`)
          return `Profiles Update: ${Name} -> Successful`
    } catch (error) {
          WriteToLog(`Profile Update: ${Name} -> EXCEPTION-ERROR: ${error}`)
          console.error(`Profile Update: ${Name} -> EXCEPTION-ERROR: ${error}`)
          return `Profile Update: ${Name} -> EXCEPTION-ERROR: ${error}`
    }
  })
/////////////////////////////////////////////////////////////////////


  ipcMain.handle('upload', (event, SourcePath, KeyID) => {
    return UploadFile(win, SourcePath, KeyID);
  })

  ipcMain.handle('download', (event, DestiPath, KeyID) => {
    return DownloadFile(win, DestiPath, KeyID);
  })


  ipcMain.handle('GetProfiles', () => {
    if(fs.existsSync("profiles.json")){
      try {
        Profiles = JSON.parse(fs.readFileSync('profiles.json'))
      } catch (error) {
        WriteToLog(`Parsing Profiles.json: ERROR -> ${error}`)
        return `Parsing Profiles.json: ERROR -> ${error}`
      }
      WriteToLog(`Parsing Profiles.json: Successful`)
      return Profiles
    }
    else{
      try {
        fs.writeFileSync("profiles.json", JSON.stringify({"profile":[]}))
      } catch (error) {
        WriteToLog(`Creating Profiles.json: ERROR -> ${error}`)
        return `Creating Profiles.json: ERROR -> ${error}`
      }
      try {
        Profiles = JSON.parse(fs.readFileSync('profiles.json'))
      } catch (error) {
        WriteToLog(`Parsing Profiles.json: ERROR -> ${error}`)
        return `Parsing Profiles.json: ERROR -> ${error}`
      }
      WriteToLog(`Created Profiles.json: Successful`)
      return Profiles
    }
  })

  ipcMain.handle('GetAuth', () => {
    if(fs.existsSync("auth.json")){
      try {
        Auth = JSON.parse(fs.readFileSync('auth.json'))
      } catch (error) {
        WriteToLog(`Parsing Auth.json: ERROR -> ${error}`)
        return `Parsing Auth.json: ERROR -> ${error}`
      }
      WriteToLog(`Parsing Auth.json: Successful`)
      return Auth
    }
    else {
      try {
        fs.writeFileSync("auth.json", JSON.stringify({"email":"", "password":""}))
      } catch (error) {
        WriteToLog(`Creating Auth.json: ERROR -> ${error}`)
        return `Creating Auth.json: ERROR -> ${error}`
      }
      try {
        Auth = JSON.parse(fs.readFileSync('auth.json'))
      } catch (error) {
        WriteToLog(`Parsing Auth.json: ERROR -> ${error}`)
        return `Parsing Auth.json: ERROR -> ${error}`
      }
      WriteToLog(`Creating Auth.json: Successful`)
      return Auth
    }
})

ipcMain.handle('GetLogs', () => {
  try {
    return fs.readFileSync("Logs.log").toString()
  } catch (error) {
    fs.writeFileSync("Logs.log","")
    return fs.readFileSync("Logs.log").toString()
  }
})

ipcMain.handle('IsIMG', (event, KeyID)=>{
  return IsProfileCoverIMGExisting(KeyID)
})
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

  win.loadFile('index.html')
}
///////////////////////////////////////////////////////////////////////////////////////////////////


  app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})