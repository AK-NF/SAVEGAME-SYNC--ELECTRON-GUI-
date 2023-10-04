
var Profiles = null
var Auth = null


$("#Sync-ProfileSelection").on("change",()=>{
    appli.IsIMG(Profiles.profile[$("#Sync-ProfileSelection").val()].KeyID).then((obj_img_string)=>{

        if(obj_img_string == "Error-404"){
            $("#GameIMG").css("background-image",`url(SVG/file-unknown-svgrepo-com.svg)`)
        }
        else {
            $("#GameIMG").css("background-image",`url(../../${obj_img_string})`)
        }
    
    })
})


$("#WindowMinimizeButton").on("mouseenter",()=>{
    $("#WindowMinimizeButton").css("background-color","rgba(255, 255, 0, .7)")
})
$("#WindowMinimizeButton").on("mouseleave",()=>{
    $("#WindowMinimizeButton").css("background-color","rgba(0, 0, 0, 0)")
})


INIT()

function INIT(){

$(".MenuElements").addClass("DontShow")

    appli.GetAuth().then((obj_auth) => {

        let ReturnResults = []
        console.log(obj_auth)
    
        if(typeof(obj_auth) == "string"){
            if(obj_auth.includes("ERROR") || obj_auth.includes("error")){ReturnResults.push(obj_auth); CreateAlertWindow(ReturnResults);}
        }else Auth = obj_auth
    
            appli.GetProfiles().then((obj_profiles) => {
                if(typeof(obj_profiles) == "string"){
                    if(obj_profiles.includes("ERROR") || obj_profiles.includes("error")) {ReturnResults.push(obj_profiles); CreateAlertWindow(ReturnResults);}
                }else{
                        Profiles = obj_profiles; 
    
                        if(Auth.email != "" || Auth.password != ""){
                            if(Profiles.profile.length > 0){
                                if(Profiles.profile[0].Name != "" && Profiles.profile[0].KeyID  != "" && Profiles.profile[0].Path  != ""){
                                    appli.IsIMG(Profiles.profile[0].KeyID).then((obj_img_string)=>{

                                        if(obj_img_string == "Error-404"){
                                            $("#GameIMG").css("background-image",`url(SVG/file-unknown-svgrepo-com.svg)`)
                                            $("nav").removeClass("DontShow")
                                            $("main").removeClass("WithoutNavAuthMenu")
                                            DisplayMenuSelected("SaveSyncMain")
                                            $('.center-body-loading').addClass('DontShow');
                                            UpdateDropDownMenu()
                                        }
                                        else {
                                            $("#GameIMG").css("background-image",`url(../../${obj_img_string})`)
                                            $("nav").removeClass("DontShow")
                                            $("main").removeClass("WithoutNavAuthMenu")
                                            DisplayMenuSelected("SaveSyncMain")
                                            $('.center-body-loading').addClass('DontShow');
                                            UpdateDropDownMenu()
                                        }
                                    })

                                }
                                else {
                                    ShowCreateProfileMenu(true)
                                    UpdateDropDownMenu()
                                }
                            }
                            else {
                                ShowCreateProfileMenu(true)
                                UpdateDropDownMenu()
                            }

                        } else {
                            ShowEditAuthMenu(true)
                            UpdateDropDownMenu()
                        }
                }
            })
        }
    )
}




function CreateAlertWindow(message){
    let color = ""
    let colorhover = ""

    message.forEach(element => {
        if(element.includes("ERROR") || element.includes("error")) color = "rgba(255,0,0,.2)";  colorhover = "rgba(255,0,0,.4)";
    });
    if(color == ""){ // when no error was found 
        color = "rgba(0,255,0,.2)"; colorhover = "rgba(0,255,0,.4)";
    }

    if($("#AlertWindow").length){ // check if a Alert is present
        $("#AlertWindow").css("background-color",`${color}`)
        $("#AlertWindow").on("mouseenter", ()=>{$("#AlertWindow").css("background-color",`${colorhover}`)})
        $("#AlertWindow").on("mouseleave", ()=>{$("#AlertWindow").css("background-color",`${color}`)})
        $("#AlertWindow").html(`
            <div id="AlertText"></div>
            <span id="CloseAlertWindow" onclick="$('#AlertWindow').remove()"></span>
        `)
        message.forEach(element => {
            $("#AlertText").append(`
                <p>${element}</p>
            `)
        });
    }
    else{
        $("main").append(`
        <div id="AlertWindow" style="background-color: ${color}">
            <div id="AlertText"></div>
            <span id="CloseAlertWindow" onclick="$('#AlertWindow').remove()"></span>
        </div>
        `) 
        $("#AlertWindow").on("mouseenter",()=>{$("#AlertWindow").css("background-color",`${colorhover}`)})
        $("#AlertWindow").on("mouseleave", ()=>{$("#AlertWindow").css("background-color",`${color}`)})
        message.forEach(element => {
            $("#AlertText").append(`
                <p>${element}</p>
            `)
        });
    }
}

function UpdateCurrentGameImg(){
    appli.IsIMG(Profiles.profile[$("#Sync-ProfileSelection").val()].KeyID).then((obj_img_string)=>{

        if(obj_img_string == "Error-404"){
            $("#GameIMG").css("background-image",`url(SVG/file-unknown-svgrepo-com.svg)`)
        }
        else {
            $("#GameIMG").css("background-image",`url(../../${obj_img_string})`)
        }
    
    })
}

function DisplayMenuSelected(MenuID){
    $(".MenuElements").addClass("DontShow")
    $(".MenuElements").css({"opacity":"0", "filter":"blur(10px)"})

    $(`#${MenuID}`).removeClass("DontShow")
    setTimeout(()=>{
        $(`#${MenuID}`).css({"opacity":"1", "filter":"blur(0px)"})
    }, 100)
}

function ChangeDisplayState_LoadingAnim(StateOn){
    if(StateOn){
        $('.center-body-loading').removeClass('DontShow');
        setTimeout(()=>{
            $('.center-body-loading').css({"opacity":"1", "filter":"blur(0px)"})
        }, 10)
    }
    else{
        $('.center-body-loading').css({"opacity":"0", "filter":"blur(10px)"})
        setTimeout(()=>{
            $('.center-body-loading').removeClass('DontShow');
        }, 10)
    }
}


function UpdateDropDownMenu(){
    
   $(".ProfileSelection").html("")
    Profiles.profile.forEach((element, index) => {
        document.querySelectorAll(".ProfileSelection").forEach(ProfileSelectorElement => {
            ProfileSelectorElement.innerHTML += `<option value="${index}">${element.Name}</option>`
        });
       
    });

}

function GetAuthforTextfields(){
    $("#AuthEmailField").val(Auth.email);
    $("#AuthPasswordField").val(Auth.password)
}

function ShowEditAuthMenu(IsINIT){

    if(IsINIT){

        $("main").addClass("WithoutNavAuthMenu")
        $("nav").addClass("DontShow")

        DisplayMenuSelected("SaveAuth")
        
        $("#SaveAuthButton").off()
        $("#SaveAuthButton").on("click", ()=>{SaveAuth(true)})

        $("#AuthEmailField").val(`${Auth.email}`)
        $("#AuthPasswordField").val(`${Auth.password}`)
    }
    else {
        DisplayMenuSelected("SaveAuth")

        $("#SaveAuthButton").off()
        $("#SaveAuthButton").on("click", ()=>{SaveAuth(false)})

        $("#AuthEmailField").val(`${Auth.email}`)
        $("#AuthPasswordField").val(`${Auth.password}`)
    }


}

function ShowCreateProfileMenu(IsINIT){

    if(IsINIT){
        $("main").addClass("WithoutNavAuthMenu")
        $("nav").addClass("DontShow")

        DisplayMenuSelected("CreateProfile")

        $("#CreateProfileButton").off()
        $("#CreateProfileButton").on("click", ()=>{CreateProfile(true)})
        $("#CancleCreateProfileButton").css("display", "none !important")

        $("#CreateProfileNameField").val(``)
        $("#CreateProfileKeyIDField").val(``)
        $("#CreateProfilePathField").val(``)
    }
    else{
        DisplayMenuSelected("CreateProfile")

        $("#CreateProfileButton").off()
        $("#CreateProfileButton").on("click", ()=>{CreateProfile(false)})
        $("#CancleCreateProfileButton").css("display", "initial")

        $("#CreateProfileNameField").val(``)
        $("#CreateProfileKeyIDField").val(``)
        $("#CreateProfilePathField").val(``)
    }

}

function ShowEditProfileMenu(IndexOfEntry){
    DisplayMenuSelected("EditProfile")
    $("#ProfileSelectedHeader").html(`Profile: ${Profiles.profile[IndexOfEntry].Name}`)
    $("#EditProfileNameField").val(`${Profiles.profile[IndexOfEntry].Name}`)
    $("#EditProfileKeyIDField").val(`${Profiles.profile[IndexOfEntry].KeyID}`)
    $("#EditProfilePathField").val(`${Profiles.profile[IndexOfEntry].Path}`)
}

function SaveAuth(IsINIT){
    const ReturnResults = []

    Auth.email = $("#AuthEmailField").val()
    Auth.password = $("#AuthPasswordField").val()

    appli.AuthUpdate(Auth).then((obj)=>{
        console.log(obj)
        ReturnResults.push(obj)

        appli.GetAuth().then((obj)=>{
            if(typeof(obj) == "string"){
                if(obj.includes("ERROR") || obj.includes("error")) {ReturnResults.push(obj); CreateAlertWindow(ReturnResults);}
            }
            else{
                if(Auth.email != "" || Auth.password != "") {
                    if(IsINIT){
                        console.log("Get Auth: Successful")
                        ReturnResults.push("Get Auth: Successful")
        
                        CreateAlertWindow(ReturnResults)

                        INIT()//ShowCreateProfileMenu(true)
                    }
                    else{
                        Auth = obj
                        console.log("Get Auth: Successful")
                        ReturnResults.push("Get Auth: Successful")
        
                        CreateAlertWindow(ReturnResults)
        
                        $("nav").removeClass("DontShow")
                        $("main").removeClass("WithoutNavAuthMenu")

                        DisplayMenuSelected("SaveSyncMain")
                    }

                }
                else {

                    if(IsINIT){
                        console.log("Get Auth: ERROR -> Empty String")
                        ReturnResults.push("Get Auth: ERROR -> Empty String")
        
                        CreateAlertWindow(ReturnResults)
                
                    }
                    else{
                        console.log("Get Auth: ERROR -> Empty String")
                        ReturnResults.push("Get Auth: ERROR -> Empty String")
        
                        CreateAlertWindow(ReturnResults)
        
                        $("nav").removeClass("DontShow")
                        $("main").removeClass("WithoutNavAuthMenu")
                    
                    }

                }
            }
        })
    })
}


function CreateProfile(IsINIT){
    const ReturnResults = []

    Profiles.profile.push(
        {
            "Name": $("#CreateProfileNameField").val(),
            "KeyID": $("#CreateProfileKeyIDField").val(),
            "Path": $("#CreateProfilePathField").val()
        }
    )

    appli.ProfilesUpdate(Profiles, $("#CreateProfileNameField").val()).then((obj)=>{
        console.log(obj)
        ReturnResults.push(obj)


        appli.GetProfiles().then((obj)=>{

            if(typeof(obj) == "string"){
                if(obj.includes("ERROR") || obj.includes("error")) {ReturnResults.push(obj); CreateAlertWindow(ReturnResults);}
            }
            else{
                if(Profiles.profile[0].Name != "" && Profiles.profile[0].KeyID  != "" && Profiles.profile[0].Path  != "") {
                    if(IsINIT){
                        Profiles = obj
                        UpdateDropDownMenu()
                        UpdateCurrentGameImg()
                        
                        console.log("Get Profiles: Successful")
                        ReturnResults.push("Get Profiles: Successful")
    
                        CreateAlertWindow(ReturnResults)
                        DisplayMenuSelected("SaveSyncMain")

                        $("nav").removeClass("DontShow")
                        $("main").removeClass("WithoutNavAuthMenu")
                    }
                    else {
                        Profiles = obj
                        UpdateDropDownMenu()
                        UpdateCurrentGameImg()
                        
                        console.log("Get Profiles: Successful")
                        ReturnResults.push("Get Profiles: Successful")
    
                        CreateAlertWindow(ReturnResults)
                        DisplayMenuSelected("SaveSyncMain")

                        $("nav").removeClass("DontShow")
                        $("main").removeClass("WithoutNavAuthMenu")
                    }

                }
                else {

                    if(IsINIT){

                        console.log("Get Profiles: ERROR -> Empty String")
                        ReturnResults.push("Get Profiles: ERROR -> Empty String")
                        CreateAlertWindow(ReturnResults)

                    }
                    else{
                        console.log("Get Profiles: ERROR -> Empty String")
                        ReturnResults.push("Get Profiles: ERROR -> Empty String")
                        CreateAlertWindow(ReturnResults)

                        DisplayMenuSelected("SaveSyncMain")

                        $("nav").removeClass("DontShow")
                        $("main").removeClass("WithoutNavAuthMenu")
                    }

                }
            }
        })
    })
}


function EditProfile(IndexOfEntry){
    const ReturnResults = []

    Profiles.profile[IndexOfEntry].Name = $("#EditProfileNameField").val()
    Profiles.profile[IndexOfEntry].KeyID = $("#EditProfileKeyIDField").val()
    Profiles.profile[IndexOfEntry].Path =$("#EditProfilePathField").val()

    appli.ProfilesUpdate(Profiles).then((obj)=>{
        console.log(obj)
        ReturnResults.push(obj)


        appli.GetProfiles().then((obj)=>{
            if(typeof(obj) == "string"){
                if(obj.includes("ERROR") || obj.includes("error")) {ReturnResults.push(obj); CreateAlertWindow(ReturnResults);}
            }
            else{
                if(Profiles != null || Profiles != "") {
                    Profiles = obj
                    UpdateDropDownMenu()
                    UpdateCurrentGameImg()

                    console.log("Get Profiles: Successful")
                    ReturnResults.push("Get Profiles: Successful")
    
                    CreateAlertWindow(ReturnResults)
                    DisplayMenuSelected("SaveSyncMain")
                }
                else {
                    console.log("Get Profiles: ERROR -> Empty String")
                    ReturnResults.push("Get Profiles: ERROR -> Empty String")
    
                    CreateAlertWindow(ReturnResults)
                    DisplayMenuSelected("SaveSyncMain")
                }
            }
        })
    })
}

async function DeleteEntryProfile(IndexOfEntry){
    const ReturnResults = []

    Profiles.profile.splice(IndexOfEntry,1)
        
    appli.ProfilesUpdate(Profiles).then((obj)=>{

        console.log(obj)
        ReturnResults.push(obj)


        appli.GetProfiles().then((obj)=>{
            if(typeof(obj) == "string"){
                if(obj.includes("ERROR") || obj.includes("error")) {ReturnResults.push(obj); CreateAlertWindow(ReturnResults);}
            } else{
                if(Profiles != null || Profiles != "") {
                    Profiles = obj
                    UpdateDropDownMenu()
                    UpdateCurrentGameImg()
                    
                    console.log("Get Profiles: Successful")
                    ReturnResults.push("Get Profiles: Successful")
                    CreateAlertWindow(ReturnResults) 
                }
                else {
                        console.log("Get Profiles: ERROR -> Empty String")
                        ReturnResults.push("Get Profiles: ERROR -> Empty String")
                        CreateAlertWindow(ReturnResults) 
                    }
            }
        })
    })
}
    
